import { atom } from 'jotai';

import { Subject } from '~/common/lib/subject';
import type {
    ColorScheme,
    ColorVariantSubjectsByName,
} from '~/common/utils/color';
import { getColorVariantNames } from '~/common/utils/color';

const colorSchemeAtom = atom<ColorScheme>('normal');

colorSchemeAtom.debugLabel = 'colorSchemeAtom';

const colorVariantSubjectsByNameAtom = atom(
    Object.fromEntries(
        getColorVariantNames().map(colorVariantName => [
            colorVariantName,
            new Subject(),
        ]),
    ) as ColorVariantSubjectsByName,
);

colorVariantSubjectsByNameAtom.debugLabel = 'colorVariantSubjectsByNameAtom';

export { colorSchemeAtom, colorVariantSubjectsByNameAtom };
