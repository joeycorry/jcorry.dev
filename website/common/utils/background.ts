import type { Renderer } from '~/common/lib/renderer';
import { getRendererManager } from '~/common/lib/rendererManager';
import { createMovingTrapezoidRenderer } from '~/common/renderers/shape';

import { getArrayElementAtIndex } from './array';
import type { Bounds } from './bounded';
import { getBoundedRandomInteger } from './bounded';
import type { ColorVariantCssName } from './color';
import type { Position } from './geometry';
import { getSineOfRadians } from './geometry';
import { createCompositeRenderer } from './renderer';
import type { Viewport } from './viewport';

type GetBackgroundRendererParameter = {
    animationDurationScalar: number;
    animationStartingDirection: 'alternate' | 'alternate-reverse';
    canvasContext: CanvasRenderingContext2D;
    colorVariantCssName: ColorVariantCssName;
    directionAngle: number;
    firstRibbonLineStartingPosition: Position;
    getYLength: (position: Position) => number;
    secondRibbonLineStartingPosition: Position;
    xAxisAdjacentAngle: number;
};

function getBackgroundRenderer({
    animationDurationScalar,
    animationStartingDirection,
    canvasContext,
    colorVariantCssName,
    directionAngle,
    firstRibbonLineStartingPosition,
    getYLength,
    secondRibbonLineStartingPosition,
    xAxisAdjacentAngle,
}: GetBackgroundRendererParameter) {
    const sineOfXAxisAdjacentAngle = getSineOfRadians(xAxisAdjacentAngle);
    const firstLength =
        getYLength(firstRibbonLineStartingPosition) / sineOfXAxisAdjacentAngle;
    const secondLength =
        getYLength(secondRibbonLineStartingPosition) / sineOfXAxisAdjacentAngle;

    return createMovingTrapezoidRenderer({
        angle: directionAngle,
        animationDuration:
            Math.max(firstLength, secondLength) * animationDurationScalar,
        animationIterationCount: Number.POSITIVE_INFINITY,
        animationStartingDirection,
        canvasContext,
        colorVariantCssName,
        parallelLineDataPair: [
            {
                length: firstLength,
                startingPosition: firstRibbonLineStartingPosition,
            },
            {
                length: secondLength,
                startingPosition: secondRibbonLineStartingPosition,
            },
        ],
    });
}

const xAxisAdjacentAngle = 0.35 * Math.PI;
const ribbonsInterstitialGutter = 5;

function getRibbonsEdgeGutterForViewport({ width }: Viewport) {
    return width >= 1500 ? 200 : width >= 750 ? 150 : 100;
}

function getRibbonsHeightForViewport({ width, height }: Viewport) {
    return (width >= 1500 ? 0.8 : width >= 750 ? 0.6 : 0.4) * height;
}

type GetAnimationDurationScalarParameter = {
    colorVariantCssName: ColorVariantCssName;
    viewport: Viewport;
};

function getAnimationDurationScalar({
    colorVariantCssName,
    viewport: { width },
}: GetAnimationDurationScalarParameter) {
    return (
        (width >= 1500 ? 0.8 : width >= 750 ? 0.9 : 1) *
        (colorVariantCssName === '--primary-color' ? 18 : 7)
    );
}

type SetupBackgroundRenderersParameter = {
    canvasContext: CanvasRenderingContext2D;
    colorVariantCssName: ColorVariantCssName;
    ribbonWidthBounds: Bounds;
    viewport: Viewport;
};

export function setupBackgroundRenderers({
    canvasContext,
    colorVariantCssName,
    ribbonWidthBounds,
    viewport,
}: SetupBackgroundRenderersParameter) {
    const rendererManager = getRendererManager();
    const renderersByStartingTime = new Map<number, Renderer>();
    const ribbonsHeight = getRibbonsHeightForViewport(viewport);
    const animationDurationScalar = getAnimationDurationScalar({
        colorVariantCssName,
        viewport,
    });
    const ribbonsEdgeGutter = getRibbonsEdgeGutterForViewport(viewport);

    const leftStartingYs = [ribbonsEdgeGutter];
    const leftYLimit = ribbonsHeight;

    while (
        ribbonsInterstitialGutter +
            getArrayElementAtIndex(leftStartingYs, -1)! <=
        leftYLimit
    ) {
        leftStartingYs.push(
            ribbonsInterstitialGutter +
                getArrayElementAtIndex(leftStartingYs, -1)! +
                getBoundedRandomInteger(ribbonWidthBounds)
        );
    }

    for (const [index, startingY] of leftStartingYs.slice(0, -1).entries()) {
        const renderer = getBackgroundRenderer({
            animationDurationScalar,
            animationStartingDirection: 'alternate',
            canvasContext,
            colorVariantCssName,
            directionAngle: -xAxisAdjacentAngle,
            firstRibbonLineStartingPosition: {
                x: 0,
                y: (index > 0 ? ribbonsInterstitialGutter : 0) + startingY,
            },
            getYLength: position => position.y,
            secondRibbonLineStartingPosition: {
                x: 0,
                y: leftStartingYs[index + 1] - ribbonsInterstitialGutter,
            },
            xAxisAdjacentAngle,
        });

        renderersByStartingTime.set(
            renderersByStartingTime.size * 250,
            renderer
        );
    }

    const leftRenderersCount = renderersByStartingTime.size;

    const rightStartingYs = [viewport.height - ribbonsHeight];
    const rightYLimit = viewport.height - ribbonsEdgeGutter;

    while (
        ribbonsInterstitialGutter +
            getArrayElementAtIndex(rightStartingYs, -1)! <=
        rightYLimit
    ) {
        rightStartingYs.push(
            ribbonsInterstitialGutter +
                getArrayElementAtIndex(rightStartingYs, -1)! +
                getBoundedRandomInteger(ribbonWidthBounds)
        );
    }

    for (const [index, startingY] of [
        ...rightStartingYs.slice(0, -1).entries(),
    ].reverse()) {
        const renderer = getBackgroundRenderer({
            animationDurationScalar,
            animationStartingDirection: 'alternate-reverse',
            canvasContext,
            colorVariantCssName,
            directionAngle: Math.PI - xAxisAdjacentAngle,
            firstRibbonLineStartingPosition: {
                x: viewport.width,
                y: (index > 0 ? ribbonsInterstitialGutter : 0) + startingY,
            },
            getYLength: position => viewport.height - position.y,
            secondRibbonLineStartingPosition: {
                x: viewport.width,
                y: rightStartingYs[index + 1] - ribbonsInterstitialGutter,
            },
            xAxisAdjacentAngle,
        });

        renderersByStartingTime.set(
            125 + (renderersByStartingTime.size - leftRenderersCount) * 250,
            renderer
        );
    }

    const compositeRenderer = createCompositeRenderer({
        renderersByStartingTime,
    });

    rendererManager.addRenderer(compositeRenderer);

    return () => rendererManager.removeRenderer(compositeRenderer);
}
