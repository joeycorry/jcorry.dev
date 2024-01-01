import type { HslColor } from './hslColor';
import type { RgbColor } from './rgbColor';

export interface Color<This extends Color = HslColor | RgbColor> {
    darken(rawPercentage: number): This;
    desaturate(rawPercentage: number): This;
    interpolate<OtherColor extends Color>(
        otherColor: OtherColor,
        rawPercentage: number,
    ): This;
    lighten(rawPercentage: number): This;
    saturate(rawPercentage: number): This;
    toRgbColor(): RgbColor;
    toHslColor(): HslColor;
    toString(): string;
}
