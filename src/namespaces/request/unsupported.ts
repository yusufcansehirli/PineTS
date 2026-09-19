// SPDX-License-Identifier: AGPL-3.0-only

/**
 * Unsupported `request.*` stubs. The v6 surface includes TV-hosted data sources
 * (fundamental statements, economic calendars, currency rates, seeds, footprint)
 * that a local runtime has no backing store for. These stubs keep scripts
 * COMPILING and RUNNING — every call returns `na` and warns ONCE per function
 * name, so the gap is visible without breaking the whole script.
 */
const warned = new Set<string>();

export function warnUnsupported(name: string): void {
    if (warned.has(name)) return;
    warned.add(name);
    console.warn(`[pinets] ${name} is not supported by this runtime (no local data source) — returning na.`);
}
