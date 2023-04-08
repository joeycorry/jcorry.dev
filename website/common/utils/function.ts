const defaultDelayMilliseconds = 50;

export function debounceFunction<T extends unknown[]>(
    func: (...args: T) => void,
    options?: { milliseconds?: number }
) {
    const { milliseconds = defaultDelayMilliseconds } = options || {};
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
    const { milliseconds = defaultDelayMilliseconds } = options || {};
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
