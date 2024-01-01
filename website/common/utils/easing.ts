import cubicBezier from 'bezier-easing';

import { Point } from '~/common/lib/point';

import { getClampedPercentage } from './bounded';

type EasingFunction = (rawPercentage: number) => number;

const cubicBezierFunctionsByKey = new Map<string, EasingFunction>();

function getCubicBezierFunction(point1: Point, point2: Point): EasingFunction {
    const key = `${point1}, ${point2}`;

    if (!cubicBezierFunctionsByKey.has(key)) {
        cubicBezierFunctionsByKey.set(key, (rawPercentage: number) =>
            cubicBezier(
                point1.x,
                point1.y,
                point2.x,
                point2.y,
            )(getClampedPercentage(rawPercentage)),
        );
    }

    return cubicBezierFunctionsByKey.get(key)!;
}

function easeInQuint(rawPercentage: number): number {
    return getCubicBezierFunction(
        new Point(0.64, 0),
        new Point(0.78, 0),
    )(rawPercentage);
}

function easeLinear(percentage: number): number {
    return getClampedPercentage(percentage);
}

function easeOutQuint(rawPercentage: number): number {
    return getCubicBezierFunction(
        new Point(0.22, 1),
        new Point(0.36, 1),
    )(rawPercentage);
}

export type { EasingFunction };
export { easeInQuint, easeLinear, easeOutQuint };
