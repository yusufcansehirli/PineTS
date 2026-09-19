// SPDX-License-Identifier: AGPL-3.0-only

import { warnUnsupported } from '../unsupported';

/** request.splits — TV fundamentals; no local source → na. */
export function splits(context: any) {
    return (..._args: any[]) => {
        warnUnsupported('request.splits');
        return NaN;
    };
}
