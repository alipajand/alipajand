import {
  hasTopic,
  pad,
  pickFeatured,
  timelinePosition,
  timelineRange,
  topicLanes,
} from "features/writing/writingModel";
import { mcpWorkflowFlow } from "features/writing/WritingMcpWorkflow";
import { launchSceneStep } from "features/writing/WritingLaunchScene";
import { timelineReadout } from "features/writing/WritingTimeline";
import { WRITING_POST_MCP_FIGCAPTION } from "data/writing";

const post = (tags: string[], extra: Partial<{ featured: boolean; upcoming: boolean }> = {}) => ({
  tags,
  featured: false,
  upcoming: false,
  ...extra,
});

describe("writingModel", () => {
  it("should group tags case-insensitively, keep the first spelling and sort by use", () => {
    const lanes = topicLanes(
      [post(["AI", "DX"]), post(["ai", "React"]), post(["Ai", "dx"]), post(["React"])],
      2
    );
    expect(lanes).toEqual([
      { key: "ai", label: "AI", count: 3 },
      { key: "dx", label: "DX", count: 2 },
      { key: "react", label: "React", count: 2 },
    ]);
  });

  it("should count a tag once per post and drop lanes under the minimum", () => {
    expect(topicLanes([post(["AI", "ai"]), post(["DX"])], 2)).toEqual([]);
  });

  it("should match topics by key, with all matching everything", () => {
    expect(hasTopic(post(["Design Systems"]), "design systems")).toBe(true);
    expect(hasTopic(post(["React"]), "ai")).toBe(false);
    expect(hasTopic(post([]), "all")).toBe(true);
  });

  it("should feature only a published post", () => {
    const upcoming = post([], { featured: true, upcoming: true });
    const published = post([], { featured: true });
    expect(pickFeatured([upcoming, published])).toBe(published);
    expect(pickFeatured([upcoming])).toBeNull();
  });

  it("should pad indexes from one", () => {
    expect(pad(0)).toBe("01");
    expect(pad(11)).toBe("12");
  });

  it("should span whole months from January to the month after the newest post", () => {
    const range = timelineRange(["2026-10-28", "2026-03-04", "2026-07-19"]);
    expect(range).toEqual({
      start: Date.UTC(2026, 0, 1),
      end: Date.UTC(2026, 10, 1),
      months: 10,
      year: 2026,
    });
    expect(timelinePosition("2026-01-01", range)).toBe(0);
    expect(timelinePosition("2026-11-01", range)).toBe(1);
  });

  it("should cross years and tolerate an empty list", () => {
    expect(timelineRange(["2025-11-02", "2026-02-10"]).months).toBe(14);
    expect(timelineRange([]).year).toBe(2026);
  });

  it("should describe the timeline position for the readout", () => {
    const posts = [
      { slug: "a", title: "A", tags: [], date: "2026-03-04", upcoming: false },
      { slug: "b", title: "B", tags: [], date: "2026-10-28", upcoming: true },
    ];
    expect(timelineReadout(posts, 1)).toBe("02 / 2 · Oct 28 · Upcoming");
    expect(timelineReadout(posts, 0)).not.toContain("Upcoming");
  });

  it("should step the launch scene at the artifact's thresholds", () => {
    expect([0, 0.29, 0.3, 0.63, 0.64, 1].map(launchSceneStep)).toEqual([1, 1, 2, 2, 3, 3]);
  });

  it("should build the MCP workflow flow with the default caption", () => {
    const flow = mcpWorkflowFlow();
    expect(flow.type).toBe("flow");
    expect(flow.steps).toHaveLength(3);
    expect(flow.caption).toBe(WRITING_POST_MCP_FIGCAPTION);
    expect(mcpWorkflowFlow("Custom").caption).toBe("Custom");
  });
});
