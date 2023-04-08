import { useEffect } from 'react';

import { getRendererManager } from '~/common/lib/rendererManager';

export function useRendererManagerEffects() {
    const rendererManager = getRendererManager();

    useEffect(() => {
        rendererManager.startAnimation();
    }, [rendererManager]);
}
