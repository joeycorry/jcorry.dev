import type { HslColor } from './hslColor';
import type { RgbColor } from './rgbColor';

type DerivedColor = HslColor | RgbColor;

export interface Color<This extends Color = DerivedColor> {
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
