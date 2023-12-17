import { modulo } from './math';

export const getArrayElementAtIndex = Object.prototype.hasOwnProperty.call(
    Array.prototype,
    'at'
)
    ? function getArrayElementAtIndex<T extends unknown[]>(
          array: [...T] | readonly [...T],
          index: number
      ): T[number] | undefined {
          return Array.prototype.at.call<
              [...T] | readonly [...T],
              [number],
              T | undefined
          >(array, index);
      }
    : function getArrayElementAtIndex<T extends unknown[]>(
          array: [...T] | readonly [...T],
          index: number
      ): T[number] | undefined {
          return array[index < 0 ? array.length + index : index];
      };

export function getRandomArrayElement<T>(array: T[] | readonly T[]) {
    return array[Math.floor(Math.random() * array.length)];
}

export function getArrayElementAtModuloReducedIndex<T extends unknown[]>(
    array: [...T] | readonly [...T],
    index: number
) {
    return getArrayElementAtIndex(array, modulo(index, array.length));
}
