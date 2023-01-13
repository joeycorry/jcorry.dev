const defaultDelayMilliseconds = 50;

export function debounce<T extends unknown[]>(
    callback: (...args: T) => void,
    options?: { milliseconds?: number }
) {
    const { milliseconds = defaultDelayMilliseconds } = options || {};
    let timeout: number | undefined;

    return (...args: T) => {
        window.clearTimeout(timeout);

        timeout = window.setTimeout(() => {
            callback(...args);
        }, milliseconds);
    };
}

export function evaluate<T>(callback: () => T) {
    return callback();
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function noop() {}

export function throttle<T extends unknown[]>(
    callback: (...args: T) => void,
    options?: { milliseconds?: number }
) {
    const { milliseconds = defaultDelayMilliseconds } = options || {};
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
