// SPDX-License-Identifier: AGPL-3.0-only

import { warnUnsupported } from '../unsupported';

/**
 * request.footprint — v6 footprint (volume-at-price rows). Needs a tick-derived
 * data source the runtime does not own → na. Scripts that merely reference it
 * keep running.
 */
export function footprint(context: any) {
    return (..._args: any[]) => {
        warnUnsupported('request.footprint');
        return NaN;
    };
}
