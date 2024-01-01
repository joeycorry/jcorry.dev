import { Renderer } from '~/common/lib/renderer';
import type { Subject } from '~/common/lib/subject';
import type { RendererAnimationStartingDirection } from '~/common/utils/renderer';

function createNumberTransitionRenderer({
    numberSubject,
    maximum,
    minimum,
    ...rendererOptions
}: {
    animationDuration: number;
    animationIterationCount?: number;
    animationStartingDirection?: RendererAnimationStartingDirection;
    maximum: number;
    minimum: number;
    numberSubject: Subject<number>;
}) {
    const intervalMagnitude = maximum - minimum;

    return new Renderer(
        ({ currentAnimationPercentage }) => [
            () =>
                numberSubject.set(
                    currentAnimationPercentage * intervalMagnitude + minimum,
                ),
        ],
        rendererOptions,
    );
}

export { createNumberTransitionRenderer };
