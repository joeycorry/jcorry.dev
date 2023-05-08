import { atom } from 'jotai';

import { Subject } from '~/common/lib/subject';
import { mountInitializedReadonlyAtom } from '~/common/utils/atom';
import type { ColorScheme, ColorVariantsByName } from '~/common/utils/color';

export const colorSchemeAtom = atom<ColorScheme>('normal');

colorSchemeAtom.debugLabel = 'colorSchemeAtom';

export const colorVariantsByNameSubjectAtom = mountInitializedReadonlyAtom(
    () => new Subject<ColorVariantsByName>()
);
