import { Renderer } from '~/common/lib/renderer';
import type { Subject } from '~/common/lib/subject';
import type { ColorScheme, ColorVariantsByName } from '~/common/utils/color';
import { getColorVariantsByName } from '~/common/utils/color';
import { easeOutQuint } from '~/common/utils/easing';
import type { RendererOptions } from '~/common/utils/renderer';
import type { TechName } from '~/common/utils/techName';

type CreateColorTransitionRendererParameter = Pick<
    RendererOptions,
    'animationDuration'
> & {
    colorVariantsByNameSubject: Subject<ColorVariantsByName>;
    newColorScheme: ColorScheme;
    newTechName: TechName;
    previousColorScheme: ColorScheme;
    previousTechName: TechName;
};

export function createColorTransitionRenderer({
    colorVariantsByNameSubject,
    newColorScheme,
    newTechName,
    previousColorScheme,
    previousTechName,
    ...rendererOptions
}: CreateColorTransitionRendererParameter) {
    const {
        primaryColor: previousPrimaryColor,
        secondaryColor: previousSecondaryColor,
        tertiaryColor: previousTertiaryColor,
    } = getColorVariantsByName({
        colorScheme: previousColorScheme,
        techName: previousTechName,
    });
    const {
        primaryColor: newPrimaryColor,
        secondaryColor: newSecondaryColor,
        tertiaryColor: newTertiaryColor,
    } = getColorVariantsByName({
        colorScheme: newColorScheme,
        techName: newTechName,
    });

    return new Renderer(({ currentAnimationPercentage }) => {
        const percentage = easeOutQuint(currentAnimationPercentage);

        return [
            () => {
                colorVariantsByNameSubject.set({
                    primaryColor: previousPrimaryColor.interpolate(
                        newPrimaryColor,
                        percentage
                    ),
                    secondaryColor: previousSecondaryColor.interpolate(
                        newSecondaryColor,
                        percentage
                    ),
                    tertiaryColor: previousTertiaryColor.interpolate(
                        newTertiaryColor,
                        percentage
                    ),
                });
            },
        ];
    }, rendererOptions);
}
