export type RenderableFunction = () => void;

export type RenderableObject = {
    onBeforeFrameRender(): void;
    render: RenderableFunction;
};

export type Renderable = RenderableFunction | RenderableObject;
