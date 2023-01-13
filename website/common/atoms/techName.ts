import * as TechNameUtils from 'common/utils/techName';
import { atom, WritableAtom } from 'jotai';

export const techNameAtom = atom(
    TechNameUtils.getRandomTechName(),
    (get, set) =>
        set(
            techNameAtom as unknown as WritableAtom<
                TechNameUtils.TechName,
                TechNameUtils.TechName
            >,
            TechNameUtils.getNextTechName(get(techNameAtom))
        )
) as WritableAtom<TechNameUtils.TechName, undefined, void>;

techNameAtom.debugLabel = 'techNameAtom';

export const techNameAnimationDataAtom = atom<
    TechNameUtils.AnimationData,
    undefined
>(
    {
        visibleLength: 0,
        animationStatus: 'typing',
    },
    (get, set) => {
        const techNameAnimationDataAtom_ =
            techNameAnimationDataAtom as unknown as WritableAtom<
                TechNameUtils.AnimationData,
                TechNameUtils.AnimationData
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
    TechNameUtils.animationIsFinished({
        animationData: get(techNameAnimationDataAtom),
        techName: get(techNameAtom),
    })
);

techNameAnimationIsFinishedAtom.debugLabel = 'techNameAnimationIsFinishedAtom';

export const techNameAnimationShouldRepeatAtom = atom(true, (get, set) =>
    set(
        techNameAnimationShouldRepeatAtom as unknown as WritableAtom<
            boolean,
            boolean
        >,
        !get(techNameAnimationShouldRepeatAtom)
    )
) as WritableAtom<boolean, undefined, void>;

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
