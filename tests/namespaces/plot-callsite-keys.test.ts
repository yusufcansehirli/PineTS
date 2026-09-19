// SPDX-License-Identifier: AGPL-3.0-only

/**
 * Untitled plot-family calls must land in DISTINCT context.plots entries:
 * bgcolor()/barcolor() are NAMESPACES_LIKE — the transpiler rewrites them to
 * `bgcolor.any(...)`/`barcolor.any(...)` and appends a per-callsite
 * `{__callsiteId}` marker, so they no longer share the 'plot' fallback key
 * (which merged their data into one entry and silently dropped the barcolor
 * recolor / the bgcolor entries downstream).
 */
import { describe, expect, it } from 'vitest';
import { PineTS } from '@pinets/index';
import { Provider } from '@pinets/marketData/Provider.class';

const S = new Date('2025-10-01').getTime();
const E = new Date('2025-11-01').getTime();
const mk = () => new PineTS(Provider.Mock, 'BTCUSDC', '1h', null, S, E);

describe('plot callsite keys', () => {
    it('untitled bgcolor + barcolor get distinct plot entries (no key collision)', async () => {
        const src = `//@version=6
indicator("keys", overlay = true)
bgcolor(close > open ? color.new(color.green, 92) : na)
barcolor(close >= open ? color.new(color.teal, 30) : color.new(color.red, 30))
plot(close, "c")`;
        const { plots } = await mk().run(src);
        const keys = Object.keys(plots);
        const styles = keys.map((k) => plots[k].options?.style);
        // The two calls must NOT merge into one entry: exactly one background
        // and one barcolor plot (drawing-container bookkeeping keys like
        // __labels__/__lines__ are unrelated and carry their own styles).
        expect(styles.filter((s) => s === 'background').length).toBe(1);
        expect(styles.filter((s) => s === 'barcolor').length).toBe(1);
        const bgKey = keys.find((k) => plots[k].options?.style === 'background')!;
        const bcKey = keys.find((k) => plots[k].options?.style === 'barcolor')!;
        expect(bgKey).not.toBe(bcKey);
        // barcolor: every point carries its own per-bar color (both branches colored)
        const bcData = plots[bcKey].data;
        expect(bcData.length).toBeGreaterThan(0);
        expect(bcData.every((d: any) => typeof d.options?.color === 'string')).toBe(true);
        // bgcolor: colored bars record value=true; na bars record a non-true
        // sentinel (the raw na join, NaN — the adapter keys off `=== true`)
        const bgData = plots[bgKey].data;
        expect(bgData.some((d: any) => d.value === true)).toBe(true);
        expect(bgData.some((d: any) => d.value !== true)).toBe(true);
    });

    it('two untitled bgcolor calls stay distinct', async () => {
        const src = `//@version=6
indicator("two bg")
bgcolor(close > open ? color.new(color.green, 90) : na)
bgcolor(close < open ? color.new(color.red, 90) : na)
plot(close)`;
        const { plots } = await mk().run(src);
        const bgCount = Object.keys(plots).filter((k) => plots[k].options?.style === 'background').length;
        expect(bgCount).toBe(2);
    });
});
