import { atom } from 'jotai';

import { getColorForTechName } from '~/common/utils/color';
import { getNextTechName } from '~/common/utils/techName';

import { techNameAtom } from './techName';

export const colorAtom = atom(get => getColorForTechName(get(techNameAtom)));

colorAtom.debugLabel = 'colorAtom';

export const nextColorAtom = atom(get =>
    getColorForTechName(getNextTechName(get(techNameAtom)))
);

nextColorAtom.debugLabel = 'nextColorAtom';
