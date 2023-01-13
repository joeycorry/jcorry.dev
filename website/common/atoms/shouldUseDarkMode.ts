import { atom, WritableAtom } from 'jotai';

export const shouldUseDarkModeAtom = atom(undefined, (get, set, update) =>
    set(
        shouldUseDarkModeAtom as unknown as WritableAtom<boolean, boolean>,
        update === undefined ? !get(shouldUseDarkModeAtom) : update
    )
) as WritableAtom<boolean | undefined, boolean | undefined, void>;

shouldUseDarkModeAtom.debugLabel = 'shouldUseDarkModeAtom';
