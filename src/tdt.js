// src/tdt.js
// Time Delta T (TDT) utilities for measuring elapsed time in multiple units

/**
 * Count ticks between two dates in the chosen unit.
 * @param {Date} start - starting time (default = Unix epoch 1970-01-01).
 * @param {Date} end - ending time (default = now).
 * @param {string} unit - one of: "years", "months", "days", "hours",
 *                        "minutes", "seconds", "milliseconds",
 *                        "microseconds", "nanoseconds"
 * @returns {number} number of ticks
 */
export function countTicks(start = new Date(0), end = new Date(), unit = "seconds") {
  if (["years", "months"].includes(unit)) {
    // Calendar math: approximate like Python relativedelta
    const years = end.getFullYear() - start.getFullYear();
    const months = end.getMonth() - start.getMonth();
    const days = end.getDate() - start.getDate();

    if (unit === "years") {
      return years + months / 12 + days / 365;
    } else if (unit === "months") {
      return years * 12 + months + days / 30;
    }
  } else {
    const deltaSeconds = (end - start) / 1000;
    switch (unit) {
      case "days":
        return Math.floor(deltaSeconds / 86400);
      case "hours":
        return Math.floor(deltaSeconds / 3600);
      case "minutes":
        return Math.floor(deltaSeconds / 60);
      case "seconds":
        return Math.floor(deltaSeconds);
      case "milliseconds":
        return Math.floor(deltaSeconds * 1000);
      case "microseconds":
        return Math.floor(deltaSeconds * 1_000_000);
      case "nanoseconds":
        return Math.floor(deltaSeconds * 1_000_000_000);
      default:
        throw new Error(`Unsupported unit: ${unit}`);
    }
  }
}

/**
 * Breakdown elapsed time into years, months, days, hours, minutes, seconds.
 * @param {Date} start 
 * @param {Date} end 
 * @returns {object}
 */
export function breakdown(start, end) {
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();
  let hours = end.getHours() - start.getHours();
  let minutes = end.getMinutes() - start.getMinutes();
  let seconds = end.getSeconds() - start.getSeconds();

  if (seconds < 0) { seconds += 60; minutes--; }
  if (minutes < 0) { minutes += 60; hours--; }
  if (hours < 0) { hours += 24; days--; }
  if (days < 0) { 
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
    days += prevMonth; 
    months--; 
  }
  if (months < 0) { months += 12; years--; }

  return { years, months, days, hours, minutes, seconds };
}

/**
 * Breakdown elapsed time into multiple units (from millennia down to ns).
 * @param {Date} start 
 * @param {Date} end 
 * @returns {object}
 */
export function breakdownAll(start, end = new Date()) {
  const deltaMs = end - start;
  const totalDays = Math.floor(deltaMs / 86400000);
  const totalSeconds = deltaMs / 1000;

  const years = end.getFullYear() - start.getFullYear();
  const months = years * 12 + (end.getMonth() - start.getMonth());

  return {
    millennia: Math.floor(totalDays / 365_000),
    centuries: Math.floor(totalDays / 36_500),
    decades: Math.floor(totalDays / 3_650),
    years,
    months,
    weeks: Math.floor(totalDays / 7),
    days: totalDays,
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor(totalSeconds / 60),
    seconds: Math.floor(totalSeconds),
    milliseconds: Math.floor(totalSeconds * 1000),
    microseconds: Math.floor(totalSeconds * 1_000_000),
    nanoseconds: Math.floor(totalSeconds * 1_000_000_000),
  };
}

/**
 * Human-readable elapsed time between two dates.
 * @param {Date} start 
 * @param {Date} end 
 * @param {number} maxUnits - number of units to include
 * @returns {string}
 */
export function prettyBreakdown(start, end = new Date(), maxUnits = 3) {
  const delta = breakdown(start, end);
  const parts = [];

  if (delta.years) parts.push(`${delta.years} year${delta.years !== 1 ? "s" : ""}`);
  if (delta.months) parts.push(`${delta.months} month${delta.months !== 1 ? "s" : ""}`);
  if (delta.days) parts.push(`${delta.days} day${delta.days !== 1 ? "s" : ""}`);
  if (delta.hours) parts.push(`${delta.hours} hour${delta.hours !== 1 ? "s" : ""}`);
  if (delta.minutes) parts.push(`${delta.minutes} minute${delta.minutes !== 1 ? "s" : ""}`);
  if (delta.seconds && parts.length === 0) {
    parts.push(`${delta.seconds} second${delta.seconds !== 1 ? "s" : ""}`);
  }

  return parts.slice(0, maxUnits).join(", ") || "0 seconds";
}
