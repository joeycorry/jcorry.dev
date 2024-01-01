import type { Color } from '~/common/lib/colors/color';
import { Renderer } from '~/common/lib/renderer';
import type { Subject } from '~/common/lib/subject';
import type {
    ColorScheme,
    ColorVariantSubjectsByName,
} from '~/common/utils/color';
import {
    getColorVariantNames,
    getColorVariantsByName,
} from '~/common/utils/color';
import { easeOutQuint } from '~/common/utils/easing';
import { createCompositeRenderer } from '~/common/utils/renderer';
import type { TechName } from '~/common/utils/techName';

export function createColorSubjectTransitionRenderer({
    animationDuration,
    colorSubject,
    newColor,
    previousColor,
}: {
    animationDuration: number;
    colorSubject: Subject<Color>;
    newColor: Color;
    previousColor: Color;
}) {
    return new Renderer(
        ({ currentAnimationPercentage }) => {
            const percentage = easeOutQuint(currentAnimationPercentage);
            const interpolatedColor = previousColor.interpolate(
                newColor,
                percentage,
            );

            return [() => colorSubject.set(interpolatedColor)];
        },
        { animationDuration },
    );
}

export function createColorVariantSubjectsByNameTransitionRenderer({
    animationDuration,
    colorVariantSubjectsByName,
    newColorScheme,
    newTechName,
    previousColorScheme,
    previousTechName,
}: {
    animationDuration: number;
    colorVariantSubjectsByName: ColorVariantSubjectsByName;
    newColorScheme: ColorScheme;
    newTechName: TechName;
    previousColorScheme: ColorScheme;
    previousTechName: TechName;
}) {
    const colorVariantNames = getColorVariantNames();
    const previousColorVariantsByName = getColorVariantsByName({
        colorScheme: previousColorScheme,
        techName: previousTechName,
    });
    const newColorVariantsByName = getColorVariantsByName({
        colorScheme: newColorScheme,
        techName: newTechName,
    });

    return createCompositeRenderer({
        renderersByStartingTimeEntries: colorVariantNames.map(
            colorVariantName => [
                0,
                createColorSubjectTransitionRenderer({
                    animationDuration,
                    colorSubject: colorVariantSubjectsByName[colorVariantName],
                    newColor: newColorVariantsByName[colorVariantName],
                    previousColor:
                        previousColorVariantsByName[colorVariantName],
                }),
            ],
        ),
    });
}
