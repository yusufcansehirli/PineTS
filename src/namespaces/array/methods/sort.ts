// SPDX-License-Identifier: AGPL-3.0-only

import { PineArrayObject } from '../PineArrayObject';
import { order } from '../../Types';

/**
 * Extract the sort key for `sort_field` (v6 UDT sorting): a field NAME (string)
 * or field INDEX (int) on the elements' objects; absent → the element itself.
 */
export function udtSortKey(el: any, field?: string | number): any {
    if (field === undefined || field === null) return el;
    if (el == null || typeof el !== 'object') return el;
    if (typeof field === 'number') return Object.values(el)[field];
    return el[field];
}

/** Shared comparator: strings compare lexicographically, numbers numerically with na last. */
export function compareSortKeys(ka: any, kb: any, ascending: boolean): number {
    if (typeof ka === 'string' || typeof kb === 'string') {
        const sa = String(ka);
        const sb = String(kb);
        const d = sa < sb ? -1 : sa > sb ? 1 : 0;
        return ascending ? d : -d;
    }
    const va = isNaN(ka) ? Infinity : ka;
    const vb = isNaN(kb) ? Infinity : kb;
    return ascending ? va - vb : vb - va;
}

export function sort(context: any) {
    return (id: PineArrayObject, _order: order = order.ascending, sort_field?: string | number): void => {
        const field = sort_field === undefined || sort_field === null
            ? undefined
            : typeof sort_field === 'number'
              ? Number(sort_field)
              : String(sort_field);
        const ascending = _order === order.ascending;
        id.array.sort((a: any, b: any) => compareSortKeys(udtSortKey(a, field), udtSortKey(b, field), ascending));
    };
}
