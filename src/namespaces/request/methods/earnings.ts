// SPDX-License-Identifier: AGPL-3.0-only

import { warnUnsupported } from '../unsupported';

/** request.earnings — TV fundamentals; no local source → na. */
export function earnings(context: any) {
    return (..._args: any[]) => {
        warnUnsupported('request.earnings');
        return NaN;
    };
}
