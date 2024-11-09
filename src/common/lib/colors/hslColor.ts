import { clampFloat, clampPercentage } from '~/common/utils/math';

import type { Color } from './color';
// eslint-disable-next-line import/no-cycle
import { RgbColor } from './rgbColor';

type RgbChannelName = 'blue' | 'green' | 'red';

class HslColor implements Color<HslColor> {
    #alphaPercentage: number;
    #hueDegrees: number;
    #lightnessPercentage: number;
    #saturationPercentage: number;

    public constructor({
        alphaPercentage = 1,
        hueDegrees,
        lightnessPercentage,
        saturationPercentage,
    }: {
        alphaPercentage?: number;
        hueDegrees: number;
        lightnessPercentage: number;
        saturationPercentage: number;
    }) {
        this.#alphaPercentage = clampPercentage(alphaPercentage);
        this.#hueDegrees = hueDegrees;
        this.#lightnessPercentage = clampPercentage(lightnessPercentage);
        this.#saturationPercentage = clampPercentage(saturationPercentage);
    }

    public toDarkened(darkeningPercentage: number): HslColor {
        const percentage = clampFloat(darkeningPercentage, {
            maximum: 1,
        });

        return new HslColor({
            alphaPercentage: this.#alphaPercentage,
            hueDegrees: this.#hueDegrees,
            lightnessPercentage: clampPercentage(
                this.#lightnessPercentage * (1 - percentage),
            ),
            saturationPercentage: this.#saturationPercentage,
        });
    }

    public toDesaturated(desaturatingPercentage: number): HslColor {
        const percentage = clampFloat(desaturatingPercentage, {
            maximum: 1,
        });

        return new HslColor({
            alphaPercentage: this.#alphaPercentage,
            hueDegrees: this.#hueDegrees,
            lightnessPercentage: this.#lightnessPercentage,
            saturationPercentage: clampPercentage(
                this.#saturationPercentage * (1 - percentage),
            ),
        });
    }

    public toHslColor(): HslColor {
        return new HslColor({
            alphaPercentage: this.#alphaPercentage,
            hueDegrees: this.#hueDegrees,
            lightnessPercentage: this.#lightnessPercentage,
            saturationPercentage: this.#saturationPercentage,
        });
    }

    public toInterpolated<OtherColor extends Color>(
        otherColor: OtherColor,
        interpolatingPercentage: number,
    ): HslColor {
        return this.toRgbColor()
            .toInterpolated(otherColor, interpolatingPercentage)
            .toHslColor();
    }

    public toLightened(lighteningPercentage: number): HslColor {
        const percentage = clampFloat(lighteningPercentage, {
            minimum: -1,
        });

        return new HslColor({
            alphaPercentage: this.#alphaPercentage,
            hueDegrees: this.#hueDegrees,
            lightnessPercentage: clampPercentage(
                this.#lightnessPercentage * (1 + percentage),
            ),
            saturationPercentage: this.#saturationPercentage,
        });
    }

    public toRgbColor(): RgbColor {
        return new RgbColor({
            alphaPercentage: this.#alphaPercentage,
            bluePercentage: this.#getRgbChannel('blue'),
            greenPercentage: this.#getRgbChannel('green'),
            redPercentage: this.#getRgbChannel('red'),
        });
    }

    public toSaturated(saturatingPercentage: number): HslColor {
        const percentage = clampFloat(saturatingPercentage, {
            minimum: -1,
        });

        return new HslColor({
            alphaPercentage: this.#alphaPercentage,
            hueDegrees: this.#hueDegrees,
            lightnessPercentage: this.#lightnessPercentage,
            saturationPercentage: clampPercentage(
                this.#saturationPercentage * (1 + percentage),
            ),
        });
    }

    public toString(): string {
        const formattedHueDegrees = parseFloat(this.#hueDegrees.toFixed(3));
        const formattedSaturationPercentage = parseFloat(
            (this.#saturationPercentage * 100).toFixed(3),
        );
        const formattedLightnessPercentage = parseFloat(
            (this.#lightnessPercentage * 100).toFixed(3),
        );
        const formattedAlphaPercentage = parseFloat(
            this.#alphaPercentage.toFixed(3),
        );

        return `hsl(${formattedHueDegrees}deg ${formattedSaturationPercentage}% ${formattedLightnessPercentage}% / ${formattedAlphaPercentage})`;
    }

    // This method is derived from the alternate algorithm proposed by
    // https://en.wikipedia.org/wiki/HSL_and_HSV#HSL_to_RGB_alternative.
    #getRgbChannel(rgbChannelName: RgbChannelName): number {
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

export { HslColor };
