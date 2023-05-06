import { useAtomValue, useSetAtom } from 'jotai';
import type { MutableRefObject, RefObject } from 'react';
import { useEffect, useRef } from 'react';

import { backgroundIsVisibleAtom } from '~/common/atoms/background';
import { viewportAtom } from '~/common/atoms/viewport';
import { setupBackgroundRenderer } from '~/common/renderers/background';
import {
    setBackgroundCanvasDimensions,
    setupBackgroundColorVariantsByNameObserver,
} from '~/common/utils/background';
import type { ColorVariantCssName } from '~/common/utils/color';
import { getColorVariantCssNames } from '~/common/utils/color';

type UseEffectsParameter = {
    canvasElementRef: RefObject<HTMLCanvasElement>;
};

export function useBackgroundEffects({
    canvasElementRef,
}: UseEffectsParameter) {
    const setBackgroundIsVisible = useSetAtom(backgroundIsVisibleAtom);
    const viewport = useAtomValue(viewportAtom);
    const canvasContextStyleRefsByColorVariantCssName = Object.fromEntries(
        getColorVariantCssNames().map(colorVariantCssName => [
            colorVariantCssName,
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useRef(''),
        ])
    ) as Record<ColorVariantCssName, MutableRefObject<string>>;

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
