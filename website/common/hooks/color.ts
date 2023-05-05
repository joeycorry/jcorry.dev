import { useAtomValue } from 'jotai';
import { useEffect } from 'react';

import { shouldUseDarkModeAtom } from '~/common/atoms/shouldUseDarkMode';
import { techNameAtom } from '~/common/atoms/techName';
import { colorVariantsByNameObservable } from '~/common/observables/colorVariantsByName';
import {
    getColorVariantsByName,
    setColorVariantCssVariables,
    setFaviconColor,
    setThemeColor,
} from '~/common/utils/color';

export function useColorEffects() {
    const shouldUseDarkMode = useAtomValue(shouldUseDarkModeAtom);
    const techName = useAtomValue(techNameAtom);

    useEffect(() => {
        const colorVariantsByName = getColorVariantsByName({
            shouldUseDarkMode,
            techName,
        });

        colorVariantsByNameObservable.set(colorVariantsByName);
    }, [shouldUseDarkMode, techName]);

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
