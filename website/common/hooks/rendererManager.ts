import { useCallback, useEffect, useRef } from 'react';

import { getRendererManager } from '~/common/lib/rendererManager';
import type { RendererManager } from '~/common/utils/rendererManager';

function useVisibilityChangeHandler(rendererManager: RendererManager) {
    const wasAnimatingWhenVisible = useRef<boolean | null>(null);

    return useCallback(() => {
        if (
            window.document.visibilityState === 'hidden' &&
            rendererManager.isAnimating()
        ) {
            wasAnimatingWhenVisible.current = true;

            rendererManager.stopAnimation();
        } else if (
            window.document.visibilityState === 'visible' &&
            wasAnimatingWhenVisible.current
        ) {
            if (wasAnimatingWhenVisible.current) {
                rendererManager.startAnimation();
            }

            wasAnimatingWhenVisible.current = null;
        }
    }, [rendererManager, wasAnimatingWhenVisible]);
}

export function useRendererManagerEffects() {
    const rendererManager = getRendererManager();
    const handleVisibilityChange = useVisibilityChangeHandler(rendererManager);

    useEffect(() => {
        rendererManager.startAnimation();
        window.document.addEventListener(
            'visibilitychange',
            handleVisibilityChange
        );

        return () => {
            rendererManager.stopAnimation();
            window.document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange
            );
        };
    }, [rendererManager, handleVisibilityChange]);
}
