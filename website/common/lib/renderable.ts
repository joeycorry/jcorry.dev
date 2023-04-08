export interface Renderable {
    onBeforeFrameRender(): void;
    render(): void;
}
