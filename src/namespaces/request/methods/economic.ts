// SPDX-License-Identifier: AGPL-3.0-only

import { warnUnsupported } from '../unsupported';

/** request.economic — TV economic calendar data; no local source → na. */
export function economic(context: any) {
    return (..._args: any[]) => {
        warnUnsupported('request.economic');
        return NaN;
    };
}
