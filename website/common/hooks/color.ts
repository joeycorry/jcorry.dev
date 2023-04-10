import { useAtomValue } from 'jotai';
import { useEffect, useMemo } from 'react';

import { colorAtom } from '~/common/atoms/color';
import { shouldUseDarkModeAtom } from '~/common/atoms/shouldUseDarkMode';
import {
    getColorVariantCssValuesByName,
    getColorVariantsByName,
} from '~/common/utils/color';

export function useColorEffects() {
    const color = useAtomValue(colorAtom);
    const shouldUseDarkMode = useAtomValue(shouldUseDarkModeAtom);

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
            color,
            shouldUseDarkMode,
        });

        for (const [name, value] of Object.entries(
            colorVariantCssValuesByName
        )) {
            rootElement.style.setProperty(name, value);
        }
    }, [color, shouldUseDarkMode]);
}

export function useColorVariantsByName() {
    const color = useAtomValue(colorAtom);
    const shouldUseDarkMode = useAtomValue(shouldUseDarkModeAtom);

    return useMemo(
        () => getColorVariantsByName({ color, shouldUseDarkMode }),
        [color, shouldUseDarkMode]
    );
}

export function useColorVariantCssValuesByName() {
    const color = useAtomValue(colorAtom);
    const shouldUseDarkMode = useAtomValue(shouldUseDarkModeAtom);

    return getColorVariantCssValuesByName({
        color,
        shouldUseDarkMode,
    });
}
