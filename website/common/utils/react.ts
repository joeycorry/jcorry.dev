import type { MutableRefObject } from 'react';

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
