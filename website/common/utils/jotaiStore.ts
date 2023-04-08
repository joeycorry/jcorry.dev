import { createStore } from 'jotai';

import { shouldUseDarkModeAtom } from '~/common/atoms/shouldUseDarkMode';
import { techNameAtom } from '~/common/atoms/techName';

import type { AtomSetValueParameters } from './atom';

export type JotaiStoreAtomSetValueParametersByName = {
    shouldUseDarkMode: AtomSetValueParameters<typeof shouldUseDarkModeAtom>;
    techName: AtomSetValueParameters<typeof techNameAtom>;
};

export function createJotaiStore(
    atomSetValueParametersByName: JotaiStoreAtomSetValueParametersByName
) {
    const store = createStore();

    if ('shouldUseDarkMode' in atomSetValueParametersByName) {
        store.set(
            shouldUseDarkModeAtom,
            ...atomSetValueParametersByName.shouldUseDarkMode
        );
    }

    if ('techName' in atomSetValueParametersByName) {
        store.set(techNameAtom, ...atomSetValueParametersByName.techName);
    }

    return store;
}

export type JotaiStore = ReturnType<typeof createJotaiStore>;
