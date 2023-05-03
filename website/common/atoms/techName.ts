import type { WritableAtom } from 'jotai';
import { atom } from 'jotai';

import type { WritableAtomWithInitialValue } from '~/common/utils/atom';
import type { TechName, TechNameAnimationData } from '~/common/utils/techName';
import {
    getNextTechName,
    getRandomTechName,
    techNameAnimationIsFinished,
} from '~/common/utils/techName';

type TechNameAtom = WritableAtomWithInitialValue<
    TechName,
    [TechName | undefined],
    void
>;

export const techNameAtom: TechNameAtom = atom<
    TechName,
    [TechName | undefined],
    void
>(getRandomTechName(), (get, set, techName) =>
    set(techNameAtom, techName || getNextTechName(get(techNameAtom)))
);

techNameAtom.debugLabel = 'techNameAtom';

export const techNameAnimationDataAtom = atom<
    TechNameAnimationData,
    [undefined],
    void
>(
    {
        visibleLength: 0,
        animationStatus: 'typing',
    },
    (get, set) => {
        const techNameAnimationDataAtom_ =
            techNameAnimationDataAtom as unknown as WritableAtom<
                TechNameAnimationData,
                [TechNameAnimationData],
                void
            >;
        const techName = get(techNameAtom);
        const { animationStatus, visibleLength } = get(
            techNameAnimationDataAtom_
        );

        if (visibleLength === techName.length) {
            set(techNameAnimationDataAtom_, {
                animationStatus: 'backspacing',
                visibleLength: techName.length - 1,
            });
        } else if (animationStatus === 'backspacing') {
            if (visibleLength >= 1 && visibleLength <= techName.length - 1) {
                set(techNameAnimationDataAtom_, {
                    animationStatus,
                    visibleLength: visibleLength - 1,
                });
            } else if (visibleLength === 0) {
                set(techNameAnimationDataAtom_, {
                    animationStatus: 'paused',
                    visibleLength: 0,
                });
            }
        } else if (animationStatus === 'paused' && visibleLength === 0) {
            set(techNameAnimationDataAtom_, {
                animationStatus: 'typing',
                visibleLength: 0,
            });
        } else if (animationStatus === 'typing') {
            if (visibleLength >= 0 && visibleLength < techName.length - 1) {
                set(techNameAnimationDataAtom_, {
                    animationStatus,
                    visibleLength: visibleLength + 1,
                });
            } else if (visibleLength === techName.length - 1) {
                set(techNameAnimationDataAtom_, {
                    animationStatus: 'paused',
                    visibleLength: techName.length,
                });
            }
        } else {
            console.warn(
                'Resetting to default tech name data state; invalid tech name data encountered:',
                { visibleLength, animationStatus }
            );
            set(techNameAnimationDataAtom_, {
                animationStatus: 'paused',
                visibleLength: techName.length,
            });
        }
    }
);

techNameAnimationDataAtom.debugLabel = 'techNameAnimationDataAtom';

export const techNameAnimationIsFinishedAtom = atom(get =>
    techNameAnimationIsFinished({
        animationData: get(techNameAnimationDataAtom),
        techName: get(techNameAtom),
    })
);

techNameAnimationIsFinishedAtom.debugLabel = 'techNameAnimationIsFinishedAtom';

export const techNameAnimationShouldRepeatAtom: WritableAtomWithInitialValue<
    boolean,
    [undefined],
    void
> = atom(true, (get, set) =>
    set(
        techNameAnimationShouldRepeatAtom as unknown as WritableAtom<
            boolean,
            [boolean],
            void
        >,
        !get(techNameAnimationShouldRepeatAtom)
    )
);

export const techNameDisplayDataAtom = atom(get => {
    const techName = get(techNameAtom);
    const { animationStatus, visibleLength } = get(techNameAnimationDataAtom);

    return {
        hiddenTechName:
            animationStatus === 'paused' ? '' : techName[visibleLength],
        visibleTechName: techName.slice(0, visibleLength),
    };
});

techNameDisplayDataAtom.debugLabel = 'techNameDisplayDataAtom';
