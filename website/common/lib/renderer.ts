import {
    getClampedFloat,
    getClampedInteger,
    getClampedPercentage,
} from '~/common/utils/bounded';
import type {
    RendererAnimationIterationCount,
    RendererOptions,
    RendererStartingAnimationDirection,
} from '~/common/utils/renderer';

import type { Renderable, RenderableObject } from './renderable';

type CurrentAnimationData = {
    currentAnimationPercentage: number;
    totalElapsedTime: number;
};

type GetNextRenderables = (
    currentAnimationData: CurrentAnimationData,
) => Renderable[];

type SetAnimationPercentageOptions = {
    shouldConvertPercentageForDirection?: boolean;
};

export class Renderer implements RenderableObject {
    #animationDuration: number;
    #currentAnimationDirection: 'forward' | 'backward';
    #currentAnimationTime: number;
    #elapsedAnimationIterationCount: RendererAnimationIterationCount = 0;
    #getNextRenderables: GetNextRenderables;
    #lastRenderables: Renderable[] = [];
    #lastTimestamp?: number;
    #startingAnimationIterationCount: RendererAnimationIterationCount;
    #startingAnimationDirection: RendererStartingAnimationDirection;

    public constructor(
        getNextRenderables: GetNextRenderables,
        options?: RendererOptions,
    ) {
        this.#getNextRenderables = getNextRenderables;
        this.#startingAnimationDirection =
            options?.animationStartingDirection ?? 'forward';
        this.#currentAnimationDirection =
            this.#startingAnimationDirection === 'forward' ||
            this.#startingAnimationDirection === 'alternate'
                ? 'forward'
                : 'backward';
        this.#animationDuration = getClampedFloat({
            minimum: 1,
            value: options?.animationDuration ?? 400,
        });
        this.#currentAnimationTime =
            this.#currentAnimationDirection === 'forward'
                ? 0
                : this.#animationDuration;
        this.#startingAnimationIterationCount = getClampedInteger({
            minimum: 1,
            value: options?.animationIterationCount ?? 1,
        });
    }

    public onIterationFinish() {
        this.#elapsedAnimationIterationCount++;

        if (
            this.#startingAnimationDirection === 'alternate' ||
            this.#startingAnimationDirection === 'alternate-reverse'
        ) {
            this.#toggleAnimationDirection();
        }
    }

    public getElapsedAnimationIterationCount() {
        return this.#elapsedAnimationIterationCount;
    }

    public getAnimationDuration() {
        return this.#animationDuration;
    }

    public getTotalDuration() {
        return (
            this.#startingAnimationIterationCount * this.getAnimationDuration()
        );
    }

    public hasFinished() {
        return this.#getCurrentAnimationIterationCount() === 0;
    }

    public onBeforeFrameRender() {
        for (const renderable of this.#lastRenderables) {
            if ('onBeforeFrameRender' in renderable) {
                renderable.onBeforeFrameRender();
            }
        }
    }

    public render() {
        const nextRenderables = this.#getNextRenderables(
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
            this.onIterationFinish();
        }
    }

    public setAnimationPercentage(
        rawAnimationPercentage: number,
        {
            shouldConvertPercentageForDirection = true,
        }: SetAnimationPercentageOptions = {},
    ) {
        const unconvertedAnimationPercentage = getClampedPercentage(
            rawAnimationPercentage,
        );
        const animationPercentage =
            !shouldConvertPercentageForDirection ||
            this.#currentAnimationDirection === 'forward'
                ? unconvertedAnimationPercentage
                : 1 - unconvertedAnimationPercentage;
        this.#currentAnimationTime =
            animationPercentage === 0 &&
            this.#animationDuration === Number.POSITIVE_INFINITY
                ? 0
                : animationPercentage * this.#animationDuration;
        this.#lastTimestamp = performance.now();
    }

    public setTimestamp(timestamp: number) {
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

    #getCurrentAnimationPercentage() {
        return this.#animationDuration === Number.POSITIVE_INFINITY
            ? 0
            : getClampedPercentage(
                  this.#currentAnimationTime / this.#animationDuration,
              );
    }

    #getCurrentAnimationIterationCount() {
        return (
            this.#startingAnimationIterationCount -
            this.#elapsedAnimationIterationCount
        );
    }

    #getTimeDelta(timestamp: number) {
        return this.#lastTimestamp === undefined
            ? 0
            : timestamp - this.#lastTimestamp;
    }

    #getTotalElapsedTime() {
        const elapsedAnimationIterationCount =
            this.getElapsedAnimationIterationCount();
        const elapsedAnimationIterationTime =
            this.#animationDuration === Number.POSITIVE_INFINITY &&
            elapsedAnimationIterationCount === 0
                ? 0
                : elapsedAnimationIterationCount * this.#animationDuration;

        return elapsedAnimationIterationTime + this.#currentAnimationTime;
    }

    #hasFinishedCurrentIteration() {
        return this.#currentAnimationDirection === 'forward'
            ? this.#animationDuration <= this.#currentAnimationTime
            : this.#currentAnimationTime <= 0;
    }

    #toggleAnimationDirection() {
        this.#currentAnimationDirection =
            this.#currentAnimationDirection === 'forward'
                ? 'backward'
                : 'forward';
    }
}
