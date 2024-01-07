import { clampPercentage } from '~/common/utils/math';

import type { Color } from './color';
// eslint-disable-next-line import/no-cycle
import { HslColor } from './hslColor';

type RgbChannelOrAlphaName = 'alpha' | 'blue' | 'green' | 'red';

class RgbColor implements Color<RgbColor> {
    #alphaPercentage: number;
    #bluePercentage: number;
    #greenPercentage: number;
    #redPercentage: number;

    public constructor({
        alphaPercentage,
        bluePercentage,
        greenPercentage,
        redPercentage,
    }: {
        alphaPercentage: number;
        bluePercentage: number;
        greenPercentage: number;
        redPercentage: number;
    }) {
        this.#alphaPercentage = clampPercentage(alphaPercentage);
        this.#bluePercentage = clampPercentage(bluePercentage);
        this.#greenPercentage = clampPercentage(greenPercentage);
        this.#redPercentage = clampPercentage(redPercentage);
    }

    public toDarkened(darkeningPercentage: number): RgbColor {
        return this.toHslColor().toDarkened(darkeningPercentage).toRgbColor();
    }

    public toDesaturated(desaturatingPercentage: number): RgbColor {
        return this.toHslColor()
            .toDesaturated(desaturatingPercentage)
            .toRgbColor();
    }

    // This method is derived from the algorithm proposed by
    // https://en.wikipedia.org/wiki/HSL_and_HSV#From_RGB.
    public toHslColor(): HslColor {
        const alphaPercentage = this.#alphaPercentage;
        const redPercentage = this.#redPercentage;
        const greenPercentage = this.#greenPercentage;
        const bluePercentage = this.#bluePercentage;
        const maximumPercentage = Math.max(
            redPercentage,
            greenPercentage,
            bluePercentage,
        );
        const minimumPercentage = Math.min(
            redPercentage,
            greenPercentage,
            bluePercentage,
        );
        const lightnessPercentage = (maximumPercentage + minimumPercentage) / 2;

        if (maximumPercentage === minimumPercentage) {
            return new HslColor({
                alphaPercentage,
                hueDegrees: 0,
                saturationPercentage: 0,
                lightnessPercentage,
            });
        }

        const percentageExtremaDifference =
            maximumPercentage - minimumPercentage;
        const saturationPercentage =
            lightnessPercentage > 0.5
                ? percentageExtremaDifference /
                  (2 - maximumPercentage - minimumPercentage)
                : percentageExtremaDifference /
                  (maximumPercentage + minimumPercentage);
        const unscaledHuePercentage =
            maximumPercentage === redPercentage
                ? (greenPercentage - bluePercentage) /
                      percentageExtremaDifference +
                  (greenPercentage < bluePercentage ? 6 : 0)
                : maximumPercentage === greenPercentage
                  ? (bluePercentage - redPercentage) /
                        percentageExtremaDifference +
                    2
                  : (redPercentage - greenPercentage) /
                        percentageExtremaDifference +
                    4;

        return new HslColor({
            alphaPercentage,
            hueDegrees: 60 * unscaledHuePercentage,
            saturationPercentage,
            lightnessPercentage,
        });
    }

    public toInterpolated<OtherColor extends Color>(
        otherColor: OtherColor,
        interpolatingPercentage: number,
    ): RgbColor {
        const otherRgbColor = otherColor.toRgbColor();

        return new RgbColor({
            alphaPercentage: this.#getInterpolatedRgbChannelOrAlpha({
                interpolatingPercentage,
                otherRgbColor,
                rgbChannelOrAlphaName: 'alpha',
            }),
            bluePercentage: this.#getInterpolatedRgbChannelOrAlpha({
                interpolatingPercentage,
                otherRgbColor,
                rgbChannelOrAlphaName: 'blue',
            }),
            greenPercentage: this.#getInterpolatedRgbChannelOrAlpha({
                interpolatingPercentage,
                otherRgbColor,
                rgbChannelOrAlphaName: 'green',
            }),
            redPercentage: this.#getInterpolatedRgbChannelOrAlpha({
                interpolatingPercentage,
                otherRgbColor,
                rgbChannelOrAlphaName: 'red',
            }),
        });
    }

    public toLightened(rawPercentage: number): RgbColor {
        return this.toHslColor().toLightened(rawPercentage).toRgbColor();
    }

    public toRgbColor(): RgbColor {
        return new RgbColor({
            alphaPercentage: this.#alphaPercentage,
            bluePercentage: this.#bluePercentage,
            greenPercentage: this.#greenPercentage,
            redPercentage: this.#redPercentage,
        });
    }

    public toSaturated(rawPercentage: number): RgbColor {
        return this.toHslColor().toSaturated(rawPercentage).toRgbColor();
    }

    public toString(): string {
        const formattedRedPercentage = parseFloat(
            (this.#redPercentage * 100).toFixed(3),
        );
        const formattedGreenPercentage = parseFloat(
            (this.#greenPercentage * 100).toFixed(3),
        );
        const formattedBluePercentage = parseFloat(
            (this.#bluePercentage * 100).toFixed(3),
        );
        const formattedAlphaPercentage = parseFloat(
            this.#alphaPercentage.toFixed(3),
        );

        return `rgb(${formattedRedPercentage}% ${formattedGreenPercentage}% ${formattedBluePercentage}% / ${formattedAlphaPercentage})`;
    }

    #getInterpolatedRgbChannelOrAlpha({
        interpolatingPercentage,
        otherRgbColor,
        rgbChannelOrAlphaName,
    }: {
        interpolatingPercentage: number;
        otherRgbColor: RgbColor;
        rgbChannelOrAlphaName: RgbChannelOrAlphaName;
    }): number {
        const percentage = clampPercentage(interpolatingPercentage);
        const thisRgbChannelOrAlpha = this.#getRgbChannelOrAlpha(
            rgbChannelOrAlphaName,
        );
        const otherRgbChannelOrAlpha = otherRgbColor.#getRgbChannelOrAlpha(
            rgbChannelOrAlphaName,
        );

        return (
            (otherRgbChannelOrAlpha - thisRgbChannelOrAlpha) * percentage +
            thisRgbChannelOrAlpha
        );
    }

    #getRgbChannelOrAlpha(
        rgbChannelOrAlphaName: RgbChannelOrAlphaName,
    ): number {
        if (rgbChannelOrAlphaName === 'alpha') {
            return this.#alphaPercentage;
        } else if (rgbChannelOrAlphaName === 'blue') {
            return this.#bluePercentage;
        } else if (rgbChannelOrAlphaName === 'green') {
            return this.#greenPercentage;
        }

        return this.#redPercentage;
    }
}

export { RgbColor };
