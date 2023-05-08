import { useAtomValue, useSetAtom } from 'jotai';
import type { MutableRefObject, RefObject } from 'react';
import { useEffect, useMemo } from 'react';

import { backgroundIsVisibleAtom } from '~/common/atoms/background';
import { colorVariantsByNameSubjectAtom } from '~/common/atoms/color';
import { viewportAtom } from '~/common/atoms/viewport';
import { setupBackgroundRenderer } from '~/common/renderers/background';
import {
    setBackgroundCanvasDimensions,
    setupBackgroundColorVariantsByNameObserver,
} from '~/common/utils/background';
import type { ColorVariantCssName } from '~/common/utils/color';
import { getColorVariantCssNames } from '~/common/utils/color';
import { evauluateNoop } from '~/common/utils/function';
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
    const colorVariantsByNameSubject = useAtomValue(
        colorVariantsByNameSubjectAtom
    );
    const canvasContextStyleRefsByColorVariantCssName =
        useBackgroundCanvasContextStyleRefsByColorVariantCssName();

    useEffect(
        () =>
            colorVariantsByNameSubject
                ? setupBackgroundColorVariantsByNameObserver({
                      canvasContextStyleRefsByColorVariantCssName,
                      colorVariantsByNameSubject,
                  })
                : evauluateNoop(),
        [
            canvasContextStyleRefsByColorVariantCssName,
            colorVariantsByNameSubject,
        ]
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
