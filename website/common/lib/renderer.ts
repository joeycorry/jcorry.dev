import { getClampedNumber } from '~/common/utils/bounded';
import type {
    RendererAnimationIterationCount,
    RendererOptions,
    RendererStartingAnimationDirection,
} from '~/common/utils/renderer';

import type { Renderable } from './renderable';

type GetNextRenderables = (elapsedDurationPercentage: number) => Renderable[];

export class Renderer {
    #animationDirection: 'forward' | 'backward';
    #animationDuration: number;
    #elapsedAnimationTime: number;
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
        this.#animationDirection =
            this.#startingAnimationDirection === 'forward' ||
            this.#startingAnimationDirection === 'alternate'
                ? 'forward'
                : 'backward';
        const animationStartingPercentage = getClampedNumber({
            minimum: 0,
            maximum: 1,
            value:
                options?.animation?.startingPercentage ??
                (this.#animationDirection === 'forward' ? 0 : 1),
        });
        this.#animationDuration = getClampedNumber({
            minimum: 0,
            value: options?.animation?.duration ?? 0,
        });
        this.#elapsedAnimationTime =
            animationStartingPercentage * this.#animationDuration;
        this.#remainingAnimationIterationCount =
            options?.animation?.iterationCount ?? 1;
    }

    public isFinished() {
        return this.#remainingAnimationIterationCount === 0;
    }

    public onBeforeFrameRender() {
        for (const renderable of this.#lastRenderables) {
            renderable.onBeforeFrameRender();
        }
    }

    public render(timestamp: number) {
        const timeDelta = this.#getTimeDelta(timestamp);
        this.#elapsedAnimationTime +=
            this.#animationDirection === 'forward' ? timeDelta : -timeDelta;
        const nextRenderables = this.#getNextRenderables(
            this.#getElapsedDurationPercentage()
        );

        for (const renderable of nextRenderables) {
            renderable.render();
        }

        this.#lastRenderables = nextRenderables;
        this.#lastTimestamp = timestamp;

        if (this.#hasFinishedCurrentIteration()) {
            if (this.#remainingAnimationIterationCount !== 'infinite') {
                this.#remainingAnimationIterationCount -= 1;
            }

            if (
                this.#startingAnimationDirection === 'alternate' ||
                this.#startingAnimationDirection === 'alternate-reverse'
            ) {
                this.toggleAnimationDirection();
            }
        }
    }

    public toggleAnimationDirection() {
        this.#animationDirection =
            this.#animationDirection === 'forward' ? 'backward' : 'forward';
    }

    #getElapsedDurationPercentage() {
        if (this.#animationDuration === 0) {
            return 1;
        }

        return getClampedNumber({
            maximum: 1,
            value: this.#elapsedAnimationTime / this.#animationDuration,
        });
    }

    #getTimeDelta(timestamp: number) {
        return this.#lastTimestamp === undefined
            ? 0
            : timestamp - this.#lastTimestamp;
    }

    #hasFinishedCurrentIteration() {
        return this.#animationDirection === 'forward'
            ? this.#animationDuration <= this.#elapsedAnimationTime
            : this.#elapsedAnimationTime <= 0;
    }
}
