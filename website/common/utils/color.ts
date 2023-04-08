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

export function getColorVariantsByName({
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

    const darkerColor = color.darker(50);
    const lighterColor = color.lighter(66);

    return {
        primaryColor: shouldUseDarkMode ? lighterColor : darkerColor,
        secondaryColor: shouldUseDarkMode ? darkerColor : lighterColor,
        tertiaryColor: color,
    };
}

type GetColorVariantCssValuesByNameParameter = GetColorVariantsByNameParameter;

type ColorVariantCssValueName = `--${
    | 'primary'
    | 'secondary'
    | 'tertiary'}-color`;

export type ColorVariantCssValuesByName = {
    [K in ColorVariantCssValueName]: string;
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
);

export function getColorForTechName(techName: TechName) {
    if (!presetColorsByTechName.has(techName)) {
        throw new Error(`Invalid tech name: ${techName}`);
    }

    return presetColorsByTechName.get(techName)!;
}
