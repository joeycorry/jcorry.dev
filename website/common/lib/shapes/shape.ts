import type { Point } from '~/common/lib/point';
import type { RenderableObject } from '~/common/lib/renderable';
import type { ValueOrMutableRef } from '~/common/utils/react';
import { getValueFromValueOrMutableRef } from '~/common/utils/react';

export abstract class Shape implements RenderableObject {
    protected _canvasContext: CanvasRenderingContext2D;
    protected _lastPath: Path2D | null;

    #fillStyle?: ValueOrMutableRef<string>;
    #lineWidth?: ValueOrMutableRef<number>;
    #strokeStyle?: ValueOrMutableRef<string>;

    public constructor(parameter: {
        canvasContext: CanvasRenderingContext2D;
        fillStyle?: ValueOrMutableRef<string>;
        lineWidth?: ValueOrMutableRef<number>;
        strokeStyle?: ValueOrMutableRef<string>;
    }) {
        this._canvasContext = parameter.canvasContext;
        this._lastPath = null;
        this.#fillStyle = parameter.fillStyle;
        this.#lineWidth = parameter.lineWidth;
        this.#strokeStyle = parameter.strokeStyle;
    }

    public onBeforeFrameRender() {
        const { width, height } = this._canvasContext.canvas;

        this._canvasContext.clearRect(0, 0, width, height);
    }

    public pointIsWithin(candidatePoint: Point) {
        return this._lastPath !== null
            ? this._canvasContext.isPointInPath(
                  this._lastPath,
                  candidatePoint.x,
                  candidatePoint.y,
              )
            : false;
    }

    public render() {
        this._lastPath = this._calculateNextPath();

        this._canvasContext.save();
        this.#setBaseContextAttributes();
        this._canvasContext.fill(this._lastPath);
        this._canvasContext.stroke(this._lastPath);
        this._canvasContext.restore();
    }

    protected abstract _calculateNextPath(): Path2D;

    #setBaseContextAttributes() {
        const fillStyle = this.#getFillStyle();
        const lineWidth = this.#getLineWidth();
        const strokeStyle = this.#getStrokeStyle();

        if (fillStyle !== null) {
            this._canvasContext.fillStyle = fillStyle;
        }

        if (lineWidth !== null) {
            this._canvasContext.lineWidth = lineWidth;
        }

        if (strokeStyle !== null) {
            this._canvasContext.strokeStyle = strokeStyle;
        }
    }

    #getFillStyle() {
        return this.#fillStyle === undefined
            ? null
            : getValueFromValueOrMutableRef(this.#fillStyle);
    }

    #getLineWidth() {
        return this.#lineWidth === undefined
            ? null
            : getValueFromValueOrMutableRef(this.#lineWidth);
    }

    #getStrokeStyle() {
        return this.#strokeStyle === undefined
            ? null
            : getValueFromValueOrMutableRef(this.#strokeStyle);
    }
}
