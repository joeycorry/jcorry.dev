import type { HslColor } from './hslColor';
import type { RgbColor } from './rgbColor';

interface Color<This extends Color = HslColor | RgbColor> {
    toDarkened(darkeningPercentage: number): This;
    toDesaturated(desaturatingPercentage: number): This;
    toHslColor(): HslColor;
    toInterpolated<OtherColor extends Color>(
        otherColor: OtherColor,
        interpolatingPercentage: number,
    ): This;
    toLightened(lighteningPercentage: number): This;
    toRgbColor(): RgbColor;
    toSaturated(saturatingPercentage: number): This;
    toString(): string;
}

export type { Color };
