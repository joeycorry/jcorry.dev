import type { Color } from '~/common/lib/colors/color';
import { HslColor } from '~/common/lib/colors/hslColor';

import type { TechName } from './techName';

export type RgbChannelName = 'blue' | 'green' | 'red';

export type RgbChannelOrAlphaName = 'alpha' | RgbChannelName;

export type ColorScheme = 'dark' | 'light' | 'normal';

type GetColorVariantsByNameParameter = {
    colorScheme: ColorScheme;
    techName: TechName;
};

type ColorVariantName = `${'primary' | 'secondary' | 'tertiary'}Color`;

export type ColorVariantsByName = {
    [K in ColorVariantName]: Color;
};

export function getColorVariantsByName({
    colorScheme,
    techName,
}: GetColorVariantsByNameParameter): ColorVariantsByName {
    const color = getColorForTechName(techName);

    if (colorScheme === 'normal') {
        return {
            primaryColor: color,
            secondaryColor: color,
            tertiaryColor: color,
        };
    }

    const darkerColor = color.darken(0.5);
    const lighterColor = color.lighten(0.66);

    return {
        primaryColor: colorScheme === 'dark' ? lighterColor : darkerColor,
        secondaryColor: colorScheme === 'dark' ? darkerColor : lighterColor,
        tertiaryColor: color,
    };
}

export type ColorVariantCssName = `--${
    | 'primary'
    | 'secondary'
    | 'tertiary'}-color`;

export type ColorVariantCssValuesByName = {
    [K in ColorVariantCssName]: string;
};

export function getColorVariantCssValuesByName({
    primaryColor,
    secondaryColor,
    tertiaryColor,
}: ColorVariantsByName): ColorVariantCssValuesByName {
    return {
        '--primary-color': primaryColor.toString(),
        '--secondary-color': secondaryColor.toString(),
        '--tertiary-color': tertiaryColor.toString(),
    };
}

export function setColorVariantCssVariables(
    colorVariantsByName: ColorVariantsByName
) {
    const rootElement = window.document.documentElement;
    const colorVariantCssValuesByName =
        getColorVariantCssValuesByName(colorVariantsByName);

    for (const [name, value] of Object.entries(colorVariantCssValuesByName)) {
        rootElement.style.setProperty(name, value);
    }
}

export function setFaviconColor({ secondaryColor }: ColorVariantsByName) {
    const canvasElement = window.document.createElement('canvas');
    const canvasContext = canvasElement.getContext('2d')!;
    canvasElement.width = 24;
    canvasElement.height = 24;
    canvasContext.fillStyle = secondaryColor.toString();

    canvasContext.fill(new Path2D('M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z'));

    const faviconElement =
        window.document.head.querySelector<HTMLLinkElement>(
            'link[rel="icon"]'
        ) || window.document.createElement('link');

    if (!window.document.head.contains(faviconElement)) {
        faviconElement.rel = 'icon';
        faviconElement.type = 'image/png';

        window.document.head.appendChild(faviconElement);
    }

    faviconElement.href = canvasElement.toDataURL(faviconElement.type);
}

export function setThemeColor({ secondaryColor }: ColorVariantsByName) {
    let themeColorMetaElement = window.document.querySelector<HTMLMetaElement>(
        'head meta[name="theme-color"]'
    );

    if (themeColorMetaElement === null) {
        themeColorMetaElement = window.document.createElement('meta');
        themeColorMetaElement.name = 'theme-color';
        window.document.head.appendChild(themeColorMetaElement);
    }

    themeColorMetaElement.content = secondaryColor.toString();
}

const presetColorsByTechName = new Map<TechName, Color>(
    (
        [
            ['JavaScript', [53.4, 0.931, 0.5]],
            ['Ruby', [0, 1, 0.5]],
            ['TypeScript', [218, 0.5, 0.5]],
            ['React', [198.4, 0.902, 0.5]],
            ['Rails', [10, 0.82, 0.5]],
            ['Node', [118.4, 0.399, 0.5]],
        ] as const
    ).map(([name, [hueDegrees, saturationPercentage, lightnessPercentage]]) => [
        name,
        new HslColor({
            hueDegrees,
            lightnessPercentage,
            saturationPercentage,
        }),
    ])
);

export function getColorForTechName(techName: TechName) {
    if (!presetColorsByTechName.has(techName)) {
        throw new Error(`Invalid tech name: ${techName}`);
    }

    return presetColorsByTechName.get(techName)!;
}
