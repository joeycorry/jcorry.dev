import { backgroundIsVisibleAtom } from 'common/atoms/background';
import { viewportAtom } from 'common/atoms/viewport';
import * as BackgroundUtils from 'common/utils/background';
import * as FunctionalUtils from 'common/utils/functional';
import { useAtomValue, useSetAtom } from 'jotai';
import { RefObject, useEffect } from 'react';

import * as ColorHooks from './color';

type UseEffectsParameter = {
    canvasElementRef: RefObject<HTMLCanvasElement>;
};

export function useEffects({ canvasElementRef }: UseEffectsParameter) {
    const { primaryColor, tertiaryColor } = ColorHooks.useVariants();
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
        const renderingStoppers = [
            BackgroundUtils.setupRibbonRenderers({
                canvasContext,
                color: primaryColor,
                ribbonWidthBounds: { minimum: 50, maximum: 80 },
                viewport,
            }),
            BackgroundUtils.setupRibbonRenderers({
                canvasContext,
                color: tertiaryColor,
                ribbonWidthBounds: { minimum: 30, maximum: 60 },
                viewport,
            }),
        ];

        setBackgroundIsVisible(true);

        return () => renderingStoppers.forEach(FunctionalUtils.evaluate);
    }, [
        canvasElementRef,
        primaryColor,
        setBackgroundIsVisible,
        tertiaryColor,
        viewport,
    ]);
}
