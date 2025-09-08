// src/index.js
import { DateTime } from "luxon";

// Default epoch: Unix epoch
const DEFAULT_START = DateTime.fromMillis(0);

// --- Core tick counter ---
export function countTicks(start, end = DateTime.now(), unit = "seconds") {
  if (!start) start = DEFAULT_START;

  if (!(start instanceof DateTime)) start = DateTime.fromJSDate(start);
  if (!(end instanceof DateTime)) end = DateTime.fromJSDate(end);

  if (unit === "years" || unit === "months") {
    const diff = end.diff(start, [unit]).toObject();
    return diff[unit];
  }

  const diffSeconds = end.toSeconds() - start.toSeconds();

  switch (unit) {
    case "days": return Math.floor(diffSeconds / 86400);
    case "hours": return Math.floor(diffSeconds / 3600);
    case "minutes": return Math.floor(diffSeconds / 60);
    case "seconds": return Math.floor(diffSeconds);
    case "milliseconds": return Math.floor(diffSeconds * 1_000);
    case "microseconds": return Math.floor(diffSeconds * 1_000_000);
    case "nanoseconds": return Math.floor(diffSeconds * 1_000_000_000);
    default: throw new Error(`Unsupported unit: ${unit}`);
  }
}

// --- Breakdown into calendar parts ---
export function breakdown(start, end = DateTime.now()) {
  if (!(start instanceof DateTime)) start = DateTime.fromJSDate(start);
  if (!(end instanceof DateTime)) end = DateTime.fromJSDate(end);

  const diff = end.diff(start, ["years", "months", "days", "hours", "minutes", "seconds"]).toObject();

  return {
    years: diff.years || 0,
    months: diff.months || 0,
    days: diff.days || 0,
    hours: diff.hours || 0,
    minutes: diff.minutes || 0,
    seconds: Math.floor(diff.seconds || 0),
  };
}

// --- Full breakdown across scales ---
export function breakdownAll(start, end = DateTime.now()) {
  if (!(start instanceof DateTime)) start = DateTime.fromJSDate(start);
  if (!(end instanceof DateTime)) end = DateTime.fromJSDate(end);

  const totalMillis = end.toMillis() - start.toMillis();
  const totalSeconds = totalMillis / 1000;
  const totalDays = Math.floor(totalSeconds / 86400);

  const diff = end.diff(start, ["years", "months"]).toObject();

  return {
    millennia: Math.floor(totalDays / 365000),
    centuries: Math.floor(totalDays / 36500),
    decades: Math.floor(totalDays / 3650),
    years: diff.years || 0,
    months: (diff.years || 0) * 12 + (diff.months || 0),
    weeks: Math.floor(totalDays / 7),
    days: totalDays,
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor(totalSeconds / 60),
    seconds: Math.floor(totalSeconds),
    milliseconds: Math.floor(totalMillis),
    microseconds: Math.floor(totalMillis * 1000),
    nanoseconds: Math.floor(totalMillis * 1_000_000),
  };
}

// --- Human-readable breakdown ---
export function prettyBreakdown(start, end = DateTime.now(), maxUnits = 3) {
  if (!(start instanceof DateTime)) start = DateTime.fromJSDate(start);
  if (!(end instanceof DateTime)) end = DateTime.fromJSDate(end);

  const diff = end.diff(start, ["years", "months", "days", "hours", "minutes", "seconds"]).toObject();

  const parts = [];
  if (diff.years) parts.push(`${Math.floor(diff.years)} year${diff.years > 1 ? "s" : ""}`);
  if (diff.months) parts.push(`${Math.floor(diff.months)} month${diff.months > 1 ? "s" : ""}`);
  if (diff.days) parts.push(`${Math.floor(diff.days)} day${diff.days > 1 ? "s" : ""}`);
  if (diff.hours) parts.push(`${Math.floor(diff.hours)} hour${diff.hours > 1 ? "s" : ""}`);
  if (diff.minutes) parts.push(`${Math.floor(diff.minutes)} minute${diff.minutes > 1 ? "s" : ""}`);
  if (!parts.length && diff.seconds) parts.push(`${Math.floor(diff.seconds)} second${diff.seconds > 1 ? "s" : ""}`);

  return parts.slice(0, maxUnits).join(", ") || "0 seconds";
}

// --- Example if run directly ---
if (import.meta.url === `file://${process.argv[1]}`) {
  const start = DateTime.fromISO("1997-06-15");
  const end = DateTime.now();

  console.log("Ticks since 1997 in days:", countTicks(start, end, "days"));
  console.log("Breakdown:", breakdown(start, end));
  console.log("Full breakdown:", breakdownAll(start, end));
  console.log("Pretty:", prettyBreakdown(start, end));
}
