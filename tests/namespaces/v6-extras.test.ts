// SPDX-License-Identifier: AGPL-3.0-only

/**
 * v6-parity extras (this fork): library imports/exports, ta.pivot_point_levels,
 * UDT `sort_field`, ask/bid builtins, and multiline strings. All cases run as
 * real Pine sources through the full transpile + execute path.
 */
import { describe, expect, it } from 'vitest';
import { PineTS } from '@pinets/index';
import { Provider } from '@pinets/marketData/Provider.class';

const S = new Date('2025-10-01').getTime();
const E = new Date('2025-11-01').getTime();
const mk = () => new PineTS(Provider.Mock, 'BTCUSDC', '1h', null, S, E);
const last = (a: any[]) => a[a.length - 1]?.value ?? a[a.length - 1];

describe('library import / export (v6)', () => {
    it('a library script with export declarations transpiles and runs standalone', async () => {
        const src = `//@version=6
library("num_methods", overlay = true)
export sinh(float x) =>
    (math.exp(x) - math.exp(-x)) / 2.0
plot(sinh(0))`;
        const { plots } = await mk().run(src);
        expect(last(Object.values(plots)[0].data)).toBeCloseTo(0, 6);
    });

    it('an unused import never fails', async () => {
        const src = `//@version=6
indicator("unused import")
import some/lib/1 as lib
plot(close)`;
        const { plots } = await mk().run(src);
        expect(last(Object.values(plots)[0].data)).toBeGreaterThan(0);
    });

    it('using an unregistered library throws a clear error', async () => {
        const src = `//@version=6
indicator("uses lib")
import some/lib/1 as lib
plot(lib.f(close))`;
        await expect(mk().run(src)).rejects.toThrow(/import "some\/lib\/1" is not available/);
    });

    it('a registered library resolves and runs', async () => {
        const pts = mk();
        pts.setLibraries({ 'some/lib/1': { double: (x: number) => x * 2 } });
        const src = `//@version=6
indicator("uses lib")
import some/lib/1 as lib
plot(lib.double(close))`;
        const { plots } = await pts.run(src);
        expect(last(Object.values(plots)[0].data)).toBeGreaterThan(0);
    });
});

describe('ta.pivot_point_levels', () => {
    it('Traditional: 11 levels, R1/S1 finite after the first boundary, R4 na', async () => {
        const src = `//@version=6
indicator("ppl")
anchor = timeframe.change('1W')
levels = ta.pivot_point_levels("Traditional", anchor)
plot(array.size(levels), "sz")
plot(array.get(levels, 1), "r1")
plot(array.get(levels, 7), "r4")`;
        const { plots } = await mk().run(src);
        expect(last(plots.sz.data)).toBe(11);
        expect(Number.isFinite(last(plots.r1.data))).toBe(true);
        expect(Number.isNaN(last(plots.r4.data))).toBe(true);
    });

    it('Camarilla leaves P na and defines R5', async () => {
        const src = `//@version=6
indicator("ppl-cam")
anchor = timeframe.change('1W')
levels = ta.pivot_point_levels("Camarilla", anchor)
plot(array.get(levels, 0), "p")
plot(array.get(levels, 9), "r5")`;
        const { plots } = await mk().run(src);
        expect(Number.isNaN(last(plots.p.data))).toBe(true);
        expect(Number.isFinite(last(plots.r5.data))).toBe(true);
    });

    it('rejects developing=true with Woodie (TV runtime error)', async () => {
        const src = `//@version=6
indicator("woody-dev")
anchor = timeframe.change('1W')
ppl = ta.pivot_point_levels("Woodie", anchor, true)
plot(array.get(ppl, 0))`;
        await expect(mk().run(src)).rejects.toThrow(/developing/);
    });
});

describe('v6 sort_field for UDT collections', () => {
    it('array.sort with a field name orders by that field', async () => {
        const src = `//@version=6
indicator("sort")
type Candle
    float price = 0.0
    string note = ""
a = array.new<Candle>()
a.push(Candle.new(3.0, "c"))
a.push(Candle.new(1.0, "a"))
a.push(Candle.new(2.0, "b"))
array.sort(a, order.ascending, "price")
plot(a.get(0).note == "a" ? 1 : 0, "firsta")
plot(a.get(2).note == "c" ? 1 : 0, "lastc")`;
        const { plots } = await mk().run(src);
        expect(last(plots.firsta.data)).toBe(1);
        expect(last(plots.lastc.data)).toBe(1);
    });
});

describe('ask/bid builtins', () => {
    it('exist and are na on non-tick charts', async () => {
        const src = `//@version=6
indicator("askbid")
plot(na(ask) ? 1 : 0, "askna")
plot(na(bid) ? 1 : 0, "bidna")`;
        const { plots } = await mk().run(src);
        expect(last(plots.askna.data)).toBe(1);
        expect(last(plots.bidna.data)).toBe(1);
    });
});

describe('multiline strings (v6 2026)', () => {
    it('triple-quoted text keeps newlines and runs', async () => {
        const src = `//@version=6
indicator("ml")
s = """line1
line2"""
n = str.length(s)
plot(n)`;
        const { plots } = await mk().run(src);
        // "line1\nline2" → 11 chars
        expect(last(Object.values(plots)[0].data)).toBe(11);
    });
});
