import type { Color } from '~/common/lib/colors/color';
import { HslColor } from '~/common/lib/colors/hslColor';
import type { Subject } from '~/common/lib/subject';

import { shuffleArray } from './array';
import type { TechName } from './techName';

export type RgbChannelName = 'blue' | 'green' | 'red';

export type RgbChannelOrAlphaName = 'alpha' | RgbChannelName;

export type ColorScheme = 'dark' | 'light' | 'normal';

type ColorVariantKey = 'accent' | 'background' | 'foreground';

export type ColorVariantName = `${ColorVariantKey}Color`;

export type ColorVariantsByName = Record<ColorVariantName, Color>;

export type ColorVariantSubjectsByName = Record<
    ColorVariantName,
    Subject<Color>
>;

type ColorVariantCssName = `--${ColorVariantKey}-color`;

type ColorVariantCssValuesByName = Record<ColorVariantCssName, string>;

function convertColorVariantNameToCssName(
    colorVariantName: ColorVariantName
): ColorVariantCssName {
    if (colorVariantName === 'accentColor') {
        return '--accent-color';
    } else if (colorVariantName === 'backgroundColor') {
        return '--background-color';
    } else if (colorVariantName === 'foregroundColor') {
        return '--foreground-color';
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
    return ['accentColor', 'backgroundColor', 'foregroundColor'];
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
            accentColor: color,
            backgroundColor: color,
            foregroundColor: color,
        };
    }

    const darkerColor = color.darken(0.5);
    const lighterColor = color.lighten(0.66);

    return {
        foregroundColor: colorScheme === 'dark' ? lighterColor : darkerColor,
        backgroundColor: colorScheme === 'dark' ? darkerColor : lighterColor,
        accentColor: color,
    };
}

type GetColorVariantCssValuesByNameParameter = ColorVariantsByName;

export function getColorVariantCssValuesByName({
    accentColor,
    backgroundColor,
    foregroundColor,
}: GetColorVariantCssValuesByNameParameter): ColorVariantCssValuesByName {
    return {
        '--accent-color': accentColor.toString(),
        '--background-color': backgroundColor.toString(),
        '--foreground-color': foregroundColor.toString(),
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
    shuffleArray([
        ['JavaScript', [53.4, 0.931, 0.5]],
        ['Ruby', [0, 1, 0.5]],
        ['TypeScript', [218, 0.5, 0.5]],
        ['React', [198.4, 0.902, 0.5]],
        ['Rails', [10, 0.82, 0.5]],
        ['Node', [118.4, 0.399, 0.5]],
    ] as const).map(
        ([name, [hueDegrees, saturationPercentage, lightnessPercentage]]) => [
            name,
            new HslColor({
                hueDegrees,
                lightnessPercentage,
                saturationPercentage,
            }),
        ]
    )
);

export function getColorForTechName(techName: TechName) {
    if (!presetColorsByTechName.has(techName)) {
        throw new Error(`Invalid tech name: ${techName}`);
    }

    return presetColorsByTechName.get(techName)!;
}
