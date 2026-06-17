import { splitRoleLine } from "utils/projectRole";

describe("splitRoleLine", () => {
  it("should split title and company on last middle dot", () => {
    expect(splitRoleLine("Senior engineer · MapBylaw")).toEqual({
      title: "Senior engineer",
      company: "MapBylaw",
    });
  });

  it("should preserve middle segments in title when multiple middle dots", () => {
    expect(splitRoleLine("Lead / Senior frontend engineer · AlwaysGeeky Games")).toEqual({
      title: "Lead / Senior frontend engineer",
      company: "AlwaysGeeky Games",
    });
  });

  it("should return full string as title when no separator", () => {
    expect(splitRoleLine("Developer")).toEqual({ title: "Developer", company: "" });
  });
});
