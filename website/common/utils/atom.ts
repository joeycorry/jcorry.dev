import type { Atom, WritableAtom } from 'jotai';
import { atom } from 'jotai';

export function atomWithNoArgumentSetter<Value>(
    initialValue: Value,
    setValue: () => Value
): WritableAtom<Value, [undefined], void> {
    const baseAtom = atom(initialValue);

    return atom(
        get => get(baseAtom),
        (_, set) => set(baseAtom, setValue())
    );
}

export type AtomSetValueParameters<T> = T extends WritableAtom<
    unknown,
    infer Parameters,
    unknown
>
    ? Parameters
    : T extends Atom<infer Parameter>
    ? [Parameter]
    : never;

export type WritableAtomWithInitialValue<
    Value,
    Args extends unknown[],
    Result
> = WritableAtom<Value, Args, Result> & {
    init: Value;
};
