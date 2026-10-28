import {
  isCalendarDate,
  isPreview,
  isPublished,
  isRoutable,
  modifiedDate,
  publicationInstant,
  publicationState,
  publicationTimestamp,
} from "utils/publication";

const at = (iso: string) => new Date(iso);
const ms = (iso: string) => Date.parse(iso);

describe("publicationInstant", () => {
  it.each([
    ["2026-01-20", "2026-01-20T05:00:00.000Z", "2026-01-20T00:00:00-05:00"],
    ["2026-10-28", "2026-10-28T04:00:00.000Z", "2026-10-28T00:00:00-04:00"],
    ["2026-03-08", "2026-03-08T05:00:00.000Z", "2026-03-08T00:00:00-05:00"],
    ["2026-03-09", "2026-03-09T04:00:00.000Z", "2026-03-09T00:00:00-04:00"],
    ["2026-11-01", "2026-11-01T04:00:00.000Z", "2026-11-01T00:00:00-04:00"],
    ["2026-11-02", "2026-11-02T05:00:00.000Z", "2026-11-02T00:00:00-05:00"],
    ["2027-03-14", "2027-03-14T05:00:00.000Z", "2027-03-14T00:00:00-05:00"],
    ["2027-01-01", "2027-01-01T05:00:00.000Z", "2027-01-01T00:00:00-05:00"],
    ["2028-02-29", "2028-02-29T05:00:00.000Z", "2028-02-29T00:00:00-05:00"],
  ])("%s starts at %s (%s)", (date, utc, withOffset) => {
    expect(publicationInstant(date).toISOString()).toBe(utc);
    expect(publicationTimestamp(date)).toBe(withOffset);
    expect(Date.parse(publicationTimestamp(date))).toBe(Date.parse(utc));
  });

  it.each(["2026-02-30", "2026-13-01", "2026-1-5", "Oct 28 2026", "", "2026-10-28T00:00:00Z"])(
    "rejects %j",
    (value) => {
      expect(isCalendarDate(value)).toBe(false);
      expect(() => publicationInstant(value)).toThrow("Not a YYYY-MM-DD date");
    }
  );
});

describe("publicationState", () => {
  const post = { date: "2026-10-30" };
  const midnight = ms("2026-10-30T04:00:00.000Z");

  it("is scheduled one millisecond before Toronto midnight, published at and after it", () => {
    expect(publicationState(post, new Date(midnight - 1))).toBe("scheduled");
    expect(publicationState(post, new Date(midnight))).toBe("published");
    expect(publicationState(post, new Date(midnight + 1))).toBe("published");
  });

  it("follows Toronto, not UTC or the visitor's calendar", () => {
    expect(publicationState(post, at("2026-10-30T03:30:00Z"))).toBe("scheduled");
    expect(publicationState(post, at("2026-10-30T04:30:00Z"))).toBe("published");
  });

  it.each([
    ["2026-03-08", "2026-03-08T04:59:59.999Z", "2026-03-08T05:00:00.000Z"],
    ["2026-11-01", "2026-11-01T03:59:59.999Z", "2026-11-01T04:00:00.000Z"],
    ["2026-11-02", "2026-11-02T04:59:59.999Z", "2026-11-02T05:00:00.000Z"],
  ])("switches on the DST-boundary day %s exactly at local midnight", (date, before, after) => {
    expect(publicationState({ date }, at(before))).toBe("scheduled");
    expect(publicationState({ date }, at(after))).toBe("published");
  });

  it("keeps a draft a draft whatever the date", () => {
    expect(publicationState({ date: "2020-01-01", draft: true }, at("2026-10-28T12:00:00Z"))).toBe(
      "draft"
    );
  });
});

describe("visibility", () => {
  const before = at("2026-10-29T12:00:00Z");
  const after = at("2026-10-30T12:00:00Z");
  const scheduled = { date: "2026-10-30" };
  const preview = { date: "2026-10-30", preview: true };
  const draft = { date: "2026-10-01", draft: true };

  it("lists and routes a post only once it is published", () => {
    expect([isPublished(scheduled, before), isRoutable(scheduled, before)]).toEqual([false, false]);
    expect([isPublished(scheduled, after), isRoutable(scheduled, after)]).toEqual([true, true]);
  });

  it("routes a preview before its date without listing it, then treats it as published", () => {
    expect([
      isPublished(preview, before),
      isPreview(preview, before),
      isRoutable(preview, before),
    ]).toEqual([false, true, true]);
    expect([isPublished(preview, after), isPreview(preview, after)]).toEqual([true, false]);
  });

  it("never routes or lists a draft", () => {
    expect([isPublished(draft, after), isPreview(draft, after), isRoutable(draft, after)]).toEqual([
      false,
      false,
      false,
    ]);
  });

  it("uses updated for modification metadata when given", () => {
    expect(modifiedDate({ date: "2026-10-01" })).toBe("2026-10-01");
    expect(modifiedDate({ date: "2026-10-01", updated: "2026-10-20" })).toBe("2026-10-20");
  });
});
