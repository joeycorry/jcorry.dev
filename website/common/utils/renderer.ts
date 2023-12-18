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
    renderersByStartingTimeEntries: Iterable<[number, Renderer]>;
};

export function createCompositeRenderer({
    renderersByStartingTimeEntries,
    ...rendererOptions
}: CreateCompositeRendererParameter) {
    const compositeRendererTotalDuration = Array.from(
        renderersByStartingTimeEntries,
    ).reduce(
        (compositeRendererTotalDuration_, [, renderer]) =>
            compositeRendererTotalDuration_ + renderer.getTotalDuration(),
        0,
    );

    return new Renderer(
        ({ totalElapsedTime: compositeRendererTotalElapsedTime }) => {
            const currentlyAnimatingRenderers: Renderer[] = [];

            for (const [
                startingTime,
                renderer,
            ] of renderersByStartingTimeEntries) {
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
        },
    );
}
