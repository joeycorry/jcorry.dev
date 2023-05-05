import { useAtomValue } from 'jotai';
import { useEffect } from 'react';

import { shouldUseDarkModeAtom } from '~/common/atoms/shouldUseDarkMode';
import { techNameAtom } from '~/common/atoms/techName';
import {
    getColorForTechName,
    getColorVariantCssValuesByName,
} from '~/common/utils/color';

export function useColorEffects() {
    const shouldUseDarkMode = useAtomValue(shouldUseDarkModeAtom);
    const techName = useAtomValue(techNameAtom);
    const color = getColorForTechName(techName);

    useEffect(() => {
        let themeColorMetaElement =
            window.document.querySelector<HTMLMetaElement>(
                'head meta[name="theme-color"]'
            );

        if (themeColorMetaElement === null) {
            themeColorMetaElement = window.document.createElement('meta');
            themeColorMetaElement.name = 'theme-color';
            window.document.head.appendChild(themeColorMetaElement);
        }

        themeColorMetaElement.content = color.toString();
    }, [color]);

    useEffect(() => {
        const rootElement = window.document.documentElement;
        const colorVariantCssValuesByName = getColorVariantCssValuesByName({
            shouldUseDarkMode,
            techName,
        });

        for (const [name, value] of Object.entries(
            colorVariantCssValuesByName
        )) {
            rootElement.style.setProperty(name, value);
        }
    }, [shouldUseDarkMode, techName]);
}
