import type { Color } from '~/common/lib/colors/color';
import { Renderer } from '~/common/lib/renderer';
import type { Subject } from '~/common/lib/subject';
import type {
    ColorScheme,
    ColorVariantSubjectsByName,
} from '~/common/utils/color';
import {
    createColorVariantsByName,
    getColorVariantNames,
} from '~/common/utils/color';
import { easeOutQuint } from '~/common/utils/easing';
import { createCompositeRenderer } from '~/common/utils/renderer';
import type { TechName } from '~/common/utils/techName';

function createColorSubjectTransitionRenderer({
    animationDuration,
    colorSubject,
    newColor,
    previousColor,
}: {
    animationDuration: number;
    colorSubject: Subject<Color>;
    newColor: Color;
    previousColor: Color;
}): Renderer {
    return new Renderer({
        animationDuration,
        computeNextRenderables({ currentAnimationPercentage }) {
            const percentage = easeOutQuint(currentAnimationPercentage);
            const interpolatedColor = previousColor.toInterpolated(
                newColor,
                percentage,
            );

            return [() => colorSubject.set(interpolatedColor)];
        },
    });
}

function createColorVariantSubjectsByNameTransitionRenderer({
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
}): Renderer {
    const colorVariantNames = getColorVariantNames();
    const previousColorVariantsByName = createColorVariantsByName({
        colorScheme: previousColorScheme,
        techName: previousTechName,
    });
    const newColorVariantsByName = createColorVariantsByName({
        colorScheme: newColorScheme,
        techName: newTechName,
    });
    const renderersByStartingTimeEntries: Array<[number, Renderer]> = [];

    for (const colorVariantName of colorVariantNames) {
        const renderer = createColorSubjectTransitionRenderer({
            animationDuration,
            colorSubject: colorVariantSubjectsByName[colorVariantName],
            newColor: newColorVariantsByName[colorVariantName],
            previousColor: previousColorVariantsByName[colorVariantName],
        });

        renderersByStartingTimeEntries.push([0, renderer]);
    }

    return createCompositeRenderer({
        renderersByStartingTimeEntries,
    });
}

export {
    createColorSubjectTransitionRenderer,
    createColorVariantSubjectsByNameTransitionRenderer,
};
