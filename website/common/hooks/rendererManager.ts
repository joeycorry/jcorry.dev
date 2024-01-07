import { useCallback, useEffect, useRef } from 'react';

import { getRendererManager } from '~/common/utils/rendererManager';

function useRendererManagerEffects(): void {
    useSynchronizeRendererManagerAnimationEffect();
}

function useSynchronizeRendererManagerAnimationEffect(): void {
    const rendererManager = getRendererManager();
    const wasAnimatingWhenVisibleRef = useRef<boolean | null>(null);
    const handleDocumentVisibilityStatusChange = useCallback(() => {
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

    useEffect(() => {
        rendererManager.startAnimation();
        window.document.addEventListener(
            'visibilitychange',
            handleDocumentVisibilityStatusChange,
        );

        return () => {
            rendererManager.stopAnimation();
            window.document.removeEventListener(
                'visibilitychange',
                handleDocumentVisibilityStatusChange,
            );
        };
    }, [rendererManager, handleDocumentVisibilityStatusChange]);
}

export { useRendererManagerEffects };
