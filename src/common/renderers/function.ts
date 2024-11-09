import { Renderer } from '~/common/lib/renderer';

function createNoopRenderer(): Renderer {
    return new Renderer({
        animationDuration: 0,
        computeNextRenderables() {
            return [];
        },
    });
}

export { createNoopRenderer };
