import type { MutableRefObject } from 'react';

import type { RenderableObject } from '~/common/lib/renderable';
import { getValueFromMutableRefOrRaw } from '~/common/utils/react';

export type ShapeConstructorParameter = {
    canvasContext: CanvasRenderingContext2D;
    fillStyle?: string | MutableRefObject<string>;
    lineWidth?: number | MutableRefObject<number>;
    strokeStyle?: string | MutableRefObject<string>;
};

export abstract class Shape implements RenderableObject {
    protected _canvasContext: CanvasRenderingContext2D;

    #fillStyle?: string | MutableRefObject<string>;
    #lineWidth?: number | MutableRefObject<number>;
    #strokeStyle?: string | MutableRefObject<string>;

    public constructor(parameter: ShapeConstructorParameter) {
        this._canvasContext = parameter.canvasContext;
        this.#fillStyle = parameter.fillStyle;
        this.#lineWidth = parameter.lineWidth;
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
            : getValueFromMutableRefOrRaw(this.#fillStyle);
    }

    #getLineWidth() {
        return this.#lineWidth === undefined
            ? null
            : getValueFromMutableRefOrRaw(this.#lineWidth);
    }

    #getStrokeStyle() {
        return this.#strokeStyle === undefined
            ? null
            : getValueFromMutableRefOrRaw(this.#strokeStyle);
    }
}
