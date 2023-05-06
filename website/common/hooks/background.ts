import { useAtomValue, useSetAtom } from 'jotai';
import type { MutableRefObject, RefObject } from 'react';
import { useEffect, useMemo } from 'react';

import { backgroundIsVisibleAtom } from '~/common/atoms/background';
import { viewportAtom } from '~/common/atoms/viewport';
import { setupBackgroundRenderer } from '~/common/renderers/background';
import {
    setBackgroundCanvasDimensions,
    setupBackgroundColorVariantsByNameObserver,
} from '~/common/utils/background';
import type { ColorVariantCssName } from '~/common/utils/color';
import { getColorVariantCssNames } from '~/common/utils/color';
import { createMutableRef } from '~/common/utils/react';

function useBackgroundCanvasContextStyleRefsByColorVariantCssName() {
    return useMemo(
        () =>
            Object.fromEntries(
                getColorVariantCssNames().map(colorVariantCssName => [
                    colorVariantCssName,
                    createMutableRef(''),
                ])
            ) as Record<ColorVariantCssName, MutableRefObject<string>>,
        []
    );
}

type UseBackgroundEffectsParameter = {
    canvasElementRef: RefObject<HTMLCanvasElement>;
};

export function useBackgroundEffects({
    canvasElementRef,
}: UseBackgroundEffectsParameter) {
    const setBackgroundIsVisible = useSetAtom(backgroundIsVisibleAtom);
    const viewport = useAtomValue(viewportAtom);
    const canvasContextStyleRefsByColorVariantCssName =
        useBackgroundCanvasContextStyleRefsByColorVariantCssName();

    useEffect(
        () =>
            setupBackgroundColorVariantsByNameObserver({
                canvasContextStyleRefsByColorVariantCssName,
            }),
        [canvasContextStyleRefsByColorVariantCssName]
    );

    useEffect(
        () => setBackgroundCanvasDimensions({ canvasElementRef, viewport }),
        [canvasElementRef, viewport]
    );

    useEffect(
        () =>
            setupBackgroundRenderer({
                canvasContextStyleRefsByColorVariantCssName,
                canvasElementRef,
                excludedColorVariantCssName: '--secondary-color',
                setBackgroundIsVisible,
                viewport,
            }),
        [
            canvasContextStyleRefsByColorVariantCssName,
            canvasElementRef,
            setBackgroundIsVisible,
            viewport,
        ]
    );
}
