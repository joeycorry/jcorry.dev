import cubicBezier from 'bezier-easing';

import { Point } from '~/common/lib/point';

import { clampPercentage } from './math';

type EasingFunction = (rawPercentage: number) => number;

const cubicBezierFunctionsByKey = new Map<string, EasingFunction>();

function easeLinear(linearPercentage: number): number {
    return clampPercentage(linearPercentage);
}

function easeOutQuint(linearPercentage: number): number {
    return getCubicBezierFunction(
        new Point(0.22, 1),
        new Point(0.36, 1),
    )(linearPercentage);
}

function getCubicBezierFunction(
    firstPoint: Point,
    secondPoint: Point,
): EasingFunction {
    const key = `${firstPoint}, ${secondPoint}`;

    if (!cubicBezierFunctionsByKey.has(key)) {
        cubicBezierFunctionsByKey.set(key, (rawPercentage: number) =>
            cubicBezier(
                firstPoint.x,
                firstPoint.y,
                secondPoint.x,
                secondPoint.y,
            )(clampPercentage(rawPercentage)),
        );
    }

    return cubicBezierFunctionsByKey.get(key)!;
}

export { easeLinear, easeOutQuint };
