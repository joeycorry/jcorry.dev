import { clampFloat } from './math';

const defaultDelayMilliseconds = 50;

function createDebouncedFunction<T extends unknown[]>({
    callback,
    milliseconds: rawMilliseconds = defaultDelayMilliseconds,
}: {
    callback: (...args: T) => void;
    milliseconds?: number;
}): (...args: T) => void {
    const milliseconds = clampFloat(rawMilliseconds, {
        minimum: 0,
    });
    let timeout: number | undefined;

    return (...args: T) => {
        window.clearTimeout(timeout);

        timeout = window.setTimeout(() => {
            callback(...args);
        }, milliseconds);
    };
}

function createThrottledFunction<T extends unknown[]>({
    callback,
    milliseconds: rawMilliseconds = defaultDelayMilliseconds,
}: {
    callback: (...args: T) => void;
    milliseconds?: number;
}): (...args: T) => void {
    const milliseconds = clampFloat(rawMilliseconds, {
        minimum: 0,
    });
    let throttlePause: boolean | undefined;

    return (...args: T) => {
        if (throttlePause) {
            return;
        }

        throttlePause = true;

        window.setTimeout(() => {
            callback(...args);

            throttlePause = false;
        }, milliseconds);
    };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function evaluateNoop(): void {}

export { createDebouncedFunction, createThrottledFunction, evaluateNoop };
