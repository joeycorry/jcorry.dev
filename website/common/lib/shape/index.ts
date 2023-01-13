import * as NumberUtils from 'common/utils/number';

export type ShapeConstructorParameter = {
    fillStyle?: string;
    lineWidth?: number;
    strokeStyle?: string;
};

export default abstract class Shape {
    protected fillStyle?: string;
    protected lineWidth?: number;
    protected strokeStyle?: string;

    public constructor(parameter?: ShapeConstructorParameter) {
        this.fillStyle = parameter?.fillStyle;
        this.lineWidth =
            parameter?.lineWidth &&
            NumberUtils.clamp({
                minimum: Number.MIN_VALUE,
                value: parameter?.lineWidth,
            });
        this.strokeStyle = parameter?.strokeStyle;
    }

    public render(context: CanvasRenderingContext2D) {
        context.save();
        this.setBaseContextAttributes(context);
        this._performRender(context);
        context.restore();
    }

    protected abstract _performRender(context: CanvasRenderingContext2D): void;

    private setBaseContextAttributes(context: CanvasRenderingContext2D) {
        if (this.fillStyle !== undefined) {
            context.fillStyle = this.fillStyle;
        }

        if (this.lineWidth !== undefined) {
            context.lineWidth = this.lineWidth;
        }

        if (this.strokeStyle !== undefined) {
            context.strokeStyle = this.strokeStyle;
        }
    }
}
