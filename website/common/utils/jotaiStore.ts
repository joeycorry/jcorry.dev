import { createStore } from 'jotai';

import { colorSchemeAtom } from '~/common/atoms/color';
import { techNameAtom } from '~/common/atoms/techName';

import type { AtomSetValueParameters } from './atom';

type JotaiStore = ReturnType<typeof createStore>;

type JotaiStoreAtomSetValueParametersByName = {
    colorScheme: AtomSetValueParameters<typeof colorSchemeAtom>;
    techName: AtomSetValueParameters<typeof techNameAtom>;
};

function createJotaiStore({
    atomSetValueParametersByName,
}: {
    atomSetValueParametersByName: JotaiStoreAtomSetValueParametersByName;
}): JotaiStore {
    const store = createStore();

    if ('colorScheme' in atomSetValueParametersByName) {
        store.set(colorSchemeAtom, ...atomSetValueParametersByName.colorScheme);
    }

    if ('techName' in atomSetValueParametersByName) {
        store.set(techNameAtom, ...atomSetValueParametersByName.techName);
    }

    return store;
}

export type { JotaiStore, JotaiStoreAtomSetValueParametersByName };
export { createJotaiStore };
