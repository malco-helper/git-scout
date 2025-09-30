import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { DateParser } from "../date";

describe("DateParser", () => {
  let mockDate: Date;

  beforeEach(() => {
    // Mock current date to 2025-09-30 12:00:00
    mockDate = new Date("2025-09-30T12:00:00Z");
    vi.useFakeTimers();
    vi.setSystemTime(mockDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("parseDate", () => {
    it('should parse "today" to start of today', () => {
      const result = DateParser.parseDate("today");
      const expected = new Date("2025-09-30T00:00:00.000Z");
      expect(result.toISOString()).toBe(expected.toISOString());
    });

    it('should parse "yesterday" to start of yesterday', () => {
      const result = DateParser.parseDate("yesterday");
      const expected = new Date("2025-09-29T00:00:00.000Z");
      expect(result.toISOString()).toBe(expected.toISOString());
    });

    it('should parse "7d" to 7 days ago', () => {
      const result = DateParser.parseDate("7d");
      const expected = new Date("2025-09-23T00:00:00.000Z");
      expect(result.toISOString()).toBe(expected.toISOString());
    });

    it('should parse "today 09:30" to specific time today', () => {
      const result = DateParser.parseDate("today 09:30");
      expect(result.getHours()).toBe(9);
      expect(result.getMinutes()).toBe(30);
      expect(result.getDate()).toBe(30);
      expect(result.getMonth()).toBe(8); // September (0-indexed)
    });

    it("should parse ISO date strings", () => {
      const result = DateParser.parseDate("2025-09-15");
      const expected = new Date("2025-09-15");
      expect(result.toDateString()).toBe(expected.toDateString());
    });

    it("should throw error for invalid date formats", () => {
      expect(() => DateParser.parseDate("invalid-date")).toThrow(
        "Invalid date format"
      );
    });
  });

  describe("parseDateRange", () => {
    it("should parse since and until dates", () => {
      const result = DateParser.parseDateRange("7d", "today");

      expect(result.since).toBeDefined();
      expect(result.until).toBeDefined();
      expect(result.since!.getDate()).toBe(23); // 7 days ago
      expect(result.until!.getDate()).toBe(30); // today
    });

    it("should handle missing until date", () => {
      const result = DateParser.parseDateRange("7d");

      expect(result.since).toBeDefined();
      expect(result.until).toBeUndefined();
    });

    it("should validate date range order", () => {
      expect(() => DateParser.parseDateRange("today", "7d")).toThrow(
        "Since date cannot be after until date"
      );
    });
  });

  describe("formatForGit", () => {
    it("should format date for Git commands", () => {
      const date = new Date("2025-09-30T12:00:00Z");
      const result = DateParser.formatForGit(date);
      expect(result).toBe("2025-09-30T12:00:00.000Z");
    });
  });

  describe("getToday", () => {
    it("should return start of today", () => {
      const result = DateParser.getToday();
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
      expect(result.getDate()).toBe(30);
    });
  });

  describe("isToday", () => {
    it("should return true for dates within today", () => {
      const todayMorning = new Date("2025-09-30T08:00:00");
      const todayEvening = new Date("2025-09-30T20:00:00");

      expect(DateParser.isToday(todayMorning)).toBe(true);
      expect(DateParser.isToday(todayEvening)).toBe(true);
    });

    it("should return false for dates outside today", () => {
      const yesterday = new Date("2025-09-29T23:59:59");
      const tomorrow = new Date("2025-10-01T00:00:01");

      expect(DateParser.isToday(yesterday)).toBe(false);
      expect(DateParser.isToday(tomorrow)).toBe(false);
    });
  });
});
