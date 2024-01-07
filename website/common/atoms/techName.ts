import type { WritableAtom } from 'jotai';
import { atom } from 'jotai';

import type { TechName } from '~/common/utils/techName';
import { getNextTechName, getRandomTechName } from '~/common/utils/techName';

const techNameAtom: WritableAtom<TechName, [TechName | undefined], void> = atom(
    getRandomTechName(),
    (get, set, maybeTechName) =>
        set(techNameAtom, maybeTechName ?? getNextTechName(get(techNameAtom))),
);

techNameAtom.debugLabel = 'techNameAtom';

export { techNameAtom };
