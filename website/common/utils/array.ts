import { modulo } from './math';

export const getArrayElementAtIndex = Object.prototype.hasOwnProperty.call(
    Array.prototype,
    'at'
)
    ? <T>(array: T[] | readonly T[], index: number) =>
          Array.prototype.at.call<T[] | readonly T[], [number], T | undefined>(
              array,
              index
          )
    : <T>(array: T[] | readonly T[], index: number) =>
          array[index < 0 ? array.length + index : index];

export function getRandomArrayElement<T>(array: T[] | readonly T[]) {
    return array[Math.floor(Math.random() * array.length)];
}

export function getArrayElementAtModuloReducedIndex<T>(
    array: T[] | readonly T[],
    index: number
) {
    return getArrayElementAtIndex(array, modulo(index, array.length));
}
