/**
 * Date and Time utilities for consistent timezone and UTC timestamp formatting.
 *
 * Backend timestamps stored in UTC (datetime.utcnow()) are often serialized
 * without timezone designators (naive ISO strings like '2026-09-27T18:38:00').
 * This module ensures naive UTC strings are correctly treated as UTC by appending 'Z'
 * before converting to the user's local timezone.
 */

/**
 * Checks whether a timestamp string already contains timezone information.
 * Recognizes 'Z' / 'z' or offset indicators (+HH:MM, -HH:MM, +HHMM, -HHMM, +HH, -HH)
 * following a time component.
 *
 * @param {string} dateStr
 * @returns {boolean}
 */
export function hasTimezoneInfo(dateStr) {
  if (typeof dateStr !== "string") return false;
  const str = dateStr.trim();
  if (/[zZ]$/.test(str)) return true;
  if (/[T\s]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?\s*([+-]\d{2}(?::?\d{2})?)$/.test(str)) {
    return true;
  }
  return false;
}

/**
 * Parses a backend timestamp (which may be a naive UTC string) into a valid Date object.
 * If the string has no timezone indicator, treats it as UTC by appending 'Z'.
 *
 * @param {string|number|Date|null|undefined} value
 * @returns {Date|null}
 */
export function parseUtcDate(value) {
  if (!value) return null;
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }
  if (typeof value === "number") {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }
  if (typeof value !== "string") return null;

  let str = value.trim();
  if (!str) return null;

  if (!hasTimezoneInfo(str)) {
    // Convert "YYYY-MM-DD HH:mm:ss" to standard ISO "YYYY-MM-DDTHH:mm:ss"
    str = str.replace(" ", "T");
    str = `${str}Z`;
  }

  const parsed = new Date(str);
  return isNaN(parsed.getTime()) ? null : parsed;
}

/**
 * Formats a timestamp into a readable date and time string in the user's local timezone.
 * Defaults to: dateStyle: "medium", timeStyle: "short" (e.g. "Sep 28, 2026, 12:08 AM").
 *
 * @param {string|number|Date|null|undefined} timestamp
 * @param {Intl.DateTimeFormatOptions & { fallback?: string }} [options]
 * @param {string} [locale="en-US"]
 * @returns {string}
 */
export function formatDateTime(timestamp, options = {}, locale = "en-US") {
  const date = parseUtcDate(timestamp);
  if (!date) return options?.fallback ?? "—";

  const formatOptions = { ...options };
  delete formatOptions.fallback;

  const hasExplicitFields = [
    "weekday",
    "year",
    "month",
    "day",
    "hour",
    "minute",
    "second",
    "timeZoneName",
  ].some((key) => key in formatOptions);

  const finalOptions = hasExplicitFields
    ? formatOptions
    : {
        dateStyle: "medium",
        timeStyle: "short",
        ...formatOptions,
      };

  return date.toLocaleString(locale, finalOptions);
}

/**
 * Formats a timestamp into a readable date-only string in the user's local timezone.
 * Defaults to: dateStyle: "medium" (e.g. "Sep 28, 2026").
 *
 * @param {string|number|Date|null|undefined} timestamp
 * @param {Intl.DateTimeFormatOptions & { fallback?: string }} [options]
 * @param {string} [locale="en-US"]
 * @returns {string}
 */
export function formatDate(timestamp, options = {}, locale = "en-US") {
  const date = parseUtcDate(timestamp);
  if (!date) return options?.fallback ?? "—";

  const formatOptions = { ...options };
  delete formatOptions.fallback;

  const hasExplicitFields = [
    "weekday",
    "year",
    "month",
    "day",
  ].some((key) => key in formatOptions);

  const finalOptions = hasExplicitFields
    ? formatOptions
    : {
        dateStyle: "medium",
        ...formatOptions,
      };

  return date.toLocaleDateString(locale, finalOptions);
}
