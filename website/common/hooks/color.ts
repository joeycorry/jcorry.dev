import { useAtomValue } from 'jotai';
import { useEffect, useRef } from 'react';

import { shouldUseDarkModeAtom } from '~/common/atoms/shouldUseDarkMode';
import { techNameAtom } from '~/common/atoms/techName';
import { getRendererManager } from '~/common/lib/rendererManager';
import { colorVariantsByNameSubject } from '~/common/subjects/colorVariantsByName';
import {
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
        colorVariantsByNameSubject.register(setColorVariantCssVariables);
        colorVariantsByNameSubject.register(setFaviconColor);
        colorVariantsByNameSubject.register(setThemeColor);

        return () => {
            colorVariantsByNameSubject.unregister(setColorVariantCssVariables);
            colorVariantsByNameSubject.unregister(setFaviconColor);
            colorVariantsByNameSubject.unregister(setThemeColor);
        };
    }, []);
}
