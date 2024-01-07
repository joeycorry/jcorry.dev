import { Renderer } from '~/common/lib/renderer';
import type { Subject } from '~/common/lib/subject';
import type { RendererAnimationStartingDirection } from '~/common/utils/renderer';

function createNumberTransitionRenderer({
    numberSubject,
    maximum,
    minimum,
    ...animationOptions
}: {
    animationDuration: number;
    animationIterationCount?: number;
    animationStartingDirection?: RendererAnimationStartingDirection;
    maximum: number;
    minimum: number;
    numberSubject: Subject<number>;
}): Renderer {
    return new Renderer({
        ...animationOptions,
        computeNextRenderables({ currentAnimationPercentage }) {
            const newNumber =
                currentAnimationPercentage * (maximum - minimum) + minimum;

            return [() => numberSubject.set(newNumber)];
        },
    });
}

export { createNumberTransitionRenderer };
