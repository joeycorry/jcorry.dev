import type { UnregisterRendererCallback } from '~/common/utils/rendererManager';

import type { Renderer } from './renderer';

const _rendererManagerConstructorTokenSymbol = Symbol();

class RendererManager {
    #animationFrameRequestId?: number;
    #isAnimating = false;
    #renderers: Renderer[] = [];

    public constructor(
        constructorToken: typeof _rendererManagerConstructorTokenSymbol,
    ) {
        if (constructorToken !== _rendererManagerConstructorTokenSymbol) {
            throw new Error(
                `An instance of \`${RendererManager.name}\` can only be accessed via \`getRendererManger()\` from '~/common/utils/rendererManager'.`,
            );
        }
    }

    public isAnimating(): boolean {
        return this.#isAnimating;
    }

    public registerRenderer(renderer: Renderer): UnregisterRendererCallback {
        this.#renderers.push(renderer);

        return () => this.#unregisterRenderer(renderer);
    }

    public startAnimation(): void {
        if (this.#isAnimating) {
            return;
        }

        this.#isAnimating = true;
        this.#animationFrameRequestId = window.requestAnimationFrame(
            this.#stepAnimation,
        );
    }

    public stopAnimation(): void {
        if (!this.#isAnimating) {
            return;
        }

        if (this.#animationFrameRequestId) {
            window.cancelAnimationFrame(this.#animationFrameRequestId);
        }

        this.#clearLastRender();

        this.#isAnimating = false;
    }

    #clearLastRender(): void {
        for (const renderer of this.#renderers) {
            renderer.clearLastRender();
        }
    }

    #removeFinishedRenderers(): void {
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

    #renderFrame(timestamp: number): void {
        for (const renderer of this.#renderers) {
            renderer.setTimestamp(timestamp);
            renderer.render();
        }
    }

    #stepAnimation = (timestamp: number): void => {
        if (!this.#isAnimating) {
            return;
        }

        this.#clearLastRender();
        this.#renderFrame(timestamp);
        this.#removeFinishedRenderers();

        this.#animationFrameRequestId = window.requestAnimationFrame(
            this.#stepAnimation,
        );
    };

    #unregisterRenderer(renderer: Renderer): void {
        this.#renderers = this.#renderers.filter(renderer_ => {
            if (renderer !== renderer_) {
                return true;
            }

            renderer.handleUnregistration();

            return false;
        });
    }
}

export { _rendererManagerConstructorTokenSymbol, RendererManager };
