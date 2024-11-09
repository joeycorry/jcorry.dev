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

function getRandomArrayElement<T>(array: T[] | readonly T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

export type { FixedArray };
export { getRandomArrayElement };
