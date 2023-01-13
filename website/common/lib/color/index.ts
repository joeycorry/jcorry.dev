export default abstract class Color {
    abstract darker(percentage?: number): Color;
    abstract lighter(percentage?: number): Color;
    abstract toString(): string;
    abstract withAlpha(alpha: number): Color;
}
