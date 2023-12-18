import { useAtomValue } from 'jotai';
import { useCallback, useEffect } from 'react';

import {
    techNameAnimationDataAtom,
    techNameAnimationIsFinishedAtom,
    techNameAnimationShouldRepeatAtom,
    techNameAtom,
} from '~/common/atoms/techName';
import {
    getTechNameAnimationStepTime,
    techNameAnimationIsFinished,
    techNameAnimationIsWaitingForNewTechName,
} from '~/common/utils/techName';

import { useNoArgumentSetAtom } from './atom';

export function useTechNameAnimationStarter() {
    const techNameAnimationIsFinished = useAtomValue(
        techNameAnimationIsFinishedAtom,
    );
    const setNextTechNameAnimationData = useNoArgumentSetAtom(
        techNameAnimationDataAtom,
    );

    return useCallback(() => {
        if (!techNameAnimationIsFinished) {
            return;
        }

        setNextTechNameAnimationData();
    }, [techNameAnimationIsFinished, setNextTechNameAnimationData]);
}

function useTechNameAnimationStepper() {
    const techName = useAtomValue(techNameAtom);
    const setNextTechName = useNoArgumentSetAtom(techNameAtom);
    const techNameAnimationData = useAtomValue(techNameAnimationDataAtom);
    const setNextTechNameAnimationData = useNoArgumentSetAtom(
        techNameAnimationDataAtom,
    );

    return useCallback(
        () =>
            window.setTimeout(
                () => {
                    if (
                        techNameAnimationIsWaitingForNewTechName(
                            techNameAnimationData,
                        )
                    ) {
                        setNextTechName();
                    }

                    if (
                        !techNameAnimationIsFinished({
                            animationData: techNameAnimationData,
                            techName,
                        })
                    ) {
                        setNextTechNameAnimationData();
                    }
                },
                getTechNameAnimationStepTime({
                    animationData: techNameAnimationData,
                    techName,
                }),
            ),
        [
            techNameAnimationData,
            setNextTechName,
            setNextTechNameAnimationData,
            techName,
        ],
    );
}

export function useTechNameEffects() {
    const techNameAnimationIsFinished = useAtomValue(
        techNameAnimationIsFinishedAtom,
    );
    const techNameAnimationShouldRepeat = useAtomValue(
        techNameAnimationShouldRepeatAtom,
    );
    const startTechNameAnimation = useTechNameAnimationStarter();
    const stepTechNameAnimation = useTechNameAnimationStepper();

    useEffect(() => {
        if (!techNameAnimationShouldRepeat) {
            return;
        }

        const timeoutId = window.setTimeout(startTechNameAnimation, 2000);

        return () => window.clearTimeout(timeoutId);
    }, [techNameAnimationShouldRepeat, startTechNameAnimation]);

    useEffect(() => {
        if (techNameAnimationIsFinished) {
            return;
        }

        const timeoutId = stepTechNameAnimation();

        return () => window.clearTimeout(timeoutId);
    }, [techNameAnimationIsFinished, stepTechNameAnimation]);
}
