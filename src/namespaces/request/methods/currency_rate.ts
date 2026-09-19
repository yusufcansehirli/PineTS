// SPDX-License-Identifier: AGPL-3.0-only

import { warnUnsupported } from '../unsupported';

/** request.currency_rate — TV-hosted FX rates; no local source → na. */
export function currency_rate(context: any) {
    return (..._args: any[]) => {
        warnUnsupported('request.currency_rate');
        return NaN;
    };
}
