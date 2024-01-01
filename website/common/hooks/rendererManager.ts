import { useCallback, useEffect, useRef } from 'react';

import { getRendererManager } from '~/common/lib/rendererManager';

function useRendererManagerEffects() {
    const rendererManager = getRendererManager();
    const handleVisibilityChange = useVisibilityChangeHandler();

    useEffect(() => {
        rendererManager.startAnimation();
        window.document.addEventListener(
            'visibilitychange',
            handleVisibilityChange,
        );

        return () => {
            rendererManager.stopAnimation();
            window.document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange,
            );
        };
    }, [rendererManager, handleVisibilityChange]);
}

function useVisibilityChangeHandler() {
    const rendererManager = getRendererManager();
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

export { useRendererManagerEffects };
