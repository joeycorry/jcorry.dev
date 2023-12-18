import { atom } from 'jotai';

import type { Color } from '~/common/lib/colors/color';
import { Subject } from '~/common/lib/subject';
import type { ColorScheme, ColorVariantName } from '~/common/utils/color';
import { getColorVariantNames } from '~/common/utils/color';

export const colorSchemeAtom = atom<ColorScheme>('normal');

colorSchemeAtom.debugLabel = 'colorSchemeAtom';

export const colorVariantSubjectsByNameAtom = atom(
    Object.fromEntries(
        getColorVariantNames().map(colorVariantName => [
            colorVariantName,
            new Subject(),
        ]),
    ) as Record<ColorVariantName, Subject<Color>>,
);

colorVariantSubjectsByNameAtom.debugLabel = 'colorVariantSubjectsByNameAtom';
