import type { Atom, WritableAtom } from 'jotai';
import { atom } from 'jotai';

export function atomWithNoArgumentSetter<Value>(
    initialValue: Value,
    setValue: () => Value,
): WritableAtom<Value, [undefined], void> {
    const baseAtom = atom(initialValue);

    return atom(
        get => get(baseAtom),
        (_, set) => set(baseAtom, setValue()),
    );
}

const initializeValueSymbol = Symbol('initializeValue');

export function mountInitializedReadonlyAtom<Value>(
    getInitialValue: () => Value,
) {
    const baseAtom = atom<Value | null>(null);
    const resultAtom: WritableAtom<
        Value | null,
        [typeof initializeValueSymbol],
        void
    > = atom(
        get => get(baseAtom),
        (get, set, value) =>
            set(
                baseAtom,
                value === initializeValueSymbol
                    ? getInitialValue()
                    : get(baseAtom),
            ),
    );
    resultAtom.onMount = setAtom => setAtom(initializeValueSymbol);

    return resultAtom as Atom<Value | null>;
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
    Result,
> = WritableAtom<Value, Args, Result> & {
    init: Value;
};
