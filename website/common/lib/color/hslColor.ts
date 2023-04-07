import * as NumberUtils from '~/common/utils/number';

import type Color from '.';

type HslColorConstructorParameter = {
    alpha?: number;
    hueDegrees: number;
    lightnessPercentage: number;
    saturationPercentage: number;
};

export default class HslColor implements Color {
    #hueDegrees: number;
    #saturationPercentage: number;
    #lightnessPercentage: number;
    #alpha: number;

    public constructor({
        alpha = 1,
        hueDegrees,
        lightnessPercentage,
        saturationPercentage,
    }: HslColorConstructorParameter) {
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

        this.#alpha = alpha;
        this.#hueDegrees = hueDegrees;
        this.#lightnessPercentage = lightnessPercentage;
        this.#saturationPercentage = saturationPercentage;
    }

    public darker(percentage = 10) {
        return new HslColor({
            alpha: this.#alpha,
            hueDegrees: this.#hueDegrees,
            lightnessPercentage: NumberUtils.clamp({
                maximum: 100,
                minimum: 0,
                value: this.#lightnessPercentage * (1 - percentage / 100),
            }),
            saturationPercentage: this.#saturationPercentage,
        });
    }

    public lighter(percentage = 10) {
        return new HslColor({
            alpha: this.#alpha,
            hueDegrees: this.#hueDegrees,
            lightnessPercentage: NumberUtils.clamp({
                maximum: 100,
                minimum: 0,
                value: this.#lightnessPercentage * (1 + percentage / 100),
            }),
            saturationPercentage: this.#saturationPercentage,
        });
    }

    public toString() {
        return `hsla(${this.#hueDegrees}deg, ${this.#saturationPercentage}%, ${
            this.#lightnessPercentage
        }%, ${this.#alpha})`;
    }

    public withAlpha(alpha: number) {
        return new HslColor({
            alpha: NumberUtils.clamp({
                maximum: 1,
                minimum: 0,
                value: alpha,
            }),
            hueDegrees: this.#hueDegrees,
            lightnessPercentage: this.#lightnessPercentage,
            saturationPercentage: this.#saturationPercentage,
        });
    }
}
