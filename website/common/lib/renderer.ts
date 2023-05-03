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

type GetNextRenderables = (currentAnimationPercentage: number) => Renderable[];

type SetAnimationPercentageOptions = {
    shouldConvertPercentageForDirection?: boolean;
};

export class Renderer implements RenderableObject {
    #animationDuration: number;
    #currentAnimationDirection: 'forward' | 'backward';
    #currentAnimationTime: number;
    #getNextRenderables: GetNextRenderables;
    #lastRenderables: Renderable[] = [];
    #lastTimestamp?: number;
    #remainingAnimationIterationCount: RendererAnimationIterationCount;
    #startingAnimationDirection: RendererStartingAnimationDirection;

    public constructor(
        getNextRenderables: GetNextRenderables,
        options?: RendererOptions
    ) {
        this.#getNextRenderables = getNextRenderables;
        this.#startingAnimationDirection =
            options?.animation?.startingDirection ?? 'forward';
        this.#currentAnimationDirection =
            this.#startingAnimationDirection === 'forward' ||
            this.#startingAnimationDirection === 'alternate'
                ? 'forward'
                : 'backward';
        this.#animationDuration = getClampedFloat({
            minimum: 1,
            value: options?.animation?.duration ?? 400,
        });
        this.#currentAnimationTime =
            (this.#currentAnimationDirection === 'forward' ? 0 : 1) *
            this.#animationDuration;
        this.#remainingAnimationIterationCount = getClampedInteger({
            minimum: 1,
            value: options?.animation?.iterationCount ?? 1,
        });
    }

    public isFinished() {
        return this.#remainingAnimationIterationCount === 0;
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
            this.#getCurrentAnimationPercentage()
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
            this.#remainingAnimationIterationCount -= 1;

            if (
                this.#startingAnimationDirection === 'alternate' ||
                this.#startingAnimationDirection === 'alternate-reverse'
            ) {
                this.toggleAnimationDirection();
            }
        }
    }

    public setAnimationPercentage(
        rawAnimationPercentage: number,
        {
            shouldConvertPercentageForDirection = true,
        }: SetAnimationPercentageOptions = {}
    ) {
        const animationPercentage = getClampedPercentage(
            rawAnimationPercentage
        );
        this.#currentAnimationTime =
            (!shouldConvertPercentageForDirection ||
            this.#currentAnimationDirection === 'forward'
                ? animationPercentage
                : 1 - animationPercentage) * this.#animationDuration;
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

    public toggleAnimationDirection() {
        this.#currentAnimationDirection =
            this.#currentAnimationDirection === 'forward'
                ? 'backward'
                : 'forward';
    }

    #getCurrentAnimationPercentage() {
        return getClampedPercentage(
            this.#currentAnimationTime / this.#animationDuration
        );
    }

    #getTimeDelta(timestamp: number) {
        return this.#lastTimestamp === undefined
            ? 0
            : timestamp - this.#lastTimestamp;
    }

    #hasFinishedCurrentIteration() {
        return this.#currentAnimationDirection === 'forward'
            ? this.#animationDuration <= this.#currentAnimationTime
            : this.#currentAnimationTime <= 0;
    }
}
