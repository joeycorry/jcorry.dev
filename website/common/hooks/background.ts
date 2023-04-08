import { useAtomValue, useSetAtom } from 'jotai';
import { RefObject, useEffect } from 'react';

import { backgroundIsVisibleAtom } from '~/common/atoms/background';
import { viewportAtom } from '~/common/atoms/viewport';
import { setupBackgroundRenderers } from '~/common/utils/background';
import { evaluateFunction } from '~/common/utils/function';

import { useColorVariantsByName } from './color';

type UseEffectsParameter = {
    canvasElementRef: RefObject<HTMLCanvasElement>;
};

export function useBackgroundEffects({
    canvasElementRef,
}: UseEffectsParameter) {
    const { primaryColor, tertiaryColor } = useColorVariantsByName();
    const setBackgroundIsVisible = useSetAtom(backgroundIsVisibleAtom);
    const viewport = useAtomValue(viewportAtom);

    useEffect(() => {
        if (canvasElementRef.current === null) {
            return;
        }

        const canvasElement = canvasElementRef.current;
        const canvasContext = canvasElement.getContext('2d')!;
        canvasElement.width = viewport.width * viewport.devicePixelRatio;
        canvasElement.height = viewport.height * viewport.devicePixelRatio;
        canvasElement.style.width = `${viewport.width}px`;
        canvasElement.style.height = `${viewport.height}px`;

        canvasContext.scale(
            viewport.devicePixelRatio,
            viewport.devicePixelRatio
        );
    }, [canvasElementRef, viewport]);

    useEffect(() => {
        if (canvasElementRef.current === null) {
            return;
        }

        const canvasElement = canvasElementRef.current;
        const canvasContext = canvasElement.getContext('2d')!;
        const backgroundRenderersRemovers = [
            setupBackgroundRenderers({
                canvasContext,
                color: primaryColor,
                ribbonWidthBounds: { minimum: 50, maximum: 80 },
                viewport,
            }),
            setupBackgroundRenderers({
                canvasContext,
                color: tertiaryColor,
                ribbonWidthBounds: { minimum: 30, maximum: 60 },
                viewport,
            }),
        ];

        setBackgroundIsVisible(true);

        return () => backgroundRenderersRemovers.forEach(evaluateFunction);
    }, [
        canvasElementRef,
        primaryColor,
        setBackgroundIsVisible,
        tertiaryColor,
        viewport,
    ]);
}
