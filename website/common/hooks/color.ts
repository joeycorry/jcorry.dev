import { useAtomValue } from 'jotai';
import { useEffect, useMemo } from 'react';

import { colorAtom } from '~/common/atoms/color';
import { shouldUseDarkModeAtom } from '~/common/atoms/shouldUseDarkMode';
import * as ColorUtils from '~/common/utils/color';

export function useCurrentPrimaryColorString() {
    const color = useAtomValue(colorAtom);
    const shouldUseDarkMode = useAtomValue(shouldUseDarkModeAtom);

    return ColorUtils.getCssVariablesByName({
        color,
        shouldUseDarkMode,
    })['--primary-color'];
}

export function useEffects() {
    const color = useAtomValue(colorAtom);
    const shouldUseDarkMode = useAtomValue(shouldUseDarkModeAtom);

    useEffect(() => {
        let themeColorMetaElement = document.querySelector(
            'head meta[name="theme-color"]'
        ) as HTMLMetaElement | null;

        if (themeColorMetaElement === null) {
            themeColorMetaElement = document.createElement('meta');
            themeColorMetaElement.name = 'theme-color';
            document.head.appendChild(themeColorMetaElement);
        }

        themeColorMetaElement.content = color.toString();
    }, [color]);

    useEffect(() => {
        const rootElement = window.document.documentElement;
        const cssVariablesByName = ColorUtils.getCssVariablesByName({
            color,
            shouldUseDarkMode,
        });

        for (const [name, value] of Object.entries(cssVariablesByName)) {
            rootElement.style.setProperty(name, value);
        }
    }, [color, shouldUseDarkMode]);
}

export function useVariants() {
    const color = useAtomValue(colorAtom);
    const shouldUseDarkMode = useAtomValue(shouldUseDarkModeAtom);

    return useMemo(
        () => ColorUtils.getColorsByVariant({ color, shouldUseDarkMode }),
        [color, shouldUseDarkMode]
    );
}
