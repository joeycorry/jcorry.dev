import type { UnregisterRendererCallback } from '~/common/utils/rendererManager';

import type { Renderer } from './renderer';

const isConstructingRenderingManagerSymbol = Symbol(
    'isConstructingRenderingManager',
);

let maybeRendererManager: RendererManager | undefined;

class RendererManager {
    #animationFrameRequestId?: number;
    #isAnimating = false;
    #renderers: Renderer[] = [];

    public constructor(
        constructorSymbol: typeof isConstructingRenderingManagerSymbol,
    ) {
        if (constructorSymbol !== isConstructingRenderingManagerSymbol) {
            throw new Error(
                `Instances of \`${RendererManager.name}\` can only be constructed indirectly via \`getRendererManger()\`.`,
            );
        }
    }

    public isAnimating() {
        return this.#isAnimating;
    }

    public registerRenderer(renderer: Renderer): UnregisterRendererCallback {
        this.#renderers.push(renderer);

        return () => this.#unregisterRenderer(renderer);
    }

    public startAnimation() {
        if (this.#isAnimating) {
            return;
        }

        this.#isAnimating = true;
        this.#animationFrameRequestId = window.requestAnimationFrame(
            this.#stepAnimation,
        );
    }

    public stopAnimation() {
        if (!this.#isAnimating) {
            return;
        }

        if (this.#animationFrameRequestId) {
            window.cancelAnimationFrame(this.#animationFrameRequestId);
        }

        this.#onBeforeFrameRender();

        this.#isAnimating = false;
    }

    #onBeforeFrameRender() {
        for (const renderer of this.#renderers) {
            renderer.onBeforeFrameRender();
        }
    }

    #removeFinishedRenderers() {
        const newRenderers = [];

        for (const renderer of this.#renderers) {
            if (renderer.hasFinished()) {
                this.#unregisterRenderer(renderer);

                continue;
            }

            newRenderers.push(renderer);
        }

        this.#renderers = newRenderers;
    }

    #renderFrame(timestamp: number) {
        for (const renderer of this.#renderers) {
            renderer.setTimestamp(timestamp);
            renderer.render();
        }
    }

    #stepAnimation = (timestamp: number) => {
        if (!this.#isAnimating) {
            return;
        }

        this.#onBeforeFrameRender();
        this.#renderFrame(timestamp);
        this.#removeFinishedRenderers();

        this.#animationFrameRequestId = window.requestAnimationFrame(
            this.#stepAnimation,
        );
    };

    #unregisterRenderer(renderer: Renderer) {
        if (
            this.#renderers.findIndex(renderer_ => renderer === renderer_) ===
            -1
        ) {
            return;
        }

        this.#renderers = this.#renderers.filter(
            renderer_ => renderer !== renderer_,
        );
    }
}

function getRendererManager(): RendererManager {
    maybeRendererManager ??= new RendererManager(
        isConstructingRenderingManagerSymbol,
    );

    return maybeRendererManager;
}

export { getRendererManager };
