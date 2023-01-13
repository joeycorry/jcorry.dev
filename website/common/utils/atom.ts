import { atom, WritableAtom } from 'jotai';

import * as TechNameUtils from './techName';

export function atomWithNoArgumentSetter<Value>(
    initialValue: Value,
    setter: () => Value
): WritableAtom<Value, undefined> {
    const baseAtom = atom(initialValue);

    return atom(
        get => get(baseAtom),
        (_, set) => set(baseAtom, setter())
    );
}

export type ValuesByBaseAtomName = {
    shouldUseDarkModeAtom?: boolean;
    techNameAtom: TechNameUtils.TechName;
};
