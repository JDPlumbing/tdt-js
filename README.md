# tdt-js

**Time Delta T (TDT)** — a lightweight JavaScript library for handling time deltas, ticks, and human-readable breakdowns.  
Ported from the original Python `time_delta_t` implementation.

---

## Features

- Count ticks between two dates in any unit:  
  `years`, `months`, `days`, `hours`, `minutes`, `seconds`, `milliseconds`, `microseconds`, `nanoseconds`.

- Human-readable elapsed time strings (e.g. `"27 years, 5 months, 18 days"`).

- Detailed breakdowns across multiple units:
  - `breakdown`: years, months, days, hours, minutes, seconds
  - `breakdownAll`: millennia down to nanoseconds

- Easy to use in Node.js or modern browsers (ESM).

---

## Installation

```bash
npm install tdt-js
```

---

## Usage

```js
import { countTicks, breakdown, breakdownAll, prettyBreakdown } from "tdt-js";

// Example: count ticks
const start = new Date("1997-06-15");
const end = new Date();

console.log(countTicks(start, end, "seconds")); // total seconds
console.log(countTicks(start, end, "years"));   // fractional years

// Example: breakdown
console.log(breakdown(start, end));
// → { years: 27, months: 5, days: 18, hours: 4, minutes: 32, seconds: 10 }

// Example: breakdownAll
console.log(breakdownAll(start, end));
// → { millennia: 0, centuries: 0, decades: 2, years: 27.45, months: 329.4, … }

// Example: prettyBreakdown
console.log(prettyBreakdown(start, end));
// → "27 years, 5 months, 18 days"
```

---

## API

### `countTicks(start, end, unit)`
Return the number of ticks between two dates in the chosen unit.

### `breakdown(start, end)`
Return elapsed time broken into years, months, days, hours, minutes, seconds.

### `breakdownAll(start, end)`
Return elapsed time in multiple scales, from millennia down to nanoseconds.

### `prettyBreakdown(start, end, maxUnits = 3)`
Return a human-readable string for elapsed time.

---

## License

MIT © JD Plumbing
