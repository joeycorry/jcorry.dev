import { getClampedFloat, getClampedPercentage } from '~/common/utils/bounded';
import type { RgbChannelName } from '~/common/utils/color';

import type { Color } from './color';
// eslint-disable-next-line import/no-cycle
import { RgbColor } from './rgbColor';

type HslColorConstructorParameter = {
    alphaPercentage?: number;
    hueDegrees: number;
    lightnessPercentage: number;
    saturationPercentage: number;
};

export class HslColor implements Color<HslColor> {
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

    public darken(rawPercentage: number) {
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

    public interpolate<OtherColor extends Color>(
        otherColor: OtherColor,
        rawPercentage: number
    ): HslColor {
        return this.toRgbColor()
            .interpolate(otherColor, rawPercentage)
            .toHslColor();
    }

    public lighten(rawPercentage: number): HslColor {
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

    public toHslColor() {
        return new HslColor({
            alphaPercentage: this.#alphaPercentage,
            hueDegrees: this.#hueDegrees,
            lightnessPercentage: this.#lightnessPercentage,
            saturationPercentage: this.#saturationPercentage,
        });
    }

    // This method and `##getRgbChannel` are derived from the alternate algorithm proposed by
    // https://en.wikipedia.org/wiki/HSL_and_HSV#HSL_to_RGB_alternative.
    public toRgbColor() {
        return new RgbColor({
            alphaPercentage: this.#alphaPercentage,
            bluePercentage: this.#getRgbChannel('blue'),
            greenPercentage: this.#getRgbChannel('green'),
            redPercentage: this.#getRgbChannel('red'),
        });
    }

    public toString() {
        return `hsl(${this.#hueDegrees}deg ${
            this.#saturationPercentage * 100
        }% ${this.#lightnessPercentage * 100}% / ${this.#alphaPercentage})`;
    }

    #getRgbChannel(rgbChannelName: RgbChannelName) {
        const hueDegrees = this.#hueDegrees;
        const saturationPercentage = this.#saturationPercentage;
        const lightnessPercentage = this.#lightnessPercentage;
        const a =
            saturationPercentage *
            Math.min(lightnessPercentage, 1 - lightnessPercentage);
        const n =
            rgbChannelName === 'blue' ? 4 : rgbChannelName === 'green' ? 8 : 0;
        const k = (n + hueDegrees / 30) % 12;

        return (
            lightnessPercentage - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
        );
    }
}
