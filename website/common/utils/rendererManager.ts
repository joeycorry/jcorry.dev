import {
    _rendererManagerConstructorTokenSymbol,
    RendererManager,
} from '~/common/lib/rendererManager';

type UnregisterRendererCallback = () => void;

const rendererManager = new RendererManager(
    _rendererManagerConstructorTokenSymbol,
);

function getRendererManager(): RendererManager {
    return rendererManager;
}

export type { UnregisterRendererCallback };
export { getRendererManager };
