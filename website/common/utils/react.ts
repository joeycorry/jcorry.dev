import type { MutableRefObject } from 'react';
import { createRef } from 'react';

type ValueOrMutableRef<T> = T | MutableRefObject<T>;

function createMutableRef<T>(value: T): MutableRefObject<T> {
    const ref = createRef() as MutableRefObject<T>;
    ref.current = value;

    return ref;
}

function getValueFromValueOrMutableRef<T>(
    valueOrMutableRef: ValueOrMutableRef<T>,
) {
    return isMutableRefObject(valueOrMutableRef)
        ? valueOrMutableRef.current
        : valueOrMutableRef;
}

function isMutableRefObject<T>(thing: unknown): thing is MutableRefObject<T> {
    return typeof thing === 'object' && thing !== null && 'current' in thing;
}

export type { ValueOrMutableRef };
export { createMutableRef, getValueFromValueOrMutableRef };
