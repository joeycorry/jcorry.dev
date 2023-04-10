import { getClampedFloat, getClampedPercentage } from '~/common/utils/bounded';

import type { Color } from '.';

type HslColorConstructorParameter = {
    alphaPercentage?: number;
    hueDegrees: number;
    lightnessPercentage: number;
    saturationPercentage: number;
};

export class HslColor implements Color {
    #alphaPercentage: number;
    #hueDegrees: number;
    #saturationPercentage: number;
    #lightnessPercentage: number;

    public constructor({
        alphaPercentage = 1,
        hueDegrees,
        lightnessPercentage,
        saturationPercentage,
    }: HslColorConstructorParameter) {
        this.#alphaPercentage = getClampedPercentage(alphaPercentage);
        this.#hueDegrees = hueDegrees;
        this.#lightnessPercentage = getClampedPercentage(lightnessPercentage);
        this.#saturationPercentage = getClampedPercentage(saturationPercentage);
    }

    public darker(rawPercentage = 0.1) {
        const percentage = getClampedFloat({
            maximum: 1,
            value: rawPercentage,
        });

        return new HslColor({
            alphaPercentage: this.#alphaPercentage,
            hueDegrees: this.#hueDegrees,
            lightnessPercentage: getClampedPercentage(
                this.#lightnessPercentage * (1 - percentage)
            ),
            saturationPercentage: this.#saturationPercentage,
        });
    }

    public lighter(rawPercentage = 0.1) {
        const percentage = getClampedFloat({
            minimum: -1,
            value: rawPercentage,
        });

        return new HslColor({
            alphaPercentage: this.#alphaPercentage,
            hueDegrees: this.#hueDegrees,
            lightnessPercentage: getClampedPercentage(
                this.#lightnessPercentage * (1 + percentage)
            ),
            saturationPercentage: this.#saturationPercentage,
        });
    }

    public toString() {
        return `hsla(${this.#hueDegrees}deg, ${
            this.#saturationPercentage * 100
        }%, ${this.#lightnessPercentage * 100}%, ${this.#alphaPercentage})`;
    }
}
