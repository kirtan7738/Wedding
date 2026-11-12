/** All wedding times are IST (+05:30); helpers never depend on the host timezone. */
export const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

const DAY = 86_400_000;
const HOUR = 3_600_000;
const MIN = 60_000;

export function countdownParts(nowMs, targetIso) {
  const totalMs = Math.max(0, Date.parse(targetIso) - nowMs);
  return {
    days: Math.floor(totalMs / DAY),
    hours: Math.floor((totalMs % DAY) / HOUR),
    minutes: Math.floor((totalMs % HOUR) / MIN),
    seconds: Math.floor((totalMs % MIN) / 1000),
    totalMs,
  };
}

const istDate = (ms) => new Date(ms + IST_OFFSET_MS).toISOString().slice(0, 10);

/** 'before' | 'today' (same IST calendar day, before target) | 'after' */
export function countdownState(nowMs, targetIso) {
  const target = Date.parse(targetIso);
  if (nowMs >= target) return 'after';
  return istDate(nowMs) === istDate(target) ? 'today' : 'before';
}
