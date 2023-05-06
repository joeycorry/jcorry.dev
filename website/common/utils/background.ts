import type { MutableRefObject, RefObject } from 'react';

import { colorVariantsByNameSubject } from '~/common/subjects/color';

import type { ColorVariantCssName, ColorVariantsByName } from './color';
import { getColorVariantCssValuesByName } from './color';
import type { Viewport } from './viewport';

type CreateBackgroundColorVariantsByNameObserverParameter = {
    canvasContextStyleRefsByColorVariantCssName: Record<
        ColorVariantCssName,
        MutableRefObject<string>
    >;
};

function createBackgroundColorVariantsByNameObserver({
    canvasContextStyleRefsByColorVariantCssName,
}: CreateBackgroundColorVariantsByNameObserverParameter) {
    return (colorVariantsByName: ColorVariantsByName) => {
        const colorVariantCssValuesByName =
            getColorVariantCssValuesByName(colorVariantsByName);

        for (const [colorVariantCssName, cssValue] of Object.entries(
            colorVariantCssValuesByName
        )) {
            canvasContextStyleRefsByColorVariantCssName[
                colorVariantCssName as ColorVariantCssName
            ].current = cssValue;
        }
    };
}

type CreateBackgroundRendererFillStyleGetterParameter = {
    colorVariantCssName: ColorVariantCssName;
};

export function createBackgroundRendererFillStyleGetter({
    colorVariantCssName,
}: CreateBackgroundRendererFillStyleGetterParameter) {
    return () =>
        window.document.documentElement.style.getPropertyValue(
            colorVariantCssName
        );
}

type CreateBackgroundRendererStrokeStyleGetterParameter = {
    colorVariantCssName: ColorVariantCssName;
};

export function createBackgroundRendererStrokeStyleGetter({
    colorVariantCssName,
}: CreateBackgroundRendererStrokeStyleGetterParameter) {
    return () =>
        window.document.documentElement.style.getPropertyValue(
            colorVariantCssName
        );
}

type GetBackgroundRendererAnimationDurationScalarParameter = {
    colorVariantCssName: ColorVariantCssName;
    viewport: Viewport;
};

export function getBackgroundRendererAnimationDurationScalar({
    colorVariantCssName,
    viewport: { width },
}: GetBackgroundRendererAnimationDurationScalarParameter) {
    return (
        (width >= 1500 ? 0.8 : width >= 750 ? 0.9 : 1) *
        (colorVariantCssName === '--primary-color' ? 18 : 7)
    );
}

export function getBackgroundRendererRibbonsEdgeGutterForViewport({
    width,
}: Viewport) {
    return width >= 1500 ? 200 : width >= 750 ? 150 : 100;
}

export function getBackgroundRendererRibbonsHeightForViewport({
    width,
    height,
}: Viewport) {
    return (width >= 1500 ? 0.8 : width >= 750 ? 0.6 : 0.4) * height;
}

type SetBackgroundCanvasDimensionsParameter = {
    canvasElementRef: RefObject<HTMLCanvasElement>;
    viewport: Viewport;
};

export function setBackgroundCanvasDimensions({
    canvasElementRef,
    viewport,
}: SetBackgroundCanvasDimensionsParameter) {
    if (canvasElementRef.current === null) {
        return;
    }

    const canvasElement = canvasElementRef.current;
    const canvasContext = canvasElement.getContext('2d')!;
    canvasElement.width = viewport.width * viewport.devicePixelRatio;
    canvasElement.height = viewport.height * viewport.devicePixelRatio;
    canvasElement.style.width = `${viewport.width}px`;
    canvasElement.style.height = `${viewport.height}px`;

    canvasContext.scale(viewport.devicePixelRatio, viewport.devicePixelRatio);
}

type SetupBackgroundCanvasContextStyleSettingObserverParameter = {
    canvasContextStyleRefsByColorVariantCssName: Record<
        ColorVariantCssName,
        MutableRefObject<string>
    >;
};

export function setupBackgroundColorVariantsByNameObserver({
    canvasContextStyleRefsByColorVariantCssName,
}: SetupBackgroundCanvasContextStyleSettingObserverParameter) {
    const observeColorVariantsByName =
        createBackgroundColorVariantsByNameObserver({
            canvasContextStyleRefsByColorVariantCssName,
        });
    colorVariantsByNameSubject.register(observeColorVariantsByName);

    return () => {
        colorVariantsByNameSubject.unregister(observeColorVariantsByName);
    };
}
