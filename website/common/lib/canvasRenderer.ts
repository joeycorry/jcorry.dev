import type * as CanvasRendererUtils from 'common/utils/canvasRenderer';
import * as NumberUtils from 'common/utils/number';

import type Shape from './shape';

export default class CanvasRenderer {
    private _animationDirection: CanvasRendererUtils.AnimationDirection;
    private _animationDuration: number;
    private _elapsedAnimationTime = 0;
    private _onFinish?: () => void;

    public constructor(
        private _getNextShapes: (elapsedDurationPercentage: number) => Shape[],
        options?: CanvasRendererUtils.RendererOptions
    ) {
        this._animationDirection =
            options?.animation?.startingDirection ?? 'forward';
        const animationStartingPercentage = NumberUtils.clamp({
            minimum: 0,
            maximum: 1,
            value:
                options?.animation?.startingPercentage ??
                (this._animationDirection === 'forward' ? 0 : 1),
        });
        this._animationDuration = NumberUtils.clamp({
            minimum: 0,
            value: options?.animation?.duration ?? 0,
        });
        this._elapsedAnimationTime =
            animationStartingPercentage * this._animationDuration;
        this._onFinish = options?.onFinish;
    }

    public isFinished() {
        return this._animationDirection === 'forward'
            ? this._animationDuration <= this._elapsedAnimationTime
            : this._elapsedAnimationTime <= 0;
    }

    public onFinish() {
        if (!this.isFinished()) {
            return;
        }

        if (this._onFinish !== undefined) {
            this._onFinish();
        }
    }

    public render({
        animationDirection = this._animationDirection,
        canvasContext,
        timeDelta,
    }: {
        animationDirection?: CanvasRendererUtils.AnimationDirection;
        canvasContext: CanvasRenderingContext2D;
        timeDelta: number;
    }) {
        this._elapsedAnimationTime +=
            animationDirection === 'forward' ? timeDelta : -timeDelta;

        const nextShapes = this._getNextShapes(
            this._getElapsedDurationPercentage()
        );

        for (const shape of nextShapes) {
            shape.render(canvasContext);
        }
    }

    public toggleAnimationDirection() {
        this._animationDirection =
            this._animationDirection === 'forward' ? 'backward' : 'forward';
    }

    private _getElapsedDurationPercentage() {
        if (this._animationDuration === 0) {
            return 1;
        }

        return NumberUtils.clamp({
            maximum: 1,
            value: this._elapsedAnimationTime / this._animationDuration,
        });
    }
}
