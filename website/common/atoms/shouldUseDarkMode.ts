import { atom, WritableAtom } from 'jotai';

export const shouldUseDarkModeAtom = atom(
    undefined,
    (get, set, shouldUseDarkMode) =>
        set(
            shouldUseDarkModeAtom,
            shouldUseDarkMode === undefined
                ? !get(shouldUseDarkModeAtom)
                : shouldUseDarkMode
        )
) as WritableAtom<boolean | undefined, [boolean | undefined], void>;

shouldUseDarkModeAtom.debugLabel = 'shouldUseDarkModeAtom';
