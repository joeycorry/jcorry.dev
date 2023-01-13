import Color from 'common/lib/color';
import HslColor from 'common/lib/color/hslColor';

import * as TechNameUtils from './techName';

type GetVariantsParameter = {
    color: Color;
    shouldUseDarkMode?: boolean;
};

type ColorsByVariant = {
    [K in `${'primary' | 'secondary' | 'tertiary'}Color`]: Color;
};

export function getColorsByVariant({
    color,
    shouldUseDarkMode,
}: GetVariantsParameter): ColorsByVariant {
    if (shouldUseDarkMode === undefined) {
        return {
            primaryColor: color.withAlpha(0),
            secondaryColor: color.withAlpha(0),
            tertiaryColor: color.withAlpha(0),
        };
    }

    const darkerColor = color.darker(50);
    const lighterColor = color.lighter(66);

    return {
        primaryColor: shouldUseDarkMode ? lighterColor : darkerColor,
        secondaryColor: shouldUseDarkMode ? darkerColor : lighterColor,
        tertiaryColor: color,
    };
}

type GetCssVariablesParameter = GetVariantsParameter;

export type CssVariablesByName = {
    [K in `--${'primary' | 'secondary' | 'tertiary'}-color`]: string;
};

export function getCssVariablesByName({
    color,
    shouldUseDarkMode,
}: GetCssVariablesParameter): CssVariablesByName {
    const variants = getColorsByVariant({ color, shouldUseDarkMode });

    return {
        '--primary-color': variants.primaryColor.toString(),
        '--secondary-color': variants.secondaryColor.toString(),
        '--tertiary-color': variants.tertiaryColor.toString(),
    };
}

export function getColorForTechName(techName: TechNameUtils.TechName) {
    return presetColorsByTechName.get(techName)!;
}

const presetColorsByTechName = new Map(
    (
        [
            ['JavaScript', [53.4, 93.1, 50]],
            ['Ruby', [0, 100, 50]],
            ['TypeScript', [218, 50, 50]],
            ['React', [198.4, 90.2, 50]],
            ['Rails', [10, 82, 50]],
            ['Node', [118.4, 39.9, 50]],
        ] as const
    ).map(([name, [hueDegrees, saturationPercentage, lightnessPercentage]]) => [
        name,
        new HslColor({
            hueDegrees,
            lightnessPercentage,
            saturationPercentage,
        }),
    ])
) as unknown as Map<TechNameUtils.TechName, Color>;
