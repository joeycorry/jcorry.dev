import type { SetStateAction } from 'jotai';
import type { RefObject } from 'react';

import type { Color } from '~/common/lib/colors/color';
import { Point } from '~/common/lib/point';
import type { Renderer } from '~/common/lib/renderer';
import { getRendererManager } from '~/common/lib/rendererManager';
import type { Subject } from '~/common/lib/subject';
import { createMovingRibbonRenderer } from '~/common/renderers/shape';
import { getArrayElementAtIndex } from '~/common/utils/array';
import {
    getBackgroundRendererAnimationDurationScalar,
    getBackgroundRendererRibbonsEdgeGutter,
    getBackgroundRendererRibbonsHeight,
} from '~/common/utils/background';
import type { Bounds } from '~/common/utils/bounded';
import { getBoundedRandomInteger } from '~/common/utils/bounded';
import type { ColorVariantName } from '~/common/utils/color';
import { getColorVariantNames } from '~/common/utils/color';
import { createCompositeRenderer } from '~/common/utils/renderer';
import type { Viewport } from '~/common/utils/viewport';

const ribbonWidthBounds: Bounds = { minimum: 30, maximum: 60 };
const xAxisAdjacentAngle = 0.35 * Math.PI;
const ribbonsInterstitialGutter = 5;

type SetupBackgroundRendererParameter = {
    canvasElementRef: RefObject<HTMLCanvasElement>;
    colorVariantSubjectsByName: Record<ColorVariantName, Subject<Color>>;
    excludedColorVariantName: ColorVariantName;
    setBackgroundIsVisible: (value: SetStateAction<boolean>) => void;
    viewport: Viewport;
};

export function setupBackgroundRenderer({
    canvasElementRef,
    colorVariantSubjectsByName,
    excludedColorVariantName,
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
    const renderersByColorVariantNameByStartingTime = new Map<
        ColorVariantName,
        Map<number, Renderer>
    >();
    const ribbonsEdgeGutter = getBackgroundRendererRibbonsEdgeGutter({
        viewport,
    });
    const ribbonsHeight = getBackgroundRendererRibbonsHeight({ viewport });
    const colorVariantNames = getColorVariantNames().filter(
        name => name !== excludedColorVariantName
    );

    for (const [
        colorVariantNameIndex,
        colorVariantName,
    ] of colorVariantNames.entries()) {
        const renderersByStartingTime = new Map<number, Renderer>();
        const colorVariantSubject =
            colorVariantSubjectsByName[colorVariantName];
        const animationDurationScalar =
            getBackgroundRendererAnimationDurationScalar({
                colorVariantName,
                viewport,
            });
        const leftStartingYs = [ribbonsEdgeGutter];
        const leftYLimit = ribbonsHeight;

        renderersByColorVariantNameByStartingTime.set(
            colorVariantName,
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
            const styleRef = colorVariantSubject.map(
                maybeColor => maybeColor?.toString() ?? ''
            );
            const startingTime =
                renderersByStartingTime.size * 250 +
                (colorVariantNameIndex * 250) / colorVariantNames.length;
            const renderer = createMovingRibbonRenderer({
                animationDurationScalar,
                animationStartingDirection: 'alternate',
                canvasContext,
                directionAngle: -xAxisAdjacentAngle,
                fillStyle: styleRef,
                firstRibbonLineStartingPoint: new Point(
                    0,
                    (startingYIndex > 0 ? ribbonsInterstitialGutter : 0) +
                        startingY
                ),
                getYLength: point => point.y,
                secondRibbonLineStartingPoint: new Point(
                    0,
                    leftStartingYs[startingYIndex + 1] -
                        ribbonsInterstitialGutter
                ),
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
            const styleRef = colorVariantSubject.map(
                maybeColor => maybeColor?.toString() ?? ''
            );
            const startingTime =
                (renderersByStartingTime.size - leftRenderersCount) * 250 +
                (colorVariantNameIndex * 250) / colorVariantNames.length +
                1;
            const renderer = createMovingRibbonRenderer({
                animationDurationScalar,
                animationStartingDirection: 'alternate-reverse',
                canvasContext,
                directionAngle: Math.PI - xAxisAdjacentAngle,
                fillStyle: styleRef,
                firstRibbonLineStartingPoint: new Point(
                    viewport.width,
                    (startingYIndex > 0 ? ribbonsInterstitialGutter : 0) +
                        startingY
                ),
                getYLength: point => viewport.height - point.y,
                secondRibbonLineStartingPoint: new Point(
                    viewport.width,
                    rightStartingYs[startingYIndex + 1] -
                        ribbonsInterstitialGutter
                ),
                strokeStyle: styleRef,
                xAxisAdjacentAngle,
            });

            renderersByStartingTime.set(startingTime, renderer);
        }
    }

    const finalRenderersByStartingTime = new Map(
        [...renderersByColorVariantNameByStartingTime.values()]
            .map(renderersByStartingTime => [...renderersByStartingTime])
            .flat()
    );
    const compositeRenderer = createCompositeRenderer({
        renderersByStartingTime: finalRenderersByStartingTime,
    });

    rendererManager.addRenderer(compositeRenderer);

    return () => rendererManager.removeRenderer(compositeRenderer);
}
