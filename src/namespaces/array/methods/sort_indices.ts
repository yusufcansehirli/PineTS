// SPDX-License-Identifier: AGPL-3.0-only

import { PineArrayObject, PineArrayType } from '../PineArrayObject';
import { order } from '../../Types';
import { compareSortKeys, udtSortKey } from './sort';

export function sort_indices(context: any) {
    return (id: PineArrayObject, _order: order = order.ascending, sort_field?: string | number): PineArrayObject => {
        const field = sort_field === undefined || sort_field === null
            ? undefined
            : typeof sort_field === 'number'
              ? Number(sort_field)
              : String(sort_field);
        const ascending = _order === order.ascending;
        const indices = id.array.map((_: any, index: number) => index);
        indices.sort((a: number, b: number) =>
            compareSortKeys(udtSortKey(id.array[a], field), udtSortKey(id.array[b], field), ascending),
        );
        return new PineArrayObject(indices, PineArrayType.int, context);
    };
}
