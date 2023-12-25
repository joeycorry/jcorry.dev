import { getClampedPercentage } from '~/common/utils/bounded';
import type { RgbChannelOrAlphaName } from '~/common/utils/color';

import type { Color } from './color';
// eslint-disable-next-line import/no-cycle
import { HslColor } from './hslColor';

type RgbColorConstructorParameter = {
    alphaPercentage: number;
    bluePercentage: number;
    greenPercentage: number;
    redPercentage: number;
};

type PrivateInterpolateRgbChannelOrAlphaParameter = {
    otherColor: RgbColor;
    percentage: number;
    rgbChannelOrAlphaName: RgbChannelOrAlphaName;
};

export class RgbColor implements Color<RgbColor> {
    #alphaPercentage: number;
    #bluePercentage: number;
    #greenPercentage: number;
    #redPercentage: number;

    public constructor({
        alphaPercentage,
        bluePercentage,
        greenPercentage,
        redPercentage,
    }: RgbColorConstructorParameter) {
        this.#alphaPercentage = getClampedPercentage(alphaPercentage);
        this.#bluePercentage = getClampedPercentage(bluePercentage);
        this.#greenPercentage = getClampedPercentage(greenPercentage);
        this.#redPercentage = getClampedPercentage(redPercentage);
    }

    public darken(rawPercentage: number) {
        return this.toHslColor().darken(rawPercentage).toRgbColor();
    }

    public desaturate(rawPercentage: number): RgbColor {
        return this.toHslColor().desaturate(rawPercentage).toRgbColor();
    }

    public interpolate<OtherColor extends Color>(
        otherColor: OtherColor,
        rawPercentage: number,
    ): RgbColor {
        const otherRgbColor = otherColor.toRgbColor();
        const partialPrivateInterpolateRgbChannelParameter: Omit<
            PrivateInterpolateRgbChannelOrAlphaParameter,
            'rgbChannelOrAlphaName'
        > = {
            otherColor: otherRgbColor,
            percentage: getClampedPercentage(rawPercentage),
        };

        return new RgbColor({
            alphaPercentage: this.#interpolateRgbChannelOrAlpha({
                ...partialPrivateInterpolateRgbChannelParameter,
                rgbChannelOrAlphaName: 'alpha',
            }),
            bluePercentage: this.#interpolateRgbChannelOrAlpha({
                ...partialPrivateInterpolateRgbChannelParameter,
                rgbChannelOrAlphaName: 'blue',
            }),
            greenPercentage: this.#interpolateRgbChannelOrAlpha({
                ...partialPrivateInterpolateRgbChannelParameter,
                rgbChannelOrAlphaName: 'green',
            }),
            redPercentage: this.#interpolateRgbChannelOrAlpha({
                ...partialPrivateInterpolateRgbChannelParameter,
                rgbChannelOrAlphaName: 'red',
            }),
        });
    }

    public lighten(rawPercentage: number) {
        return this.toHslColor().lighten(rawPercentage).toRgbColor();
    }

    public saturate(rawPercentage: number): RgbColor {
        return this.toHslColor().saturate(rawPercentage).toRgbColor();
    }

    public toHslColor() {
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

    public toRgbColor() {
        return new RgbColor({
            alphaPercentage: this.#alphaPercentage,
            bluePercentage: this.#bluePercentage,
            greenPercentage: this.#greenPercentage,
            redPercentage: this.#redPercentage,
        });
    }

    public toString() {
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

    #getRgbChannelOrAlpha(rgbChannelOrAlphaName: RgbChannelOrAlphaName) {
        if (rgbChannelOrAlphaName === 'alpha') {
            return this.#alphaPercentage;
        } else if (rgbChannelOrAlphaName === 'blue') {
            return this.#bluePercentage;
        } else if (rgbChannelOrAlphaName === 'green') {
            return this.#greenPercentage;
        }

        return this.#redPercentage;
    }

    #interpolateRgbChannelOrAlpha({
        otherColor,
        percentage,
        rgbChannelOrAlphaName,
    }: PrivateInterpolateRgbChannelOrAlphaParameter) {
        const thisColorComponent = this.#getRgbChannelOrAlpha(
            rgbChannelOrAlphaName,
        );
        const otherColorComponent = otherColor.#getRgbChannelOrAlpha(
            rgbChannelOrAlphaName,
        );

        return (
            (otherColorComponent - thisColorComponent) * percentage +
            thisColorComponent
        );
    }
}
