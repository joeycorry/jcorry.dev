export interface Color {
    darker(percentage?: number): Color;
    lighter(percentage?: number): Color;
    toString(): string;
}
