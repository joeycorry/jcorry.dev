import { Renderer } from '~/common/lib/renderer';

type RendererAnimationMountingDirection = 'alternate' | 'alternate-reverse';

type RendererAnimationProgressingDirection = 'backward' | 'forward';

type RendererAnimationStartingDirection =
    | RendererAnimationMountingDirection
    | RendererAnimationProgressingDirection;

type RendererCleanupCallback = () => void;

function createCompositeRenderer({
    animationIterationCount,
    onCleanup,
    renderersByStartingTimeEntries,
}: {
    animationIterationCount?: number;
    onCleanup?: RendererCleanupCallback;
    renderersByStartingTimeEntries: Iterable<[number, Renderer]>;
}): Renderer {
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

    return new Renderer({
        animationDuration: compositeRendererTotalDuration,
        animationIterationCount,
        computeNextRenderables({
            totalElapsedTime: compositeRendererTotalElapsedTime,
        }) {
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
                let animationPercentage =
                    totalElapsedTime / animationDuration -
                    elapsedAnimationIterationCount;

                while (animationPercentage > 1) {
                    animationPercentage--;

                    renderer.finishIteration();
                }

                renderer.setAnimationPercentage(animationPercentage);
                currentlyAnimatingRenderers.push(renderer);
            }

            return currentlyAnimatingRenderers;
        },
        onCleanup,
    });
}

export type {
    RendererAnimationMountingDirection,
    RendererAnimationProgressingDirection,
    RendererAnimationStartingDirection,
    RendererCleanupCallback,
};
export { createCompositeRenderer };
