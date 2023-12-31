import type { WritableAtom } from 'jotai';
import { atom } from 'jotai';

import type { TechName } from '~/common/utils/techName';
import { getNextTechName, getRandomTechName } from '~/common/utils/techName';

type TechNameAtom = WritableAtom<TechName, [TechName | undefined], void>;

export const techNameAtom: TechNameAtom = atom(
    getRandomTechName(),
    (get, set, maybeTechName) =>
        set(
            techNameAtom,
            maybeTechName ??
                getNextTechName({ currentTechName: get(techNameAtom) }),
        ),
);

techNameAtom.debugLabel = 'techNameAtom';
