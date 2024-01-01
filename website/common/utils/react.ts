import type { MutableRefObject } from 'react';
import { createRef } from 'react';

export type ValueOrMutableRef<T> = T | MutableRefObject<T>;

export function createMutableRef<T>(value: T): MutableRefObject<T> {
    const ref = createRef() as MutableRefObject<T>;
    ref.current = value;

    return ref;
}

function isMutableRefObject<T>(thing: unknown): thing is MutableRefObject<T> {
    return typeof thing === 'object' && thing !== null && 'current' in thing;
}

export function getValueFromValueOrMutableRef<T>(
    valueOrMutableRef: ValueOrMutableRef<T>,
) {
    return isMutableRefObject(valueOrMutableRef)
        ? valueOrMutableRef.current
        : valueOrMutableRef;
}
