import { atom } from 'jotai';

import { getColorForTechName } from '~/common/utils/color';

import { techNameAtom } from './techName';

export const colorAtom = atom(get => getColorForTechName(get(techNameAtom)));

colorAtom.debugLabel = 'colorAtom';
