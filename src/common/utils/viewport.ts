type Viewport = {
    devicePixelRatio: number;
    height: number;
    physicalHeight: number;
    physicalWidth: number;
    width: number;
};

function createViewport(): Viewport {
    if (import.meta.env.SSR) {
        return {
            devicePixelRatio: 1,
            height: 0,
            physicalHeight: 0,
            physicalWidth: 0,
            width: 0,
        };
    }

    const { devicePixelRatio, innerWidth: width, innerHeight: height } = window;
    const physicalHeight = devicePixelRatio * height;
    const physicalWidth = devicePixelRatio * width;

    return {
        devicePixelRatio,
        height,
        physicalHeight,
        physicalWidth,
        width,
    };
}

export type { Viewport };
export { createViewport };
