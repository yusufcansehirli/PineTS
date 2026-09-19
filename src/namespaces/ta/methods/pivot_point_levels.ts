// SPDX-License-Identifier: AGPL-3.0-only

import { Series } from '../../../Series';
import { PineArrayObject, PineArrayType } from '../../array/PineArrayObject';

/**
 * ta.pivot_point_levels(type, anchor, developing) — TV-parity pivot levels.
 *
 * Returns an `array<float>` of 11 values: [P, R1, S1, R2, S2, R3, S3, R4, S4,
 * R5, S5]. Levels a type does not define stay `na` (e.g. DM only yields
 * P/R1/S1). The PREVIOUS anchor period's H/L/C feed the formulas; with
 * `developing=true` the CURRENT period's developing values are used instead
 * (forbidden for 'Woodie', which needs a period open — TV runtime error).
 */
export function pivot_point_levels(context: any) {
    return (type: any, anchor: any, developing: any = false, _callId?: string) => {
        const kindRaw = typeof type === 'function' ? type() : type;
        const kind = String(Series.from(kindRaw).get(0) ?? 'Traditional');
        const isAnchor = (typeof anchor === 'function' ? anchor() : Series.from(anchor).get(0)) === true;
        const isDev = (typeof developing === 'function' ? developing() : Series.from(developing).get(0)) === true;

        if (isDev && kind === 'Woodie') {
            throw new Error('ta.pivot_point_levels: `developing` cannot be true when `type` is "Woodie".');
        }

        if (!context.taState) context.taState = {};
        const key = _callId || `ppl_${kind}_${isDev ? 'dev' : 'prev'}`;
        if (!context.taState[key]) {
            context.taState[key] = { curH: NaN, curL: NaN, curO: NaN, curC: NaN, prevH: NaN, prevL: NaN, prevC: NaN, prevO: NaN, started: false };
        }
        const st = context.taState[key];

        const barHigh = Number(Series.from(context.data.high).get(0));
        const barLow = Number(Series.from(context.data.low).get(0));
        const barOpen = Number(Series.from(context.data.open).get(0));

        if (!st.started) {
            // First bar of the period we've seen — seed the running bucket.
            st.started = true;
            st.curH = barHigh;
            st.curL = barLow;
            st.curO = barOpen;
        } else if (isAnchor) {
            // A new period begins: commit the finished one as PREVIOUS values.
            // The finished period's close = previous bar's close.
            st.prevH = st.curH;
            st.prevL = st.curL;
            st.prevO = st.curO;
            st.prevC = Number(Series.from(context.data.close).get(1));
            st.curH = barHigh;
            st.curL = barLow;
            st.curO = barOpen;
        } else {
            st.curH = Math.max(st.curH, barHigh);
            st.curL = Math.min(st.curL, barLow);
        }

        const h = isDev ? st.curH : st.prevH;
        const l = isDev ? st.curL : st.prevL;
        const c = isDev ? Number(Series.from(context.data.close).get(0)) : st.prevC;
        const o = isDev ? st.curO : st.prevO;

        const na = NaN;
        let levels: number[];
        const p = (h + l + c) / 3;
        switch (kind) {
            case 'DM': {
                // Donchian midpoint — only P, R1, S1.
                const pp = (h + l) / 2;
                levels = [pp, h, l, na, na, na, na, na, na, na, na];
                break;
            }
            case 'Camarilla': {
                const range = h - l;
                const r1 = c + range * 1.1 / 12;
                const s1 = c - range * 1.1 / 12;
                const r2 = c + range * 1.1 / 6;
                const s2 = c - range * 1.1 / 6;
                const r3 = c + range * 1.1 / 4;
                const s3 = c - range * 1.1 / 4;
                const r4 = c + range * 1.1 / 2;
                const s4 = c - range * 1.1 / 2;
                const r5 = (l !== 0 ? h / l : NaN) * c;
                const s5 = c - (r5 - c);
                levels = [na, r1, s1, r2, s2, r3, s3, r4, s4, r5, s5];
                break;
            }
            case 'Fibonacci': {
                const range = h - l;
                levels = [
                    p,
                    p + 0.382 * range,
                    p - 0.382 * range,
                    p + 0.618 * range,
                    p - 0.618 * range,
                    p + range,
                    p - range,
                    na, na, na, na,
                ];
                break;
            }
            case 'Woodie': {
                const pw = (h + l + 2 * o) / 4;
                levels = [
                    pw,
                    2 * pw - l,
                    2 * pw - h,
                    pw + (h - l),
                    pw - (h - l),
                    h + 2 * (pw - l),
                    l - 2 * (h - pw),
                    na, na, na, na,
                ];
                break;
            }
            case 'Classic':
            case 'Traditional':
            default: {
                levels = [
                    p,
                    2 * p - l,
                    2 * p - h,
                    p + (h - l),
                    p - (h - l),
                    h + 2 * (p - l),
                    l - 2 * (h - p),
                    na, na, na, na,
                ];
                break;
            }
        }

        return new PineArrayObject(levels, PineArrayType.float, context);
    };
}
