// SPDX-License-Identifier: AGPL-3.0-only

import { warnUnsupported } from '../unsupported';

/** request.financial — TV fundamentals; no local source → na. */
export function financial(context: any) {
    return (..._args: any[]) => {
        warnUnsupported('request.financial');
        return NaN;
    };
}
