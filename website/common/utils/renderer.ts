import { Renderer } from '~/common/lib/renderer';

export type RendererAnimationIterationCount = number;

export type RendererStartingAnimationDirection =
    | 'alternate'
    | 'alternate-reverse'
    | 'backward'
    | 'forward';

export type RendererOptions = {
    animationDuration?: number;
    animationIterationCount?: RendererAnimationIterationCount;
    animationStartingDirection?: RendererStartingAnimationDirection;
};

type CreateCompositeRendererParameter = Pick<
    RendererOptions,
    'animationIterationCount'
> & {
    renderersByStartingTime: Map<number, Renderer>;
};

export function createCompositeRenderer({
    renderersByStartingTime,
    ...rendererOptions
}: CreateCompositeRendererParameter) {
    const compositeRendererTotalDuration = [
        ...renderersByStartingTime.values(),
    ].reduce(
        (compositeRendererTotalDuration_, renderer) =>
            compositeRendererTotalDuration_ + renderer.getTotalDuration(),
        0
    );

    return new Renderer(
        ({ totalElapsedTime: compositeRendererTotalElapsedTime }) => {
            const currentlyAnimatingRenderers: Renderer[] = [];

            for (const [startingTime, renderer] of renderersByStartingTime) {
                if (
                    compositeRendererTotalElapsedTime < startingTime ||
                    startingTime + renderer.getTotalDuration() <
                        compositeRendererTotalElapsedTime
                ) {
                    continue;
                }

                const elapsedAnimationIterationCount =
                    renderer.getElapsedAnimationIterationCount();
                const animationDuration = renderer.getAnimationDuration();
                const totalElapsedTime =
                    compositeRendererTotalElapsedTime - startingTime;
                let rawAnimationPercentage =
                    totalElapsedTime / animationDuration -
                    elapsedAnimationIterationCount;

                while (rawAnimationPercentage >= 1) {
                    rawAnimationPercentage--;

                    renderer.onIterationFinish();
                }

                renderer.setAnimationPercentage(rawAnimationPercentage);
                currentlyAnimatingRenderers.push(renderer);
            }

            return currentlyAnimatingRenderers;
        },
        {
            ...rendererOptions,
            animationDuration: compositeRendererTotalDuration,
        }
    );
}
