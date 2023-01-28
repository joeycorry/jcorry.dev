import { shouldUseDarkModeAtom } from 'common/atoms/shouldUseDarkMode';
import { techNameAtom } from 'common/atoms/techName';
import * as AtomUtils from 'common/utils/atom';
import { Atom, Provider } from 'jotai';
import { memo, PropsWithChildren } from 'react';

type AtomProviderProps = PropsWithChildren<{
    valuesByBaseAtomName: AtomUtils.ValuesByBaseAtomName;
}>;

type BaseAtomsByName = {
    [AtomName in keyof AtomUtils.ValuesByBaseAtomName]: Atom<
        AtomUtils.ValuesByBaseAtomName[AtomName]
    >;
};

function AtomProvider({ children, valuesByBaseAtomName }: AtomProviderProps) {
    const baseAtomsByName = {
        shouldUseDarkModeAtom: shouldUseDarkModeAtom,
        techNameAtom: techNameAtom,
    } satisfies BaseAtomsByName;
    const providerValue = new Map();

    for (const [atomName, value] of Object.entries(valuesByBaseAtomName)) {
        providerValue.set(
            baseAtomsByName[atomName as keyof typeof baseAtomsByName],
            value
        );
    }

    return <Provider initialValues={providerValue}>{children}</Provider>;
}

export default memo(AtomProvider);
