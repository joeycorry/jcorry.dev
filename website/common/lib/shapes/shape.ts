import type { RenderableObject } from '~/common/lib/renderable';
import { getClampedFloat } from '~/common/utils/bounded';

export type ShapeConstructorParameter = {
    canvasContext: CanvasRenderingContext2D;
    fillStyle?: string;
    lineWidth?: number;
    strokeStyle?: string;
};

export abstract class Shape implements RenderableObject {
    protected _canvasContext: CanvasRenderingContext2D;

    #fillStyle?: string;
    #lineWidth?: number;
    #strokeStyle?: string;

    public constructor(parameter: ShapeConstructorParameter) {
        this._canvasContext = parameter.canvasContext;
        this.#fillStyle = parameter.fillStyle;
        this.#lineWidth =
            parameter.lineWidth &&
            getClampedFloat({
                minimum: Number.EPSILON,
                value: parameter.lineWidth,
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
