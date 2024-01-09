import { useAtomValue } from 'jotai';
import type { RefObject } from 'react';
import { useEffect } from 'react';

import { colorVariantSubjectsByNameAtom } from '~/common/atoms/color';
import { viewportAtom } from '~/common/atoms/viewport';
import { createBackgroundRenderer } from '~/common/renderers/background';
import { getRendererManager } from '~/common/utils/rendererManager';

function useBackgroundEffects(
    canvasElementRef: RefObject<HTMLCanvasElement>,
): void {
    useSynchronizeBackgroundAnimationEffect(canvasElementRef);
    useSynchronizeBackgroundCanvasDimensionsEffect(canvasElementRef);
}

function useSynchronizeBackgroundAnimationEffect(
    canvasElementRef: RefObject<HTMLCanvasElement>,
): void {
    const rendererManager = getRendererManager();
    const colorVariantSubjectsByName = useAtomValue(
        colorVariantSubjectsByNameAtom,
    );
    const viewport = useAtomValue(viewportAtom);

    useEffect(() => {
        const renderer = createBackgroundRenderer({
            canvasElementRef,
            colorVariantSubjectsByName,
            viewport,
        });

        return rendererManager.registerRenderer(renderer);
    }, [
        canvasElementRef,
        colorVariantSubjectsByName,
        rendererManager,
        viewport,
    ]);
}

function useSynchronizeBackgroundCanvasDimensionsEffect(
    canvasElementRef: RefObject<HTMLCanvasElement>,
): void {
    const viewport = useAtomValue(viewportAtom);

    useEffect(() => {
        if (canvasElementRef.current === null) {
            return;
        }

        const canvasElement = canvasElementRef.current;
        const canvasContext = canvasElement.getContext('2d')!;
        canvasElement.width = viewport.physicalWidth;
        canvasElement.height = viewport.physicalHeight;
        canvasElement.style.width = `${viewport.width}px`;
        canvasElement.style.height = `${viewport.height}px`;

        canvasContext.scale(
            viewport.devicePixelRatio,
            viewport.devicePixelRatio,
        );
    }, [canvasElementRef, viewport]);
}

export { useBackgroundEffects };
