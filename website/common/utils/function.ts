import { getClampedFloat } from './bounded';

const defaultDelayMilliseconds = 50;

export function debounceFunction<T extends unknown[]>(
    func: (...args: T) => void,
    options?: { milliseconds?: number }
) {
    const { milliseconds: rawMilliseconds = defaultDelayMilliseconds } =
        options || {};
    const milliseconds = getClampedFloat({
        minimum: 0,
        value: rawMilliseconds,
    });
    let timeout: number | undefined;

    return (...args: T) => {
        window.clearTimeout(timeout);

        timeout = window.setTimeout(() => {
            func(...args);
        }, milliseconds);
    };
}

export function evaluateFunction<T>(func: () => T) {
    return func();
}

export function throttleFunction<T extends unknown[]>(
    func: (...args: T) => void,
    options?: { milliseconds?: number }
) {
    const { milliseconds: rawMilliseconds = defaultDelayMilliseconds } =
        options || {};
    const milliseconds = getClampedFloat({
        minimum: 0,
        value: rawMilliseconds,
    });
    let throttlePause: boolean | undefined;

    return (...args: T) => {
        if (throttlePause) {
            return;
        }

        throttlePause = true;

        window.setTimeout(() => {
            func(...args);

            throttlePause = false;
        }, milliseconds);
    };
}
