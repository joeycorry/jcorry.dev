import type { getRendererManager } from '~/common/lib/rendererManager';

export type RendererManager = ReturnType<typeof getRendererManager>;

export type UnregisterRendererCallback = () => void;
