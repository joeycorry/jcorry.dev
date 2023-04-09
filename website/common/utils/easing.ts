export type EasingFunction = (percentage: number) => number;

export function easeOutBounce(percentage: number): number {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (percentage < 1 / d1) {
        return n1 * percentage * percentage;
    } else if (percentage < 2 / d1) {
        return n1 * (percentage -= 1.5 / d1) * percentage + 0.75;
    } else if (percentage < 2.5 / d1) {
        return n1 * (percentage -= 2.25 / d1) * percentage + 0.9375;
    } else {
        return n1 * (percentage -= 2.625 / d1) * percentage + 0.984375;
    }
}

export function easeInOutBounce(percentage: number): number {
    return percentage < 0.5
        ? (1 - easeOutBounce(1 - 2 * percentage)) / 2
        : (1 + easeOutBounce(2 * percentage - 1)) / 2;
}

export function easeInOutCubic(percentage: number): number {
    return percentage < 0.5
        ? 4 * Math.pow(percentage, 3)
        : 1 - Math.pow(-2 * percentage + 2, 3) / 2;
}

export function linear(percentage: number): number {
    return percentage;
}
