import { atom } from 'jotai';

import type { ColorScheme } from '~/common/utils/color';

export const colorSchemeAtom = atom<ColorScheme>('normal');

colorSchemeAtom.debugLabel = 'colorSchemeAtom';
