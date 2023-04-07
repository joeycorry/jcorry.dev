import RendererManager from 'common/lib/rendererManager';
import { useEffect } from 'react';

export function useEffects() {
    useEffect(() => {
        RendererManager.getSharedInstance().startAnimation();
    }, []);
}
