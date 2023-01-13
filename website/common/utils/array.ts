import * as NumberUtils from './number';

export const at = Object.prototype.hasOwnProperty.call(Array.prototype, 'at')
    ? <T>(array: T[] | readonly T[], index: number) =>
          Array.prototype.at.call<T[] | readonly T[], [number], T | undefined>(
              array,
              index
          )
    : <T>(array: T[] | readonly T[], index: number) =>
          array[index < 0 ? array.length + index : index];

export function getRandomElement<T>(array: T[] | readonly T[]) {
    return array[Math.floor(Math.random() * array.length)];
}

export function moduloReducedAt<T>(array: T[] | readonly T[], index: number) {
    return at(array, NumberUtils.mod(index, array.length));
}
