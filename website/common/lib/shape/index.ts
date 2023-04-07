import Renderable from '~/common/lib/renderable';
import * as NumberUtils from '~/common/utils/number';

export type ShapeConstructorParameter = {
    canvasContext: CanvasRenderingContext2D;
    fillStyle?: string;
    lineWidth?: number;
    strokeStyle?: string;
};

export default abstract class Shape implements Renderable {
    protected _canvasContext: CanvasRenderingContext2D;

    #fillStyle?: string;
    #lineWidth?: number;
    #strokeStyle?: string;

    public constructor(parameter: ShapeConstructorParameter) {
        this._canvasContext = parameter.canvasContext;
        this.#fillStyle = parameter.fillStyle;
        this.#lineWidth =
            parameter.lineWidth &&
            NumberUtils.clamp({
                minimum: Number.MIN_VALUE,
                value: parameter?.lineWidth,
            });
        this.#strokeStyle = parameter.strokeStyle;
    }

    public onBeforeFrameRender() {
        const { width, height } = this._canvasContext.canvas;

        this._canvasContext.clearRect(0, 0, width, height);
    }

    public render() {
        this._canvasContext.save();
        this.#setBaseContextAttributes();
        this._performRender();
        this._canvasContext.restore();
    }

    protected abstract _performRender(): void;

    #setBaseContextAttributes() {
        if (this.#fillStyle !== undefined) {
            this._canvasContext.fillStyle = this.#fillStyle;
        }

        if (this.#lineWidth !== undefined) {
            this._canvasContext.lineWidth = this.#lineWidth;
        }

        if (this.#strokeStyle !== undefined) {
            this._canvasContext.strokeStyle = this.#strokeStyle;
        }
    }
}
