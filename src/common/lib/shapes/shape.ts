import type { RenderableObject } from '~/common/lib/renderable';
import type { ValueOrSubject } from '~/common/utils/subject';
import { getSubjectValue } from '~/common/utils/subject';

abstract class Shape implements RenderableObject {
    protected _canvasContext: CanvasRenderingContext2D;
    protected _lastPath: Path2D | null;

    #fillStyle: string | null;
    #isRendered = false;
    #lineWidth: number | null;
    #strokeStyle: string | null;

    public constructor({
        canvasContext,
        fillStyle: rawFillStyle,
        lineWidth: rawLineWidth,
        strokeStyle: rawStrokeStyle,
    }: {
        canvasContext: CanvasRenderingContext2D;
        fillStyle?: ValueOrSubject<string>;
        lineWidth?: ValueOrSubject<number>;
        strokeStyle?: ValueOrSubject<string>;
    }) {
        this._canvasContext = canvasContext;
        this._lastPath = null;
        this.#fillStyle =
            rawFillStyle === undefined ? null : getSubjectValue(rawFillStyle);
        this.#lineWidth =
            rawLineWidth === undefined ? null : getSubjectValue(rawLineWidth);
        this.#strokeStyle =
            rawStrokeStyle === undefined
                ? null
                : getSubjectValue(rawStrokeStyle);
    }

    public clearLastRender(): void {
        if (!this.#isRendered) {
            return;
        }

        this._canvasContext.reset();

        this.#isRendered = false;
    }

    public render(): void {
        if (this.#isRendered) {
            return;
        }

        this._lastPath = this._computeNextPath();

        this._canvasContext.save();
        this.#synchronizeCanvasContextAttributes();
        this._canvasContext.fill(this._lastPath);
        this._canvasContext.stroke(this._lastPath);
        this._canvasContext.restore();

        this.#isRendered = true;
    }

    #synchronizeCanvasContextAttributes(): void {
        if (this.#fillStyle !== null) {
            this._canvasContext.fillStyle = this.#fillStyle;
        }

        if (this.#lineWidth !== null) {
            this._canvasContext.lineWidth = this.#lineWidth;
        }

        if (this.#strokeStyle !== null) {
            this._canvasContext.strokeStyle = this.#strokeStyle;
        }
    }

    protected abstract _computeNextPath(): Path2D;
}

export { Shape };
