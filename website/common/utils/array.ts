import { modulo } from './math';

type FixedArray<T, N extends number> = FixedArrayHelper<T, N, []>;

type FixedArrayHelper<
    T,
    N extends number,
    R extends T[],
> = `${N}` extends `-${number}`
    ? never
    : number extends N
      ? T[]
      : R['length'] extends N
        ? R
        : FixedArrayHelper<T, N, [...R, T]>;

function getArrayElementAtModuloReducedIndex<T extends unknown[]>(
    array: [...T] | readonly [...T],
    index: number,
) {
    return array.at(modulo(index, array.length));
}

function getRandomArrayElement<T>(array: T[] | readonly T[]) {
    return array[Math.floor(Math.random() * array.length)];
}

export type { FixedArray };
export { getArrayElementAtModuloReducedIndex, getRandomArrayElement };
