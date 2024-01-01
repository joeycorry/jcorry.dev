import type { RefObject } from 'react';

import type { Color } from '~/common/lib/colors/color';
import { Subject } from '~/common/lib/subject';

import type { ColorVariantName } from './color';
import type { Viewport } from './viewport';

export function getBackgroundRendererAnimationDurationScalar({
    colorVariantName,
    viewport: { width },
}: {
    colorVariantName: ColorVariantName;
    viewport: Viewport;
}) {
    return (
        (width >= 1500 ? 0.8 : width >= 750 ? 0.9 : 1) *
        (colorVariantName === 'foregroundColor' ? 15 : 7)
    );
}

export function getBackgroundRendererRibbonsEdgeGutter({
    viewport: { width },
}: {
    viewport: Viewport;
}) {
    return width >= 1500 ? 200 : width >= 750 ? 150 : 100;
}

export function getBackgroundRendererRibbonsHeight({
    viewport: { width, height },
}: {
    viewport: Viewport;
}) {
    return (width >= 1500 ? 0.8 : width >= 750 ? 0.6 : 0.4) * height;
}

export function getBackgroundRendererMappedStyleSubject({
    colorVariantSubject,
    complementaryColorVariantSubject,
    interpolationPercentageSubject,
}: {
    colorVariantSubject: Subject<Color>;
    complementaryColorVariantSubject: Subject<Color>;
    interpolationPercentageSubject: Subject<number>;
}) {
    return Subject.mapAll<[Color, Color, number], string>(
        [
            colorVariantSubject,
            complementaryColorVariantSubject,
            interpolationPercentageSubject,
        ],
        (...args) => {
            if (args.length === 0) {
                return '';
            }

            const [color, complementaryColor, interpolationPercentage] = args;

            return color
                .interpolate(complementaryColor, interpolationPercentage)
                .toString();
        },
    );
}

export function setBackgroundCanvasDimensions({
    canvasElementRef,
    viewport,
}: {
    canvasElementRef: RefObject<HTMLCanvasElement>;
    viewport: Viewport;
}) {
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
