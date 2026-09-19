// SPDX-License-Identifier: AGPL-3.0-only

import { warnUnsupported } from '../unsupported';

/** request.seed — loads seed data published on TV; no local source → na. */
export function seed(context: any) {
    return (..._args: any[]) => {
        warnUnsupported('request.seed');
        return NaN;
    };
}
