import type { Renderer } from './renderer';

const rendererManagerConstructorSymbol = Symbol('renderingManagerConstructor');

class RendererManager {
    #animationFrameRequestId?: number;
    #isRunning = false;
    #renderers: Renderer[] = [];

    public constructor(
        constructorSymbol: typeof rendererManagerConstructorSymbol
    ) {
        if (constructorSymbol !== rendererManagerConstructorSymbol) {
            throw new Error(
                `Instances of \`${RendererManager.name}\` can only be constructed indirectly via \`getRenderingManagerInstance()\`.`
            );
        }
    }

    public addRenderer(renderer: Renderer) {
        this.#renderers.push(renderer);
    }

    public removeRenderer(renderer: Renderer) {
        if (
            this.#renderers.findIndex(renderer_ => renderer === renderer_) ===
            -1
        ) {
            return;
        }

        this.#renderers = this.#renderers.filter(
            renderer_ => renderer !== renderer_
        );
    }

    public startAnimation() {
        if (this.#isRunning) {
            return;
        }

        this.#isRunning = true;
        this.#animationFrameRequestId = window.requestAnimationFrame(
            this.#stepAnimation
        );
    }

    public stopAnimation() {
        if (!this.#isRunning) {
            return;
        }

        if (this.#animationFrameRequestId) {
            window.cancelAnimationFrame(this.#animationFrameRequestId);
        }

        this.#onBeforeFrameRender();

        this.#isRunning = false;
    }

    public toggleAnimationDirection() {
        for (const renderer of this.#renderers) {
            renderer.toggleAnimationDirection();
        }
    }

    #onBeforeFrameRender() {
        for (const renderer of this.#renderers) {
            renderer.onBeforeFrameRender();
        }
    }

    #removeFinishedRenderers() {
        const newRenderers = [];

        for (const renderer of this.#renderers) {
            if (renderer.isFinished()) {
                this.removeRenderer(renderer);

                continue;
            }

            newRenderers.push(renderer);
        }

        this.#renderers = newRenderers;
    }

    #renderFrame(timestamp: number) {
        for (const renderer of this.#renderers) {
            renderer.render(timestamp);
        }
    }

    #stepAnimation = (timestamp: number) => {
        if (!this.#isRunning) {
            return;
        }

        this.#onBeforeFrameRender();
        this.#renderFrame(timestamp);
        this.#removeFinishedRenderers();

        this.#animationFrameRequestId = window.requestAnimationFrame(
            this.#stepAnimation
        );
    };
}

let maybeRendererManager: RendererManager | undefined;

export function getRendererManager(): RendererManager {
    maybeRendererManager ??= new RendererManager(
        rendererManagerConstructorSymbol
    );

    return maybeRendererManager;
}
