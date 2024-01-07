import type { Color } from '~/common/lib/colors/color';
import { HslColor } from '~/common/lib/colors/hslColor';
import { RgbColor } from '~/common/lib/colors/rgbColor';
import type { Subject } from '~/common/lib/subject';

import type { KebabCase } from './formatting';
import { setRootElementCssVariable } from './style';
import type { TechName } from './techName';
import { techNames } from './techName';

type ColorScheme = 'dark' | 'light' | 'unknown';

type ColorVariantCssName = `--${KebabCase<ColorVariantKey>}-color`;

type ColorVariantCssValuesByName = Record<ColorVariantCssName, string>;

type ColorVariantKey =
    | 'accent'
    | 'background'
    | 'foreground'
    | 'neutral'
    | 'secondaryAccent'
    | 'secondaryBackground'
    | 'secondaryForeground'
    | 'secondaryNeutral';

type ColorVariantName = `${ColorVariantKey}Color`;

type ColorVariantSubjectsByName = Record<ColorVariantName, Subject<Color>>;

type ColorVariantsByName = Record<ColorVariantName, Color>;

type PrimaryColorVariantName = Exclude<ColorVariantName, `secondary${string}`>;

const hslColorArgsByTechName: Record<
    TechName,
    readonly [number, number, number]
> = {
    JavaScript: [53.4, 0.931, 0.5],
    Ruby: [0, 1, 0.5],
    TypeScript: [218, 0.5, 0.5],
    React: [198.4, 0.902, 0.5],
    Rails: [10, 0.82, 0.5],
};

const colorsByTechName = new Map<TechName, Color>(
    techNames
        .map(techName => [techName, hslColorArgsByTechName[techName]] as const)
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

function createColorVariantCssValuesByName({
    colorScheme,
    techName,
}: {
    colorScheme: ColorScheme;
    techName: TechName;
}): ColorVariantCssValuesByName {
    const {
        accentColor,
        backgroundColor,
        foregroundColor,
        neutralColor,
        secondaryAccentColor,
        secondaryBackgroundColor,
        secondaryForegroundColor,
        secondaryNeutralColor,
    } = createColorVariantsByName({ colorScheme, techName });

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

function createColorVariantCssVariableSetter(
    colorVariantName: ColorVariantName,
): (color: Color) => void {
    const colorVariantCssName = getColorVariantCssName(colorVariantName);

    return (color: Color) =>
        setRootElementCssVariable(colorVariantCssName, color.toString());
}

function createColorVariantsByName({
    colorScheme,
    techName,
}: {
    colorScheme: ColorScheme;
    techName: TechName;
}): ColorVariantsByName {
    const color = getColor(techName);

    if (colorScheme === 'unknown') {
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

    const rawNeutralColor = color.toDesaturated(0.75).toHslColor();
    const neutralLightColor = rawNeutralColor.toLightened(0.5);
    const neutralDarkColor = rawNeutralColor.toDarkened(0.5);

    const slightlyDarkerColor = color.toDarkened(0.3);
    const darkerColor = color.toDarkened(0.5);
    const darkestColor = color.toDarkened(0.9);
    const slightlyLighterColor = color.toLightened(0.3);
    const lighterColor = color.toLightened(0.5);
    const lightestColor = color.toLightened(0.9);

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

function createTransparentColor(): Color {
    return new RgbColor({
        alphaPercentage: 0,
        bluePercentage: 0,
        greenPercentage: 0,
        redPercentage: 0,
    });
}

function getColor(techName: TechName): Color {
    if (!colorsByTechName.has(techName)) {
        throw new Error(`No color found for tech name: ${techName}`);
    }

    return colorsByTechName.get(techName)!;
}

function getColorVariantCssName(
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

function getColorVariantNames(): ColorVariantName[] {
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

function getComplementaryColorVariantName(
    colorVariantName: PrimaryColorVariantName,
): ColorVariantName {
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

export type {
    ColorScheme,
    ColorVariantSubjectsByName,
    PrimaryColorVariantName,
};
export {
    createColorVariantCssValuesByName,
    createColorVariantCssVariableSetter,
    createColorVariantsByName,
    createTransparentColor,
    getColor,
    getColorVariantNames,
    getComplementaryColorVariantName,
};
