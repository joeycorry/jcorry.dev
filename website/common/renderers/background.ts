import type { SetStateAction } from 'jotai';
import type { MutableRefObject, RefObject } from 'react';

import type { Renderer } from '~/common/lib/renderer';
import { getRendererManager } from '~/common/lib/rendererManager';
import { createMovingRibbonRenderer } from '~/common/renderers/shape';
import { getArrayElementAtIndex } from '~/common/utils/array';
import {
    getBackgroundRendererAnimationDurationScalar,
    getBackgroundRendererRibbonsEdgeGutterForViewport,
    getBackgroundRendererRibbonsHeightForViewport,
} from '~/common/utils/background';
import type { Bounds } from '~/common/utils/bounded';
import { getBoundedRandomInteger } from '~/common/utils/bounded';
import type { ColorVariantCssName } from '~/common/utils/color';
import { getColorVariantCssNames } from '~/common/utils/color';
import { createCompositeRenderer } from '~/common/utils/renderer';
import type { Viewport } from '~/common/utils/viewport';

const ribbonWidthBounds: Bounds = { minimum: 30, maximum: 60 };
const xAxisAdjacentAngle = 0.35 * Math.PI;
const ribbonsInterstitialGutter = 5;

type SetupBackgroundRendererParameter = {
    canvasContextStyleRefsByColorVariantCssName: Record<
        ColorVariantCssName,
        MutableRefObject<string>
    >;
    canvasElementRef: RefObject<HTMLCanvasElement>;
    excludedColorVariantCssName: ColorVariantCssName;
    setBackgroundIsVisible: (value: SetStateAction<boolean>) => void;
    viewport: Viewport;
};

export function setupBackgroundRenderer({
    canvasContextStyleRefsByColorVariantCssName,
    canvasElementRef,
    excludedColorVariantCssName,
    setBackgroundIsVisible,
    viewport,
}: SetupBackgroundRendererParameter) {
    if (canvasElementRef.current === null) {
        return;
    }

    setBackgroundIsVisible(true);

    const canvasElement = canvasElementRef.current;
    const canvasContext = canvasElement.getContext('2d')!;
    const rendererManager = getRendererManager();
    const renderersByColorVariantCssNameByStartingTime = new Map<
        ColorVariantCssName,
        Map<number, Renderer>
    >();
    const ribbonsEdgeGutter =
        getBackgroundRendererRibbonsEdgeGutterForViewport(viewport);
    const ribbonsHeight =
        getBackgroundRendererRibbonsHeightForViewport(viewport);
    const colorVariantCssNames = getColorVariantCssNames().filter(
        name => name !== excludedColorVariantCssName
    );

    for (const [
        colorVariantCssNameIndex,
        colorVariantCssName,
    ] of colorVariantCssNames.entries()) {
        const renderersByStartingTime = new Map<number, Renderer>();
        const styleRef =
            canvasContextStyleRefsByColorVariantCssName[colorVariantCssName];
        const animationDurationScalar =
            getBackgroundRendererAnimationDurationScalar({
                colorVariantCssName,
                viewport,
            });
        const leftStartingYs = [ribbonsEdgeGutter];
        const leftYLimit = ribbonsHeight;

        renderersByColorVariantCssNameByStartingTime.set(
            colorVariantCssName,
            renderersByStartingTime
        );

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

        for (const [startingYIndex, startingY] of leftStartingYs
            .slice(0, -1)
            .entries()) {
            const startingTime =
                renderersByStartingTime.size * 250 +
                (colorVariantCssNameIndex * 250) / colorVariantCssNames.length;
            const renderer = createMovingRibbonRenderer({
                animationDurationScalar,
                animationStartingDirection: 'alternate',
                canvasContext,
                directionAngle: -xAxisAdjacentAngle,
                fillStyle: styleRef,
                firstRibbonLineStartingPosition: {
                    x: 0,
                    y:
                        (startingYIndex > 0 ? ribbonsInterstitialGutter : 0) +
                        startingY,
                },
                getYLength: position => position.y,
                secondRibbonLineStartingPosition: {
                    x: 0,
                    y:
                        leftStartingYs[startingYIndex + 1] -
                        ribbonsInterstitialGutter,
                },
                strokeStyle: styleRef,
                xAxisAdjacentAngle,
            });

            renderersByStartingTime.set(startingTime, renderer);
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

        for (const [startingYIndex, startingY] of [
            ...rightStartingYs.slice(0, -1).entries(),
        ].reverse()) {
            const startingTime =
                (renderersByStartingTime.size - leftRenderersCount) * 250 +
                (colorVariantCssNameIndex * 250) / colorVariantCssNames.length +
                1;
            const renderer = createMovingRibbonRenderer({
                animationDurationScalar,
                animationStartingDirection: 'alternate-reverse',
                canvasContext,
                directionAngle: Math.PI - xAxisAdjacentAngle,
                fillStyle: styleRef,
                firstRibbonLineStartingPosition: {
                    x: viewport.width,
                    y:
                        (startingYIndex > 0 ? ribbonsInterstitialGutter : 0) +
                        startingY,
                },
                getYLength: position => viewport.height - position.y,
                secondRibbonLineStartingPosition: {
                    x: viewport.width,
                    y:
                        rightStartingYs[startingYIndex + 1] -
                        ribbonsInterstitialGutter,
                },
                strokeStyle: styleRef,
                xAxisAdjacentAngle,
            });

            renderersByStartingTime.set(startingTime, renderer);
        }
    }

    const finalRenderersByStartingTime = new Map(
        [...renderersByColorVariantCssNameByStartingTime.values()]
            .map(renderersByStartingTime => [...renderersByStartingTime])
            .flat()
    );
    const compositeRenderer = createCompositeRenderer({
        renderersByStartingTime: finalRenderersByStartingTime,
    });

    rendererManager.addRenderer(compositeRenderer);

    return () => rendererManager.removeRenderer(compositeRenderer);
}
