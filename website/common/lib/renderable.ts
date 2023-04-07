export default interface Renderable {
    onBeforeFrameRender(): void;
    render(): void;
}
