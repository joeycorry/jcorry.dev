import type { RefObject } from 'react';

import type { ColorVariantName } from './color';
import type { Viewport } from './viewport';

type GetBackgroundRendererAnimationDurationScalarParameter = {
    colorVariantName: ColorVariantName;
    viewport: Viewport;
};

export function getBackgroundRendererAnimationDurationScalar({
    colorVariantName,
    viewport: { width },
}: GetBackgroundRendererAnimationDurationScalarParameter) {
    return (
        (width >= 1500 ? 0.8 : width >= 750 ? 0.9 : 1) *
        (colorVariantName === 'primaryColor' ? 18 : 7)
    );
}

type GetBackgroundRendererRibbonsEdgeGutterParameter = { viewport: Viewport };

export function getBackgroundRendererRibbonsEdgeGutter({
    viewport: { width },
}: GetBackgroundRendererRibbonsEdgeGutterParameter) {
    return width >= 1500 ? 200 : width >= 750 ? 150 : 100;
}

type GetBackgroundRendererRibbonsHeightParameter = { viewport: Viewport };

export function getBackgroundRendererRibbonsHeight({
    viewport: { width, height },
}: GetBackgroundRendererRibbonsHeightParameter) {
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
