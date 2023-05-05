import { Renderer } from '~/common/lib/renderer';
import { colorVariantsByNameSubject } from '~/common/subjects/color';
import { getColorVariantsByName } from '~/common/utils/color';
import { easeOutQuint } from '~/common/utils/easing';
import type { RendererOptions } from '~/common/utils/renderer';
import type { TechName } from '~/common/utils/techName';

type CreateColorTransitionRendererParameter = Pick<
    RendererOptions,
    'animationDuration'
> & {
    newShouldUseDarkMode: boolean | undefined;
    newTechName: TechName;
    previousShouldUseDarkMode: boolean | undefined;
    previousTechName: TechName;
};

export function createColorTransitionRenderer({
    newShouldUseDarkMode,
    newTechName,
    previousShouldUseDarkMode,
    previousTechName,
    ...rendererOptions
}: CreateColorTransitionRendererParameter) {
    const {
        primaryColor: previousPrimaryColor,
        secondaryColor: previousSecondaryColor,
        tertiaryColor: previousTertiaryColor,
    } = getColorVariantsByName({
        shouldUseDarkMode: previousShouldUseDarkMode,
        techName: previousTechName,
    });
    const {
        primaryColor: newPrimaryColor,
        secondaryColor: newSecondaryColor,
        tertiaryColor: newTertiaryColor,
    } = getColorVariantsByName({
        shouldUseDarkMode: newShouldUseDarkMode,
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
