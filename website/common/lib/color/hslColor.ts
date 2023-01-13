import * as NumberUtils from 'common/utils/number';

import Color from '.';

export default class HslColor extends Color {
    private _hueDegrees: number;
    private _saturationPercentage: number;
    private _lightnessPercentage: number;
    private _alpha: number;

    public constructor({
        alpha = 1,
        hueDegrees,
        lightnessPercentage,
        saturationPercentage,
    }: {
        alpha?: number;
        hueDegrees: number;
        lightnessPercentage: number;
        saturationPercentage: number;
    }) {
        super();

        if (alpha !== undefined && (alpha < 0 || alpha > 1)) {
            throw new Error(
                'Invalid alpha value. Alpha must be between 0 and 1.'
            );
        }

        if (lightnessPercentage < 0 || lightnessPercentage > 100) {
            throw new Error(
                'Invalid lightness percentage. Lightness must be between 0% and 100%.'
            );
        }

        if (saturationPercentage < 0 || saturationPercentage > 100) {
            throw new Error(
                'Invalid saturation percentage. Saturation must be between 0% and 100%.'
            );
        }

        this._alpha = alpha;
        this._hueDegrees = hueDegrees;
        this._lightnessPercentage = lightnessPercentage;
        this._saturationPercentage = saturationPercentage;
    }

    public darker(percentage = 10) {
        return new HslColor({
            alpha: this._alpha,
            hueDegrees: this._hueDegrees,
            lightnessPercentage: NumberUtils.clamp({
                maximum: 100,
                minimum: 0,
                value: this._lightnessPercentage * (1 - percentage / 100),
            }),
            saturationPercentage: this._saturationPercentage,
        });
    }

    public lighter(percentage = 10) {
        return new HslColor({
            alpha: this._alpha,
            hueDegrees: this._hueDegrees,
            lightnessPercentage: NumberUtils.clamp({
                maximum: 100,
                minimum: 0,
                value: this._lightnessPercentage * (1 + percentage / 100),
            }),
            saturationPercentage: this._saturationPercentage,
        });
    }

    public toString() {
        return `hsla(${this._hueDegrees}deg, ${this._saturationPercentage}%, ${this._lightnessPercentage}%, ${this._alpha})`;
    }

    public withAlpha(alpha: number) {
        return new HslColor({
            alpha: NumberUtils.clamp({
                maximum: 1,
                minimum: 0,
                value: alpha,
            }),
            hueDegrees: this._hueDegrees,
            lightnessPercentage: this._lightnessPercentage,
            saturationPercentage: this._saturationPercentage,
        });
    }
}
