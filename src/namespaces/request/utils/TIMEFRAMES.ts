// SPDX-License-Identifier: AGPL-3.0-only

//Pine Script Timeframes (canonical format: minutes as integers, D/W/M for day/week/month;
//second-based timeframes use the Pine '<n>S' form and sort BEFORE minutes)
export const TIMEFRAMES = ['1S', '5S', '10S', '15S', '30S', '1', '3', '5', '15', '30', '45', '60', '120', '180', '240', 'D', 'W', 'M'];

/**
 * Normalize a timeframe string to the canonical Pine Script format used in TIMEFRAMES.
 * Handles common formats like '1h', '4h', '1d', '1w', '1D', '1W', '1M', etc.
 */
const TIMEFRAME_MAP: Record<string, string> = {
    '1s': '1S', '5s': '5S', '10s': '10S', '15s': '15S', '30s': '30S',
    '1m': '1', '3m': '3', '5m': '5', '15m': '15', '30m': '30', '45m': '45',
    '1h': '60', '2h': '120', '3h': '180', '4h': '240',
    '1d': 'D', '1w': 'W', '1M': 'M',
};

export function normalizeTimeframe(tf: string): string {
    // Already canonical?
    if (TIMEFRAMES.includes(tf)) return tf;

    // Try direct map (case-sensitive first for '1M')
    if (TIMEFRAME_MAP[tf]) return TIMEFRAME_MAP[tf];

    // Try lowercase (handles '1H', '4H', '1D', '1W', etc.)
    const lower = tf.toLowerCase();
    if (TIMEFRAME_MAP[lower]) return TIMEFRAME_MAP[lower];

    // Handle uppercase single letters ('d' → 'D', 'w' → 'W', 'm' → 'M')
    const upper = tf.toUpperCase();
    if (TIMEFRAMES.includes(upper)) return upper;

    // Return as-is (will fail indexOf check and throw Error)
    return tf;
}

/**
 * Duration in ms of a (normalized) timeframe string — the RANK used to compare
 * chart vs requested timeframes. Unlike the fixed TIMEFRAMES ladder it accepts
 * every valid v6 form: bare minutes ('300'), seconds ('30S'), and multiples of
 * days/weeks/months ('2D', '3W'). Returns 0 when the value is not a timeframe.
 */
export function timeframeDurationMs(tf: string): number {
    if (tf == null) return 0;
    const t = String(tf).trim();
    if (!t) return 0;
    // Bare named periods: 'D'/'W'/'M' imply a count of 1.
    const named = /^([DWM])$/i.exec(t);
    if (named) {
        const u = named[1]!.toUpperCase();
        return u === 'D' ? 86_400_000 : u === 'W' ? 604_800_000 : 2_592_000_000;
    }
    const m = /^([1-9]\d*)\s*([SDWM]?)$/i.exec(t);
    if (!m) return 0;
    const n = parseInt(m[1]!, 10);
    if (!Number.isFinite(n) || n < 1) return 0;
    const unit = (m[2] ?? '').toUpperCase();
    const base = unit === 'S' ? 1_000 : unit === 'D' ? 86_400_000 : unit === 'W' ? 604_800_000 : unit === 'M' ? 2_592_000_000 : 60_000;
    return n * base;
}
