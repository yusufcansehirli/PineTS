// SPDX-License-Identifier: AGPL-3.0-only

import { warnUnsupported } from '../unsupported';

/** request.quandl — Quandl/Nasdaq data feed; no local source → na. */
export function quandl(context: any) {
    return (..._args: any[]) => {
        warnUnsupported('request.quandl');
        return NaN;
    };
}
