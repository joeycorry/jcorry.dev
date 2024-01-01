import { Renderer } from '~/common/lib/renderer';

export type RendererAnimationProgressingDirection = 'backward' | 'forward';

export type RendererAnimationMountingDirection =
    | 'alternate'
    | 'alternate-reverse';

export type RendererAnimationStartingDirection =
    | RendererAnimationMountingDirection
    | RendererAnimationProgressingDirection;

export function createCompositeRenderer({
    animationIterationCount,
    renderersByStartingTimeEntries,
}: {
    animationIterationCount?: number;
    renderersByStartingTimeEntries: Iterable<[number, Renderer]>;
}) {
    const compositeRendererTotalDuration = Array.from(
        renderersByStartingTimeEntries,
    ).reduce(
        (compositeRendererTotalDuration_, [startingTime, renderer]) =>
            Math.max(
                compositeRendererTotalDuration_,
                startingTime + renderer.getTotalDuration(),
            ),
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

                while (rawAnimationPercentage > 1) {
                    rawAnimationPercentage--;

                    renderer.onIterationFinish();
                }

                renderer.setAnimationPercentage(rawAnimationPercentage);
                currentlyAnimatingRenderers.push(renderer);
            }

            return currentlyAnimatingRenderers;
        },
        {
            animationDuration: compositeRendererTotalDuration,
            animationIterationCount,
        },
    );
}
