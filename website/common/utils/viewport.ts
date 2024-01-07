type Viewport = {
    devicePixelRatio: number;
    height: number;
    width: number;
};

function createViewport(): Viewport {
    if (import.meta.env.SSR) {
        return { devicePixelRatio: 1, width: 0, height: 0 };
    }

    return {
        devicePixelRatio: window.devicePixelRatio,
        width: window.innerWidth,
        height: window.innerHeight,
    };
}

export type { Viewport };
export { createViewport };
