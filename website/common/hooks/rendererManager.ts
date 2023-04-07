import { useEffect } from 'react';

import RendererManager from '~/common/lib/rendererManager';

export function useEffects() {
    useEffect(() => {
        RendererManager.getSharedInstance().startAnimation();
    }, []);
}
