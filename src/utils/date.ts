import { DateRange } from "../types";

export class DateParser {
  /**
   * Parse date string in various formats:
   * - "today" -> start of today
   * - "yesterday" -> start of yesterday
   * - "7d" -> 7 days ago
   * - "2025-09-29" -> specific date
   * - "today 00:00" -> specific time today
   * - ISO date strings
   */
  public static parseDate(dateStr: string): Date {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Handle relative dates
    if (dateStr === "today") {
      return today;
    }

    if (dateStr === "yesterday") {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return yesterday;
    }

    if (dateStr === "now") {
      return now;
    }

    // Handle "Xd" format (X days ago)
    const daysMatch = dateStr.match(/^(\d+)d$/);
    if (daysMatch) {
      const days = parseInt(daysMatch[1], 10);
      const date = new Date(today);
      date.setDate(date.getDate() - days);
      return date;
    }

    // Handle "today HH:mm" format
    const todayTimeMatch = dateStr.match(/^today\s+(\d{1,2}):(\d{2})$/);
    if (todayTimeMatch) {
      const hours = parseInt(todayTimeMatch[1], 10);
      const minutes = parseInt(todayTimeMatch[2], 10);
      const date = new Date(today);
      date.setHours(hours, minutes, 0, 0);
      return date;
    }

    // Handle "yesterday HH:mm" format
    const yesterdayTimeMatch = dateStr.match(/^yesterday\s+(\d{1,2}):(\d{2})$/);
    if (yesterdayTimeMatch) {
      const hours = parseInt(yesterdayTimeMatch[1], 10);
      const minutes = parseInt(yesterdayTimeMatch[2], 10);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(hours, minutes, 0, 0);
      return yesterday;
    }

    // Try to parse as ISO date or other standard formats
    const parsedDate = new Date(dateStr);
    if (isNaN(parsedDate.getTime())) {
      throw new Error(`Invalid date format: ${dateStr}`);
    }

    return parsedDate;
  }

  /**
   * Parse date range from since/until parameters
   */
  public static parseDateRange(since?: string, until?: string): DateRange {
    const range: DateRange = {};

    if (since) {
      range.since = this.parseDate(since);
    }

    if (until) {
      range.until = this.parseDate(until);
    }

    // Validate range
    if (range.since && range.until && range.since > range.until) {
      throw new Error("Since date cannot be after until date");
    }

    return range;
  }

  /**
   * Format date for Git commands (ISO format)
   */
  public static formatForGit(date: Date): string {
    return date.toISOString();
  }

  /**
   * Format date for display (macOS local time)
   */
  public static formatForDisplay(date: Date): string {
    return date
      .toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      })
      .replace(",", "");
  }

  /**
   * Get default since date based on config
   */
  public static getDefaultSince(defaultDays: number): Date {
    const date = new Date();
    date.setDate(date.getDate() - defaultDays);
    date.setHours(0, 0, 0, 0); // Start of day
    return date;
  }

  /**
   * Get start of today
   */
  public static getToday(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  /**
   * Get end of today
   */
  public static getEndOfToday(): Date {
    const today = this.getToday();
    today.setHours(23, 59, 59, 999);
    return today;
  }

  /**
   * Check if a date is today
   */
  public static isToday(date: Date): boolean {
    const today = this.getToday();
    const endOfToday = this.getEndOfToday();
    return date >= today && date <= endOfToday;
  }

  /**
   * Get timezone info for macOS
   */
  public static getTimezone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
}
