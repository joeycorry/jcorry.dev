import { atom } from 'jotai';

import type { WritableAtomWithInitialValue } from '~/common/utils/atom';

type ShouldUseDarkModeAtom = WritableAtomWithInitialValue<
    boolean | undefined,
    [boolean | undefined],
    void
>;

export const shouldUseDarkModeAtom: ShouldUseDarkModeAtom = atom(
    undefined,
    (get, set, shouldUseDarkMode) =>
        set(
            shouldUseDarkModeAtom,
            shouldUseDarkMode === undefined
                ? !get(shouldUseDarkModeAtom)
                : shouldUseDarkMode
        )
);

shouldUseDarkModeAtom.debugLabel = 'shouldUseDarkModeAtom';
