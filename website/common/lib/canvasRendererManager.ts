import type CanvasRenderer from './canvasRenderer';

const canvasRendererManagerConstructorSymbol = Symbol();
const canvasRendererManagersByCanvasElement = new WeakMap<
    HTMLCanvasElement,
    CanvasRendererManager
>();

export default class CanvasRendererManager {
    private _animationFrameRequestId?: number;
    private _isRunning = false;
    private _lastTimestampByRenderer = new WeakMap<CanvasRenderer, number>();
    private _renderers = [] as CanvasRenderer[];

    public static getForCanvasElement(canvasElement: HTMLCanvasElement) {
        if (!canvasRendererManagersByCanvasElement.has(canvasElement)) {
            canvasRendererManagersByCanvasElement.set(
                canvasElement,
                new CanvasRendererManager(
                    canvasRendererManagerConstructorSymbol,
                    canvasElement
                )
            );
        }

        return canvasRendererManagersByCanvasElement.get(canvasElement)!;
    }

    public addRenderer(renderer: CanvasRenderer) {
        this._renderers.push(renderer);
    }

    public finishRenderer(renderer: CanvasRenderer) {
        if (
            this._renderers.findIndex(renderer_ => renderer === renderer_) ===
            -1
        ) {
            return;
        }

        const previousRenderers = this._renderers;
        this._renderers = previousRenderers.filter(
            renderer_ => renderer !== renderer_
        );

        if (previousRenderers.length === this._renderers.length) {
            return;
        }

        renderer.onFinish();
    }

    public onCanvasElementMount() {
        this.startAnimation();
    }

    public onCanvasElementUnmount(canvasElement: HTMLCanvasElement) {
        this.stopAnimation();

        this._renderers = [];

        if (canvasRendererManagersByCanvasElement.has(canvasElement)) {
            canvasRendererManagersByCanvasElement.delete(canvasElement);
        }
    }

    public startAnimation() {
        if (this._isRunning) {
            return;
        }

        this._isRunning = true;
        this._animationFrameRequestId = window.requestAnimationFrame(
            timestamp => this.stepAnimation(timestamp)
        );
    }

    public stopAnimation() {
        if (!this._isRunning) {
            return;
        }

        if (this._animationFrameRequestId) {
            window.cancelAnimationFrame(this._animationFrameRequestId);
        }

        this.clearFrame();

        this._isRunning = false;
    }

    public toggleIsRunning() {
        this._isRunning = !this._isRunning;
        this._lastTimestampByRenderer = new WeakMap();

        if (this._renderers.length > 0 && this._isRunning) {
            this._animationFrameRequestId = window.requestAnimationFrame(
                timestamp => this.stepAnimation(timestamp)
            );
        }
    }

    public toggleAnimationDirection() {
        for (const renderer of this._renderers) {
            renderer.toggleAnimationDirection();
        }
    }

    private constructor(
        constructorSymbol: typeof canvasRendererManagerConstructorSymbol,
        private _canvasElement: HTMLCanvasElement
    ) {
        if (constructorSymbol !== canvasRendererManagerConstructorSymbol) {
            throw new Error(
                '`CanvasRendererManager` instances can only be constructed indirectly via `CanvasRendererManager::getForCanvasContext(canvasContext)`'
            );
        }
    }

    private clearFrame() {
        const canvasContext = this.getCanvasContext();

        canvasContext.clearRect(
            0,
            0,
            this._canvasElement.width,
            this._canvasElement.height
        );
    }

    private deleteFinishedRenderers() {
        const newRenderers = [];

        for (const renderer of this._renderers) {
            if (renderer.isFinished()) {
                renderer.onFinish();

                continue;
            }

            newRenderers.push(renderer);
        }

        this._renderers = newRenderers;
    }

    private getCanvasContext() {
        return this._canvasElement.getContext('2d')!;
    }

    private renderFrame(timestamp: number) {
        for (const renderer of this._renderers) {
            const timeDelta =
                timestamp -
                (this._lastTimestampByRenderer.get(renderer) || timestamp);
            this._lastTimestampByRenderer.set(renderer, timestamp);

            renderer.render({
                canvasContext: this.getCanvasContext(),
                timeDelta,
            });
        }
    }

    private stepAnimation(timestamp: number) {
        if (!this._isRunning) {
            return;
        }

        this.clearFrame();
        this.renderFrame(timestamp);
        this.deleteFinishedRenderers();

        this._animationFrameRequestId = window.requestAnimationFrame(
            timestamp => this.stepAnimation(timestamp)
        );
    }
}
