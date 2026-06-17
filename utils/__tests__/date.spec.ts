import { formatDate } from "utils/date";

describe("utils/date", () => {
  const originalToLocaleDateString = Date.prototype.toLocaleDateString;

  afterEach(() => {
    Date.prototype.toLocaleDateString = originalToLocaleDateString;
  });

  it("should format long dates for valid inputs", () => {
    const result = formatDate("2024-01-02");
    expect(result).toMatch(/2024/);
  });

  it("should fall back to original string when long format throws", () => {
    Date.prototype.toLocaleDateString = function () {
      throw new RangeError("Invalid time value");
    };

    const result = formatDate("bad-date");
    expect(result).toBe("bad-date");
  });

  it("should handle another valid date string", () => {
    const result = formatDate("2025-12-31");
    expect(result).toMatch(/2025/);
  });
});
