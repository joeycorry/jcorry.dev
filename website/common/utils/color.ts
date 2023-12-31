import type { Color } from '~/common/lib/colors/color';
import { HslColor } from '~/common/lib/colors/hslColor';
import type { Subject } from '~/common/lib/subject';

import { setRootElementCssVariable } from './style';
import type { TechName } from './techName';
import { techNames } from './techName';
import type { KebabCase } from './type';

export type RgbChannelName = 'blue' | 'green' | 'red';

export type RgbChannelOrAlphaName = 'alpha' | RgbChannelName;

export type ColorScheme = 'dark' | 'light' | 'normal';

type ColorVariantKey =
    | 'accent'
    | 'background'
    | 'foreground'
    | 'neutral'
    | 'secondaryAccent'
    | 'secondaryBackground'
    | 'secondaryForeground'
    | 'secondaryNeutral';

export type ColorVariantName = `${ColorVariantKey}Color`;

export type PrimaryColorVariantName = Exclude<
    ColorVariantName,
    `secondary${string}`
>;

export type ColorVariantsByName = Record<ColorVariantName, Color>;

export type ColorVariantSubjectsByName = Record<
    ColorVariantName,
    Subject<Color>
>;

type ColorVariantCssName = `--${KebabCase<ColorVariantKey>}-color`;

type ColorVariantCssValuesByName = Record<ColorVariantCssName, string>;

function convertColorVariantNameToCssName(
    colorVariantName: ColorVariantName,
): ColorVariantCssName {
    if (colorVariantName === 'accentColor') {
        return '--accent-color';
    } else if (colorVariantName === 'backgroundColor') {
        return '--background-color';
    } else if (colorVariantName === 'foregroundColor') {
        return '--foreground-color';
    } else if (colorVariantName === 'neutralColor') {
        return '--neutral-color';
    } else if (colorVariantName === 'secondaryAccentColor') {
        return '--secondary-accent-color';
    } else if (colorVariantName === 'secondaryBackgroundColor') {
        return '--secondary-background-color';
    } else if (colorVariantName === 'secondaryForegroundColor') {
        return '--secondary-foreground-color';
    } else if (colorVariantName === 'secondaryNeutralColor') {
        return '--secondary-neutral-color';
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

    return (color: Color) =>
        setRootElementCssVariable({
            cssVariableName: colorVariantCssName,
            cssValue: color.toString(),
        });
}

export function getColorVariantNames(): ColorVariantName[] {
    return [
        'accentColor',
        'backgroundColor',
        'foregroundColor',
        'neutralColor',
        'secondaryAccentColor',
        'secondaryBackgroundColor',
        'secondaryForegroundColor',
        'secondaryNeutralColor',
    ];
}

type GetComplementaryColorVariantNameParameter = {
    colorVariantName: PrimaryColorVariantName;
};

export function getComplementaryColorVariantName({
    colorVariantName,
}: GetComplementaryColorVariantNameParameter): ColorVariantName {
    if (colorVariantName === 'accentColor') {
        return 'secondaryAccentColor';
    } else if (colorVariantName === 'backgroundColor') {
        return 'secondaryBackgroundColor';
    } else if (colorVariantName === 'foregroundColor') {
        return 'secondaryForegroundColor';
    } else if (colorVariantName === 'neutralColor') {
        return 'secondaryNeutralColor';
    }

    throw new Error(`Invalid color variant name: ${colorVariantName}`);
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
            neutralColor: color,
            secondaryAccentColor: color,
            secondaryBackgroundColor: color,
            secondaryForegroundColor: color,
            secondaryNeutralColor: color,
        };
    }

    const rawNeutralColor = color.desaturate(0.75).toHslColor();
    const neutralLightColor = rawNeutralColor.lighten(0.5);
    const neutralDarkColor = rawNeutralColor.darken(0.5);

    const slightlyDarkerColor = color.darken(0.3);
    const darkerColor = color.darken(0.5);
    const darkestColor = color.darken(0.9);
    const slightlyLighterColor = color.lighten(0.3);
    const lighterColor = color.lighten(0.5);
    const lightestColor = color.lighten(0.9);

    return {
        accentColor:
            colorScheme === 'dark' ? slightlyLighterColor : slightlyDarkerColor,
        backgroundColor: colorScheme === 'dark' ? darkestColor : lightestColor,
        foregroundColor: colorScheme === 'dark' ? lighterColor : darkerColor,
        neutralColor:
            colorScheme === 'dark' ? neutralLightColor : neutralDarkColor,
        secondaryAccentColor:
            colorScheme === 'dark' ? darkerColor : lighterColor,
        secondaryBackgroundColor:
            colorScheme === 'dark' ? lightestColor : darkestColor,
        secondaryForegroundColor:
            colorScheme === 'dark' ? slightlyDarkerColor : slightlyLighterColor,
        secondaryNeutralColor:
            colorScheme === 'dark' ? neutralDarkColor : neutralLightColor,
    };
}

type GetColorVariantCssValuesByNameParameter = ColorVariantsByName;

export function getColorVariantCssValuesByName({
    accentColor,
    backgroundColor,
    foregroundColor,
    neutralColor,
    secondaryAccentColor,
    secondaryBackgroundColor,
    secondaryForegroundColor,
    secondaryNeutralColor,
}: GetColorVariantCssValuesByNameParameter): ColorVariantCssValuesByName {
    return {
        '--accent-color': accentColor.toString(),
        '--background-color': backgroundColor.toString(),
        '--foreground-color': foregroundColor.toString(),
        '--neutral-color': neutralColor.toString(),
        '--secondary-accent-color': secondaryAccentColor.toString(),
        '--secondary-background-color': secondaryBackgroundColor.toString(),
        '--secondary-foreground-color': secondaryForegroundColor.toString(),
        '--secondary-neutral-color': secondaryNeutralColor.toString(),
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
            'link[rel="icon"]',
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
        'head meta[name="theme-color"]',
    );

    if (themeColorMetaElement === null) {
        themeColorMetaElement = window.document.createElement('meta');
        themeColorMetaElement.name = 'theme-color';
        window.document.head.appendChild(themeColorMetaElement);
    }

    themeColorMetaElement.content = color.toString();
}

const presetColorArgsByTechName = {
    JavaScript: [53.4, 0.931, 0.5],
    Ruby: [0, 1, 0.5],
    TypeScript: [218, 0.5, 0.5],
    React: [198.4, 0.902, 0.5],
    Rails: [10, 0.82, 0.5],
} as const;

const presetColorsByTechName = new Map<TechName, Color>(
    techNames
        .map(
            techName =>
                [techName, presetColorArgsByTechName[techName]] as const,
        )
        .map(
            ([
                techName,
                [hueDegrees, saturationPercentage, lightnessPercentage],
            ]) => [
                techName,
                new HslColor({
                    hueDegrees,
                    lightnessPercentage,
                    saturationPercentage,
                }),
            ],
        ),
);

export function getColorForTechName(techName: TechName) {
    if (!presetColorsByTechName.has(techName)) {
        throw new Error(`Invalid tech name: ${techName}`);
    }

    return presetColorsByTechName.get(techName)!;
}
