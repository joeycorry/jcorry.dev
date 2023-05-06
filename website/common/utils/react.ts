import type { MutableRefObject } from 'react';
import { createRef } from 'react';

export function createMutableRef<T>(value: T): MutableRefObject<T> {
    const ref = createRef() as MutableRefObject<T>;
    ref.current = value;

    return ref;
}

function isMutableRefObject<T>(thing: unknown): thing is MutableRefObject<T> {
    return typeof thing === 'object' && thing !== null && 'current' in thing;
}

export function getValueFromMutableRefOrRaw<T>(
    maybeMutableRef: T | MutableRefObject<T>
) {
    return isMutableRefObject(maybeMutableRef)
        ? maybeMutableRef.current
        : maybeMutableRef;
}
