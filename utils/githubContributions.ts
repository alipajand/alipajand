import {
  type ContributionSnapshot,
  OPEN_SOURCE_CONTRIBUTION_SNAPSHOT,
} from "data/openSourceActivity";

export const CONTRIBUTIONS_REVALIDATE_SECONDS = 21600;

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";
const REQUEST_TIMEOUT_MS = 5000;
const MIN_DAYS = 300;

const QUERY = `query ($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        weeks { contributionDays { date contributionCount contributionLevel } }
      }
    }
  }
}`;

const LEVELS = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
} as const;

interface ContributionDay {
  date: string;
  contributionCount: number;
  contributionLevel: keyof typeof LEVELS;
}

interface CalendarResponse {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: { weeks?: { contributionDays?: ContributionDay[] }[] };
      };
    } | null;
  };
  errors?: { message: string }[];
}

export const snapshotFromCalendar = (
  user: string,
  body: CalendarResponse
): ContributionSnapshot => {
  if (body.errors?.length) throw new Error(body.errors.map((error) => error.message).join("; "));
  const weeks = body.data?.user?.contributionsCollection?.contributionCalendar?.weeks ?? [];
  const days = weeks
    .flatMap((week) => week.contributionDays ?? [])
    .sort((a, b) => a.date.localeCompare(b.date));
  if (days.length < MIN_DAYS) throw new Error(`only ${days.length} days returned`);
  const counts = days.map((day) => day.contributionCount);
  return {
    user,
    taken: days[days.length - 1].date,
    from: days[0].date,
    total: counts.reduce((sum, count) => sum + count, 0),
    counts,
    levels: days.map((day) => LEVELS[day.contributionLevel] ?? 0),
  };
};

export const getContributionSnapshot = async (
  fallback: ContributionSnapshot = OPEN_SOURCE_CONTRIBUTION_SNAPSHOT
): Promise<ContributionSnapshot> => {
  const token = process.env.GITHUB_TOKEN?.trim();
  if (!token) return fallback;
  try {
    const res = await fetch(GITHUB_GRAPHQL_URL, {
      method: "POST",
      headers: {
        Authorization: `bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "alipajand.com",
      },
      body: JSON.stringify({ query: QUERY, variables: { login: fallback.user } }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      next: { revalidate: CONTRIBUTIONS_REVALIDATE_SECONDS },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return snapshotFromCalendar(fallback.user, (await res.json()) as CalendarResponse);
  } catch (error) {
    console.warn(
      `GitHub contributions: using the ${fallback.taken} snapshot (${(error as Error).message})`
    );
    return fallback;
  }
};
