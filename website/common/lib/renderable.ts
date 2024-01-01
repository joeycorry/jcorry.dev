type Renderable = RenderableFunction | RenderableObject;

type RenderableFunction = () => void;

type RenderableObject = {
    onBeforeFrameRender(): void;
    render(): void;
};

export type { Renderable, RenderableFunction, RenderableObject };
