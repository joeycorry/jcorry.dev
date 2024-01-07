type Renderable = RenderableFunction | RenderableObject;

type RenderableFunction = () => void;

type RenderableObject = {
    clearLastRender(): void;
    render(): void;
};

export type { Renderable, RenderableFunction, RenderableObject };
