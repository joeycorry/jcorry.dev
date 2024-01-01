import { modulo } from './math';

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

export type FixedArray<T, N extends number> = FixedArrayHelper<T, N, []>;

export function getRandomArrayElement<T>(array: T[] | readonly T[]) {
    return array[Math.floor(Math.random() * array.length)];
}

export function getArrayElementAtModuloReducedIndex<T extends unknown[]>(
    array: [...T] | readonly [...T],
    index: number,
) {
    return array.at(modulo(index, array.length));
}

export function shuffleArray<T extends unknown[]>(
    array: [...T] | readonly [...T],
) {
    const arrayCopy = [...array];

    for (let i = arrayCopy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const element = arrayCopy[i];

        arrayCopy[i] = arrayCopy[j];
        arrayCopy[j] = element;
    }

    return arrayCopy;
}
