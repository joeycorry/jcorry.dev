import * as ColorUtils from 'common/utils/color';
import * as TechNameUtils from 'common/utils/techName';
import { atom } from 'jotai';

import { techNameAtom } from './techName';

export const colorAtom = atom(get =>
    ColorUtils.getColorForTechName(get(techNameAtom))
);

colorAtom.debugLabel = 'colorAtom';

export const nextColorAtom = atom(get =>
    ColorUtils.getColorForTechName(
        TechNameUtils.getNextTechName(get(techNameAtom))
    )
);

nextColorAtom.debugLabel = 'nextColorAtom';
