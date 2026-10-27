import { SectionHead } from "components/hairline/SectionHead/SectionHead";
import styles from "features/open-source/OpenSourceActivity.module.css";
import { OpenSourceActivityGraph } from "features/open-source/OpenSourceActivityGraph";
import { OPEN_SOURCE_CONTRIBUTION_SNAPSHOT } from "data/openSourceActivity";
import {
  OPEN_SOURCE_ACTIVITY_HEADING,
  OPEN_SOURCE_ACTIVITY_SNAPSHOT_LEDE,
  OPEN_SOURCE_ACTIVITY_STAT_LABELS,
  OPEN_SOURCE_ACTIVITY_TABLE_CAPTION,
  OPEN_SOURCE_ACTIVITY_TABLE_HEADERS,
  openSourceActivityDaysLabel,
  openSourceActivitySnapshotLabel,
  openSourceActivityStreakUnit,
  openSourceActivitySummary,
} from "data/openSourcePage";
import {
  calendarLayout,
  contributionStats,
  formatSnapshotDay,
  monthlyContributions,
  pluralize,
} from "utils/contributions";

const formatCount = (count: number) => count.toLocaleString("en-US");

/**
 * Contribution activity from a dated snapshot of the public GitHub calendar: four stats, the
 * calendar itself (one column per week) and a per-month table for screen readers.
 */
export const OpenSourceActivity = () => {
  const snapshot = OPEN_SOURCE_CONTRIBUTION_SNAPSHOT;
  const stats = contributionStats(snapshot);
  const calendar = calendarLayout(snapshot);
  const months = monthlyContributions(snapshot);
  const rows = [
    {
      label: OPEN_SOURCE_ACTIVITY_STAT_LABELS.total,
      value: formatCount(stats.total),
      unit: OPEN_SOURCE_ACTIVITY_STAT_LABELS.totalUnit,
    },
    {
      label: OPEN_SOURCE_ACTIVITY_STAT_LABELS.active,
      value: formatCount(stats.activeDays),
      unit: openSourceActivityDaysLabel(stats.days),
    },
    {
      label: OPEN_SOURCE_ACTIVITY_STAT_LABELS.streak,
      value: String(stats.longestStreak),
      unit: openSourceActivityStreakUnit(stats.longestStreak),
    },
    {
      label: OPEN_SOURCE_ACTIVITY_STAT_LABELS.busiest,
      value: String(stats.busiestCount),
      unit: formatSnapshotDay(stats.busiestDay),
    },
  ];
  const summary = openSourceActivitySummary(
    pluralize(stats.total, "contribution"),
    formatSnapshotDay(stats.first),
    formatSnapshotDay(stats.last)
  );
  const restLabel = openSourceActivitySnapshotLabel(
    formatSnapshotDay(new Date(`${snapshot.taken}T00:00:00Z`))
  );

  return (
    <section id="activity" aria-labelledby="activity-title">
      <div className={styles.head}>
        <SectionHead
          title={OPEN_SOURCE_ACTIVITY_HEADING}
          titleId="activity-title"
          lede={OPEN_SOURCE_ACTIVITY_SNAPSHOT_LEDE}
        />
      </div>
      <dl className={styles.stats}>
        {rows.map((row) => (
          <div key={row.label}>
            <dt className={styles.statLabel}>{row.label}</dt>
            <dd>{row.value}</dd>
            <dd className={styles.unit}>{row.unit}</dd>
          </div>
        ))}
      </dl>
      <OpenSourceActivityGraph calendar={calendar} summary={summary} restLabel={restLabel} />
      <table className={styles.srOnly}>
        <caption>{OPEN_SOURCE_ACTIVITY_TABLE_CAPTION}</caption>
        <thead>
          <tr>
            <th scope="col">{OPEN_SOURCE_ACTIVITY_TABLE_HEADERS.month}</th>
            <th scope="col">{OPEN_SOURCE_ACTIVITY_TABLE_HEADERS.total}</th>
          </tr>
        </thead>
        <tbody>
          {months.map((month) => (
            <tr key={month.month}>
              <th scope="row">{month.month}</th>
              <td>{formatCount(month.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};
