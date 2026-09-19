// SPDX-License-Identifier: AGPL-3.0-only

import { PineMatrixObject } from '../PineMatrixObject';
import { Context } from '../../../Context.class';
import { compareSortKeys, udtSortKey } from '../../array/methods/sort';

export function sort(context: Context) {
    return (id: PineMatrixObject, column: number = 0, order: string = 'asc', sort_field?: string | number) => {
        const rows = id.matrix.length;
        if (rows === 0) return;

        // v6: UDT collections sort by a named/indexed int|float|string field.
        const field = sort_field === undefined || sort_field === null
            ? undefined
            : typeof sort_field === 'number'
              ? Number(sort_field)
              : String(sort_field);
        const ascending = order === 'asc';
        id.matrix.sort((a: any[], b: any[]) =>
            compareSortKeys(udtSortKey(a[column], field), udtSortKey(b[column], field), ascending),
        );
    };
}
