import { Atom, atom, createStore, WritableAtom } from 'jotai';

import { shouldUseDarkModeAtom } from '~/common/atoms/shouldUseDarkMode';
import { techNameAtom } from '~/common/atoms/techName';

export function atomWithNoArgumentSetter<Value>(
    initialValue: Value,
    setter: () => Value
): WritableAtom<Value, [undefined], void> {
    const baseAtom = atom(initialValue);

    return atom(
        get => get(baseAtom),
        (_, set) => set(baseAtom, setter())
    );
}

export type AtomSetParameters<T> = T extends WritableAtom<
    unknown,
    infer Parameters,
    unknown
>
    ? Parameters
    : T extends Atom<infer Parameter>
    ? [Parameter]
    : never;

export type JotaiStoreSetParametersByName = {
    shouldUseDarkMode: AtomSetParameters<typeof shouldUseDarkModeAtom>;
    techName: AtomSetParameters<typeof techNameAtom>;
};

export function createJotaiStore(
    setParametersByName: JotaiStoreSetParametersByName
) {
    const store = createStore();

    if ('shouldUseDarkMode' in setParametersByName) {
        store.set(
            shouldUseDarkModeAtom,
            ...setParametersByName.shouldUseDarkMode
        );
    }

    if ('techName' in setParametersByName) {
        store.set(techNameAtom, ...setParametersByName.techName);
    }

    return store;
}

export type JotaiStore = ReturnType<typeof createJotaiStore>;
