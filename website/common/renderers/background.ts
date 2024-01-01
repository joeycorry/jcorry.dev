import type { SetStateAction } from 'jotai';
import type { RefObject } from 'react';

import type { Color } from '~/common/lib/colors/color';
import { Point } from '~/common/lib/point';
import type { Renderer } from '~/common/lib/renderer';
import { getRendererManager } from '~/common/lib/rendererManager';
import { Subject } from '~/common/lib/subject';
import { createMovingRibbonRenderer } from '~/common/renderers/shape';
import {
    getBackgroundRendererAnimationDurationScalar,
    getBackgroundRendererMappedStyleSubject,
    getBackgroundRendererRibbonsEdgeGutter,
    getBackgroundRendererRibbonsHeight,
} from '~/common/utils/background';
import { getBoundedRandomInteger } from '~/common/utils/bounded';
import type {
    ColorVariantName,
    PrimaryColorVariantName,
} from '~/common/utils/color';
import { getComplementaryColorVariantName } from '~/common/utils/color';
import { createCompositeRenderer } from '~/common/utils/renderer';
import type { UnregisterObserverCallback } from '~/common/utils/subject';
import type { Viewport } from '~/common/utils/viewport';

import { createNumberTransitionRenderer } from './math';

const ribbonWidthMaximum = 80;
const ribbonWidthMinimum = 20;
const xAxisAdjacentAngle = 0.35 * Math.PI;
const ribbonsInterstitialGutter = 5;

export function setupBackgroundRenderer({
    canvasElementRef,
    colorVariantSubjectsByName,
    setBackgroundIsVisible,
    viewport,
}: {
    canvasElementRef: RefObject<HTMLCanvasElement>;
    colorVariantSubjectsByName: Record<ColorVariantName, Subject<Color>>;
    setBackgroundIsVisible: (value: SetStateAction<boolean>) => void;
    viewport: Viewport;
}) {
    if (canvasElementRef.current === null) {
        return;
    }

    setBackgroundIsVisible(true);

    const canvasElement = canvasElementRef.current;
    const canvasContext = canvasElement.getContext('2d')!;
    const rendererManager = getRendererManager();
    const renderersByStartingTimeEntries: Array<[number, Renderer]> = [];
    const ribbonsEdgeGutter = getBackgroundRendererRibbonsEdgeGutter({
        viewport,
    });
    const ribbonsHeight = getBackgroundRendererRibbonsHeight({ viewport });
    const colorVariantNames: PrimaryColorVariantName[] = [
        'foregroundColor',
        'accentColor',
    ];
    const unregisterObserverCallbacks: Array<UnregisterObserverCallback> = [];

    for (const [
        colorVariantNameIndex,
        colorVariantName,
    ] of colorVariantNames.entries()) {
        const colorVariantSubject =
            colorVariantSubjectsByName[colorVariantName];
        const complementaryColorVariantName = getComplementaryColorVariantName({
            colorVariantName,
        });
        const complementaryColorVariantSubject =
            colorVariantSubjectsByName[complementaryColorVariantName];
        const animationDurationScalar =
            getBackgroundRendererAnimationDurationScalar({
                colorVariantName,
                viewport,
            });
        const leftStartingYs = [ribbonsEdgeGutter];
        const leftYLimit = ribbonsHeight;

        while (
            ribbonsInterstitialGutter + leftStartingYs.at(-1)! <=
            leftYLimit
        ) {
            leftStartingYs.push(
                ribbonsInterstitialGutter +
                    leftStartingYs.at(-1)! +
                    getBoundedRandomInteger({
                        maximum: ribbonWidthMaximum,
                        minimum: ribbonWidthMinimum,
                    }),
            );
        }

        for (const [startingYIndex, startingY] of leftStartingYs
            .slice(0, -1)
            .entries()) {
            const interpolationPercentageSubject = new Subject<number>();
            const [styleSubject, unregisterObserver] =
                getBackgroundRendererMappedStyleSubject({
                    colorVariantSubject,
                    complementaryColorVariantSubject,
                    interpolationPercentageSubject,
                });
            const startingTime =
                startingYIndex * 250 +
                (colorVariantNameIndex * 250) / colorVariantNames.length;
            const movingRibbonRenderer = createMovingRibbonRenderer({
                animationDurationScalar,
                animationStartingDirection: 'alternate',
                canvasContext,
                directionAngle: -xAxisAdjacentAngle,
                fillStyle: styleSubject,
                firstRibbonLineStartingPoint: new Point(
                    0,
                    (startingYIndex > 0 ? ribbonsInterstitialGutter : 0) +
                        startingY,
                ),
                getYLength: point => point.y,
                secondRibbonLineStartingPoint: new Point(
                    0,
                    leftStartingYs[startingYIndex + 1] -
                        ribbonsInterstitialGutter,
                ),
                strokeStyle: styleSubject,
                xAxisAdjacentAngle,
            });
            const interpolationRenderer = createNumberTransitionRenderer({
                animationDuration: 1500 + Math.random() * 2000,
                animationIterationCount: Number.POSITIVE_INFINITY,
                animationStartingDirection: 'alternate',
                maximum: 1,
                minimum: 0,
                numberSubject: interpolationPercentageSubject,
            });

            renderersByStartingTimeEntries.push([
                startingTime,
                movingRibbonRenderer,
            ]);
            renderersByStartingTimeEntries.push([
                startingTime,
                interpolationRenderer,
            ]);
            unregisterObserverCallbacks.push(unregisterObserver);
        }

        const rightStartingYs = [viewport.height - ribbonsHeight];
        const rightYLimit = viewport.height - ribbonsEdgeGutter;

        while (
            ribbonsInterstitialGutter + rightStartingYs.at(-1)! <=
            rightYLimit
        ) {
            rightStartingYs.push(
                ribbonsInterstitialGutter +
                    rightStartingYs.at(-1)! +
                    getBoundedRandomInteger({
                        maximum: ribbonWidthMaximum,
                        minimum: ribbonWidthMinimum,
                    }),
            );
        }

        for (const [startingYIndex, startingY] of [
            ...rightStartingYs.slice(0, -1).entries(),
        ]) {
            const interpolationPercentageSubject = new Subject<number>();
            const [styleSubject, unregisterObserver] =
                getBackgroundRendererMappedStyleSubject({
                    colorVariantSubject,
                    complementaryColorVariantSubject,
                    interpolationPercentageSubject,
                });
            const startingTime =
                (rightStartingYs.length - startingYIndex - 2) * 250 +
                (colorVariantNameIndex * 250) / colorVariantNames.length;
            const movingRibbonRenderer = createMovingRibbonRenderer({
                animationDurationScalar,
                animationStartingDirection: 'alternate-reverse',
                canvasContext,
                directionAngle: Math.PI - xAxisAdjacentAngle,
                fillStyle: styleSubject,
                firstRibbonLineStartingPoint: new Point(
                    viewport.width,
                    (startingYIndex > 0 ? ribbonsInterstitialGutter : 0) +
                        startingY,
                ),
                getYLength: point => viewport.height - point.y,
                secondRibbonLineStartingPoint: new Point(
                    viewport.width,
                    rightStartingYs[startingYIndex + 1] -
                        ribbonsInterstitialGutter,
                ),
                strokeStyle: styleSubject,
                xAxisAdjacentAngle,
            });
            const interpolationRenderer = createNumberTransitionRenderer({
                animationDuration: 1500 + Math.random() * 2000,
                animationIterationCount: Number.POSITIVE_INFINITY,
                animationStartingDirection: 'alternate',
                maximum: 1,
                minimum: 0,
                numberSubject: interpolationPercentageSubject,
            });

            renderersByStartingTimeEntries.push([
                startingTime,
                movingRibbonRenderer,
            ]);
            renderersByStartingTimeEntries.push([
                startingTime,
                interpolationRenderer,
            ]);
            unregisterObserverCallbacks.push(unregisterObserver);
        }
    }

    const compositeRenderer = createCompositeRenderer({
        renderersByStartingTimeEntries,
    });
    const unregisterRenderer =
        rendererManager.registerRenderer(compositeRenderer);

    return () => {
        unregisterRenderer();

        for (const unregisterObserver of unregisterObserverCallbacks) {
            unregisterObserver();
        }
    };
}
