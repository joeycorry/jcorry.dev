import { backgroundIsVisibleAtom } from 'common/atoms/background';
import {
    techNameAnimationDataAtom,
    techNameAnimationIsFinishedAtom,
    techNameAnimationShouldRepeatAtom,
    techNameAtom,
} from 'common/atoms/techName';
import * as TechNameUtils from 'common/utils/techName';
import { useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect } from 'react';

import * as AtomHooks from './atom';

export function useAnimationStarter() {
    const animationIsFinished = useAtomValue(techNameAnimationIsFinishedAtom);
    const setBackgroundIsVisible = useSetAtom(backgroundIsVisibleAtom);
    const setNextAnimationData = AtomHooks.useNoArgumentSetAtom(
        techNameAnimationDataAtom
    );

    return useCallback(() => {
        if (!animationIsFinished) {
            return;
        }

        setBackgroundIsVisible(false);
        setNextAnimationData();
    }, [animationIsFinished, setBackgroundIsVisible, setNextAnimationData]);
}

function useAnimationStepper() {
    const techName = useAtomValue(techNameAtom);
    const setNextTechName = AtomHooks.useNoArgumentSetAtom(techNameAtom);
    const animationData = useAtomValue(techNameAnimationDataAtom);
    const setNextTechNameAnimationData = AtomHooks.useNoArgumentSetAtom(
        techNameAnimationDataAtom
    );

    return useCallback(
        () =>
            window.setTimeout(() => {
                if (
                    TechNameUtils.animationIsWaitingForNewTechName(
                        animationData
                    )
                ) {
                    setNextTechName();
                }

                if (
                    !TechNameUtils.animationIsFinished({
                        animationData,
                        techName,
                    })
                ) {
                    setNextTechNameAnimationData();
                }
            }, TechNameUtils.getAnimationStepTime({ animationData, techName })),
        [animationData, setNextTechName, setNextTechNameAnimationData, techName]
    );
}

export function useEffects() {
    const animationIsFinished = useAtomValue(techNameAnimationIsFinishedAtom);
    const animationShouldRepeat = useAtomValue(
        techNameAnimationShouldRepeatAtom
    );
    const startAnimation = useAnimationStarter();
    const stepAnimation = useAnimationStepper();

    useEffect(() => {
        if (!animationShouldRepeat) {
            return;
        }

        const timeoutId = window.setTimeout(startAnimation, 5000);

        return () => window.clearTimeout(timeoutId);
    }, [animationShouldRepeat, startAnimation]);

    useEffect(() => {
        if (animationIsFinished) {
            return;
        }

        const timeoutId = stepAnimation();

        return () => window.clearTimeout(timeoutId);
    }, [animationIsFinished, stepAnimation]);
}
