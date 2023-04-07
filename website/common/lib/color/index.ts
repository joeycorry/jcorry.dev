export default interface Color {
    darker(percentage?: number): Color;
    lighter(percentage?: number): Color;
    toString(): string;
    withAlpha(alpha: number): Color;
}
