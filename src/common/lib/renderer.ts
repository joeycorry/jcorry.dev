import { evaluateNoop } from '~/common/utils/function';
import { clampFloat, clampInteger, clampPercentage } from '~/common/utils/math';
import type {
    RendererAnimationProgressingDirection,
    RendererAnimationStartingDirection,
    RendererCleanupCallback,
} from '~/common/utils/renderer';

import type { Renderable, RenderableObject } from './renderable';

type CurrentAnimationData = {
    currentAnimationPercentage: number;
    totalElapsedTime: number;
};

type ComputeNextRenderables = (
    currentAnimationData: CurrentAnimationData,
) => Renderable[];

class Renderer implements RenderableObject {
    #animationDuration: number;
    #computeNextRenderables: ComputeNextRenderables;
    #currentAnimationDirection: RendererAnimationProgressingDirection;
    #currentAnimationTime: number;
    #elapsedAnimationIterationCount: number = 0;
    #handleCleanup: RendererCleanupCallback;
    #lastRenderables: Renderable[] = [];
    #lastTimestamp?: number;
    #startingAnimationDirection: RendererAnimationStartingDirection;
    #startingAnimationIterationCount: number;

    public constructor({
        animationDuration,
        animationIterationCount,
        animationStartingDirection,
        computeNextRenderables,
        onCleanup,
    }: {
        animationDuration: number;
        animationIterationCount?: number;
        animationStartingDirection?: RendererAnimationStartingDirection;
        computeNextRenderables: ComputeNextRenderables;
        onCleanup?: RendererCleanupCallback;
    }) {
        this.#computeNextRenderables = computeNextRenderables;
        this.#handleCleanup = onCleanup ?? evaluateNoop;
        this.#startingAnimationDirection =
            animationStartingDirection ?? 'forward';
        this.#currentAnimationDirection =
            this.#startingAnimationDirection === 'forward' ||
            this.#startingAnimationDirection === 'alternate'
                ? 'forward'
                : 'backward';
        this.#animationDuration = clampFloat(animationDuration, {
            minimum: 1,
        });
        this.#currentAnimationTime =
            this.#currentAnimationDirection === 'forward'
                ? 0
                : this.#animationDuration;
        this.#startingAnimationIterationCount = clampInteger(
            animationIterationCount ?? 1,
            {
                minimum: 1,
            },
        );
    }

    public cleanup(): void {
        this.#handleCleanup();
    }

    public clearLastRender(): void {
        for (const renderable of this.#lastRenderables) {
            if ('clearLastRender' in renderable) {
                renderable.clearLastRender();
            }
        }
    }

    public finishIteration(): void {
        this.#elapsedAnimationIterationCount++;

        if (
            this.#startingAnimationDirection === 'alternate' ||
            this.#startingAnimationDirection === 'alternate-reverse'
        ) {
            this.#toggleAnimationDirection();
        }
    }

    public getAnimationDuration(): number {
        return this.#animationDuration;
    }

    public getElapsedAnimationIterationCount(): number {
        return this.#elapsedAnimationIterationCount;
    }

    public getTotalDuration(): number {
        return (
            this.#startingAnimationIterationCount * this.getAnimationDuration()
        );
    }

    public handleUnregistration(): void {
        this.cleanup();
    }

    public hasFinished(): boolean {
        return this.#getCurrentAnimationIterationCount() === 0;
    }

    public render(): void {
        const nextRenderables = this.#computeNextRenderables(
            this.#getCurrentAnimationData(),
        );

        for (const renderable of nextRenderables) {
            if ('render' in renderable) {
                renderable.render();
            } else {
                renderable();
            }
        }

        this.#lastRenderables = nextRenderables;

        if (this.#hasFinishedCurrentIteration()) {
            this.finishIteration();
        }
    }

    public setAnimationPercentage(
        animationPercentage: number,
        {
            shouldConvertPercentageForDirection = true,
        }: {
            shouldConvertPercentageForDirection?: boolean;
        } = {},
    ): void {
        const unconvertedPercentage = clampPercentage(animationPercentage);
        const percentage =
            !shouldConvertPercentageForDirection ||
            this.#currentAnimationDirection === 'forward'
                ? unconvertedPercentage
                : 1 - unconvertedPercentage;
        this.#currentAnimationTime =
            percentage === 0 &&
            this.#animationDuration === Number.POSITIVE_INFINITY
                ? 0
                : percentage * this.#animationDuration;
        this.#lastTimestamp = performance.now();
    }

    public setTimestamp(timestamp: number): void {
        const timeDelta = this.#getTimeDelta(timestamp);
        this.#currentAnimationTime +=
            this.#currentAnimationDirection === 'forward'
                ? timeDelta
                : -timeDelta;
        this.#lastTimestamp = timestamp;
    }

    #getCurrentAnimationData(): CurrentAnimationData {
        return {
            currentAnimationPercentage: this.#getCurrentAnimationPercentage(),
            totalElapsedTime: this.#getTotalElapsedTime(),
        };
    }

    #getCurrentAnimationIterationCount(): number {
        return (
            this.#startingAnimationIterationCount -
            this.#elapsedAnimationIterationCount
        );
    }

    #getCurrentAnimationPercentage(): number {
        return this.#animationDuration === Number.POSITIVE_INFINITY
            ? 0
            : clampPercentage(
                  this.#currentAnimationTime / this.#animationDuration,
              );
    }

    #getTimeDelta(timestamp: number): number {
        return this.#lastTimestamp === undefined
            ? 0
            : timestamp - this.#lastTimestamp;
    }

    #getTotalElapsedTime(): number {
        const elapsedAnimationIterationCount =
            this.getElapsedAnimationIterationCount();
        const elapsedAnimationIterationTime =
            this.#animationDuration === Number.POSITIVE_INFINITY &&
            elapsedAnimationIterationCount === 0
                ? 0
                : elapsedAnimationIterationCount * this.#animationDuration;

        return elapsedAnimationIterationTime + this.#currentAnimationTime;
    }

    #hasFinishedCurrentIteration(): boolean {
        return this.#currentAnimationDirection === 'forward'
            ? this.#animationDuration <= this.#currentAnimationTime
            : this.#currentAnimationTime <= 0;
    }

    #toggleAnimationDirection(): void {
        this.#currentAnimationDirection =
            this.#currentAnimationDirection === 'forward'
                ? 'backward'
                : 'forward';
    }
}

export { Renderer };
