import type { Color } from '~/common/lib/color';
import { HslColor } from '~/common/lib/color/hslColor';

import type { TechName } from './techName';

type GetColorVariantsByNameParameter = {
    color: Color;
    shouldUseDarkMode?: boolean;
};

type ColorVariantName = `${'primary' | 'secondary' | 'tertiary'}Color`;

type ColorVariantsByName = {
    [K in ColorVariantName]: Color;
};

function getColorVariantsByName({
    color,
    shouldUseDarkMode,
}: GetColorVariantsByNameParameter): ColorVariantsByName {
    if (shouldUseDarkMode === undefined) {
        return {
            primaryColor: color,
            secondaryColor: color,
            tertiaryColor: color,
        };
    }

    const darkerColor = color.darker(0.5);
    const lighterColor = color.lighter(0.66);

    return {
        primaryColor: shouldUseDarkMode ? lighterColor : darkerColor,
        secondaryColor: shouldUseDarkMode ? darkerColor : lighterColor,
        tertiaryColor: color,
    };
}

type GetColorVariantCssValuesByNameParameter = GetColorVariantsByNameParameter;

export type ColorVariantCssName = `--${
    | 'primary'
    | 'secondary'
    | 'tertiary'}-color`;

export type ColorVariantCssValuesByName = {
    [K in ColorVariantCssName]: string;
};

export function getColorVariantCssValuesByName({
    color,
    shouldUseDarkMode,
}: GetColorVariantCssValuesByNameParameter): ColorVariantCssValuesByName {
    const { primaryColor, secondaryColor, tertiaryColor } =
        getColorVariantsByName({ color, shouldUseDarkMode });

    return {
        '--primary-color': primaryColor.toString(),
        '--secondary-color': secondaryColor.toString(),
        '--tertiary-color': tertiaryColor.toString(),
    };
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
