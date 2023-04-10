import { useCallback, useEffect, useRef } from 'react';

import { getRendererManager } from '~/common/lib/rendererManager';
import type { RendererManager } from '~/common/utils/rendererManager';

function useVisibilityChangeHandler(rendererManager: RendererManager) {
    const wasAnimatingWhenVisibleRef = useRef<boolean | null>(null);

    return useCallback(() => {
        const { visibilityState } = window.document;

        if (visibilityState === 'hidden' && rendererManager.isAnimating()) {
            wasAnimatingWhenVisibleRef.current = true;

            rendererManager.stopAnimation();
        } else if (visibilityState === 'visible') {
            if (wasAnimatingWhenVisibleRef.current) {
                rendererManager.startAnimation();
            }

            wasAnimatingWhenVisibleRef.current = null;
        }
    }, [rendererManager, wasAnimatingWhenVisibleRef]);
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
