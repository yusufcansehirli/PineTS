// SPDX-License-Identifier: AGPL-3.0-only

import { warnUnsupported } from '../unsupported';

/** request.dividends — TV fundamentals; no local source → na. */
export function dividends(context: any) {
    return (..._args: any[]) => {
        warnUnsupported('request.dividends');
        return NaN;
    };
}
