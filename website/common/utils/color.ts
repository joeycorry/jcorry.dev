import type { Color } from '~/common/lib/colors/color';
import { HslColor } from '~/common/lib/colors/hslColor';
import type { Subject } from '~/common/lib/subject';

import type { TechName } from './techName';

export type RgbChannelName = 'blue' | 'green' | 'red';

export type RgbChannelOrAlphaName = 'alpha' | RgbChannelName;

export type ColorScheme = 'dark' | 'light' | 'normal';

export type ColorVariantName = `${'primary' | 'secondary' | 'tertiary'}Color`;

export type ColorVariantsByName = Record<ColorVariantName, Color>;

export type ColorVariantSubjectsByName = Record<
    ColorVariantName,
    Subject<Color>
>;

type ColorVariantCssName = `--${'primary' | 'secondary' | 'tertiary'}-color`;

type ColorVariantCssValuesByName = Record<ColorVariantCssName, string>;

function convertColorVariantNameToCssName(
    colorVariantName: ColorVariantName
): ColorVariantCssName {
    if (colorVariantName === 'primaryColor') {
        return '--primary-color';
    } else if (colorVariantName === 'secondaryColor') {
        return '--secondary-color';
    } else if (colorVariantName === 'tertiaryColor') {
        return '--tertiary-color';
    }

    throw new Error(`Invalid color variant name: ${colorVariantName}`);
}

type CreateColorVariantCssVariableSetterParameter = {
    colorVariantName: ColorVariantName;
};

export function createColorVariantCssVariableSetter({
    colorVariantName,
}: CreateColorVariantCssVariableSetterParameter) {
    const colorVariantCssName =
        convertColorVariantNameToCssName(colorVariantName);

    return (color: Color) => {
        const rootElement = window.document.documentElement;

        rootElement.style.setProperty(colorVariantCssName, color.toString());
    };
}

export function getColorVariantNames(): ColorVariantName[] {
    return ['primaryColor', 'secondaryColor', 'tertiaryColor'];
}

type GetColorVariantsByNameParameter = {
    colorScheme: ColorScheme;
    techName: TechName;
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

type GetColorVariantCssValuesByNameParameter = ColorVariantsByName;

export function getColorVariantCssValuesByName({
    primaryColor,
    secondaryColor,
    tertiaryColor,
}: GetColorVariantCssValuesByNameParameter): ColorVariantCssValuesByName {
    return {
        '--primary-color': primaryColor.toString(),
        '--secondary-color': secondaryColor.toString(),
        '--tertiary-color': tertiaryColor.toString(),
    };
}

export function setFaviconColor(color: Color) {
    const canvasElement = window.document.createElement('canvas');
    const canvasContext = canvasElement.getContext('2d')!;
    canvasElement.width = 24;
    canvasElement.height = 24;
    canvasContext.fillStyle = color.toString();

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

export function setThemeColor(color: Color) {
    let themeColorMetaElement = window.document.querySelector<HTMLMetaElement>(
        'head meta[name="theme-color"]'
    );

    if (themeColorMetaElement === null) {
        themeColorMetaElement = window.document.createElement('meta');
        themeColorMetaElement.name = 'theme-color';
        window.document.head.appendChild(themeColorMetaElement);
    }

    themeColorMetaElement.content = color.toString();
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
