import { useAtomValue, useSetAtom } from 'jotai';
import type { RefObject } from 'react';
import { useEffect } from 'react';

import { backgroundIsVisibleAtom } from '~/common/atoms/background';
import { viewportAtom } from '~/common/atoms/viewport';
import { setupBackgroundRenderers } from '~/common/utils/background';
import { linear } from '~/common/utils/easing';
import { evaluateFunction } from '~/common/utils/function';

type UseEffectsParameter = {
    canvasElementRef: RefObject<HTMLCanvasElement>;
};

export function useBackgroundEffects({
    canvasElementRef,
}: UseEffectsParameter) {
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
        const easingFunction = linear;
        const backgroundRenderersRemovers = [
            setupBackgroundRenderers({
                canvasContext,
                colorVariantCssName: '--primary-color',
                easingFunction,
                ribbonWidthBounds: { minimum: 30, maximum: 60 },
                viewport,
            }),
            setupBackgroundRenderers({
                canvasContext,
                colorVariantCssName: '--tertiary-color',
                easingFunction,
                ribbonWidthBounds: { minimum: 30, maximum: 60 },
                viewport,
            }),
        ];

        setBackgroundIsVisible(true);

        return () => backgroundRenderersRemovers.forEach(evaluateFunction);
    }, [canvasElementRef, setBackgroundIsVisible, viewport]);
}
