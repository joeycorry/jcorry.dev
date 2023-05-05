import { useAtomValue } from 'jotai';
import { useEffect, useRef } from 'react';

import { shouldUseDarkModeAtom } from '~/common/atoms/shouldUseDarkMode';
import { techNameAtom } from '~/common/atoms/techName';
import { getRendererManager } from '~/common/lib/rendererManager';
import { colorVariantsByNameObservable } from '~/common/observables/colorVariantsByName';
import {
    getColorVariantsByName,
    setColorVariantCssVariables,
    setFaviconColor,
    setThemeColor,
} from '~/common/utils/color';
import { createColorTransitionRenderer } from '~/common/utils/renderer';

export function useColorEffects() {
    const rendererManager = getRendererManager();
    const shouldUseDarkMode = useAtomValue(shouldUseDarkModeAtom);
    const previousShouldUseDarkModeRef = useRef(shouldUseDarkMode);
    const techName = useAtomValue(techNameAtom);
    const previousTechNameRef = useRef(techName);

    useEffect(() => {
        const previousShouldUseDarkMode = previousShouldUseDarkModeRef.current;
        previousShouldUseDarkModeRef.current = shouldUseDarkMode;
        const previousTechName = previousTechNameRef.current;
        previousTechNameRef.current = techName;

        if (
            shouldUseDarkMode === previousShouldUseDarkMode &&
            techName === previousTechName
        ) {
            const colorVariantsByName = getColorVariantsByName({
                shouldUseDarkMode,
                techName,
            });

            colorVariantsByNameObservable.set(colorVariantsByName);

            return;
        }

        const colorTransitionRenderer = createColorTransitionRenderer({
            animationDuration: 400,
            newShouldUseDarkMode: shouldUseDarkMode,
            newTechName: techName,
            previousShouldUseDarkMode,
            previousTechName,
        });

        rendererManager.addRenderer(colorTransitionRenderer);

        return () => {
            rendererManager.removeRenderer(colorTransitionRenderer);
        };
    }, [rendererManager, shouldUseDarkMode, techName]);

    useEffect(() => {
        colorVariantsByNameObservable.subscribe(setColorVariantCssVariables);
        colorVariantsByNameObservable.subscribe(setFaviconColor);
        colorVariantsByNameObservable.subscribe(setThemeColor);

        return () => {
            colorVariantsByNameObservable.unsubscribe(
                setColorVariantCssVariables
            );
            colorVariantsByNameObservable.unsubscribe(setFaviconColor);
            colorVariantsByNameObservable.unsubscribe(setThemeColor);
        };
    }, []);
}
