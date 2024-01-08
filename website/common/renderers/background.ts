import type { RefObject } from 'react';

import { Angle } from '~/common/lib/angle';
import type { Color } from '~/common/lib/colors/color';
import { Point } from '~/common/lib/point';
import type { Renderer } from '~/common/lib/renderer';
import { Subject } from '~/common/lib/subject';
import { createMovingRibbonRenderer } from '~/common/renderers/shape';
import type {
    ColorVariantSubjectsByName,
    PrimaryColorVariantName,
} from '~/common/utils/color';
import { getComplementaryColorVariantName } from '~/common/utils/color';
import { getBoundedRandomInteger } from '~/common/utils/math';
import type { RendererCleanupCallback } from '~/common/utils/renderer';
import { createCompositeRenderer } from '~/common/utils/renderer';
import { mapSubjects } from '~/common/utils/subject';
import type { Viewport } from '~/common/utils/viewport';

import { createNoopRenderer } from './function';
import { createNumberTransitionRenderer } from './math';

const ribbonWidthMaximum = 80;
const ribbonWidthMinimum = 20;
const ribbonsInterstitialGutter = 5;
const xAxisAdjacentAngle = new Angle({ radians: 0.35 * Math.PI });
const piAngle = new Angle({ radians: Math.PI });

function createBackgroundRenderer({
    canvasElementRef,
    colorVariantSubjectsByName,
    viewport,
}: {
    canvasElementRef: RefObject<HTMLCanvasElement>;
    colorVariantSubjectsByName: ColorVariantSubjectsByName;
    viewport: Viewport;
}): Renderer {
    if (canvasElementRef.current === null) {
        return createNoopRenderer();
    }

    const abortController = new AbortController();
    const abortSignal = abortController.signal;
    const canvasElement = canvasElementRef.current;
    const canvasContext = canvasElement.getContext('2d')!;
    const renderersByStartingTimeEntries: Array<[number, Renderer]> = [];
    const ribbonsEdgeGutter =
        viewport.width >= 1500 ? 200 : viewport.width >= 750 ? 150 : 100;
    const ribbonsHeight =
        (viewport.width >= 1500 ? 0.8 : viewport.width >= 750 ? 0.6 : 0.4) *
        viewport.height;
    const colorVariantNames: PrimaryColorVariantName[] = [
        'foregroundColor',
        'accentColor',
    ];

    for (const [
        colorVariantNameIndex,
        colorVariantName,
    ] of colorVariantNames.entries()) {
        const colorVariantSubject =
            colorVariantSubjectsByName[colorVariantName];
        const complementaryColorVariantName =
            getComplementaryColorVariantName(colorVariantName);
        const complementaryColorVariantSubject =
            colorVariantSubjectsByName[complementaryColorVariantName];
        const animationDurationScalar =
            (viewport.width >= 1500 ? 0.8 : viewport.width >= 750 ? 0.9 : 1) *
            (colorVariantName === 'foregroundColor' ? 15 : 7);
        const leftStartingYs = [ribbonsEdgeGutter];
        const leftYLimit = ribbonsHeight;

        while (
            ribbonsInterstitialGutter + leftStartingYs.at(-1)! <=
            leftYLimit
        ) {
            leftStartingYs.push(
                ribbonsInterstitialGutter +
                    leftStartingYs.at(-1)! +
                    getBoundedRandomInteger(
                        ribbonWidthMinimum,
                        ribbonWidthMaximum,
                    ),
            );
        }

        for (const [startingYIndex, startingY] of leftStartingYs
            .slice(0, -1)
            .entries()) {
            const interpolatingPercentageSubject = new Subject(0);
            const styleSubject = createCanvasContextStyleSubject({
                abortSignal,
                colorVariantSubject,
                complementaryColorVariantSubject,
                interpolatingPercentageSubject,
            });
            const startingTime =
                startingYIndex * 250 +
                (colorVariantNameIndex * 250) / colorVariantNames.length;
            const firstStartPoint = new Point(
                0,
                (startingYIndex > 0 ? ribbonsInterstitialGutter : 0) +
                    startingY,
            );
            const secondStartPoint = new Point(
                0,
                leftStartingYs[startingYIndex + 1] - ribbonsInterstitialGutter,
            );
            const movingRibbonRenderer = createMovingRibbonRenderer({
                animationDurationScalar,
                animationStartingDirection: 'alternate',
                canvasContext,
                directionAngle: xAxisAdjacentAngle.toOpposed(),
                fillStyle: styleSubject,
                getYLength: point => point.y,
                startingPointPair: [firstStartPoint, secondStartPoint],
                strokeStyle: styleSubject,
                xAxisAdjacentAngle,
            });
            const interpolationRenderer = createNumberTransitionRenderer({
                animationDuration: 1500 + Math.random() * 2000,
                animationIterationCount: Number.POSITIVE_INFINITY,
                animationStartingDirection: 'alternate',
                maximum: 1,
                minimum: 0,
                numberSubject: interpolatingPercentageSubject,
            });

            renderersByStartingTimeEntries.push([
                startingTime,
                movingRibbonRenderer,
            ]);
            renderersByStartingTimeEntries.push([
                startingTime,
                interpolationRenderer,
            ]);
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
                    getBoundedRandomInteger(
                        ribbonWidthMinimum,
                        ribbonWidthMaximum,
                    ),
            );
        }

        for (const [startingYIndex, startingY] of [
            ...rightStartingYs.slice(0, -1).entries(),
        ]) {
            const interpolatingPercentageSubject = new Subject(0);
            const styleSubject = createCanvasContextStyleSubject({
                abortSignal,
                colorVariantSubject,
                complementaryColorVariantSubject,
                interpolatingPercentageSubject,
            });
            const startingTime =
                (rightStartingYs.length - startingYIndex - 2) * 250 +
                (colorVariantNameIndex * 250) / colorVariantNames.length;
            const firstStartPoint = new Point(
                viewport.width,
                (startingYIndex > 0 ? ribbonsInterstitialGutter : 0) +
                    startingY,
            );
            const secondStartPoint = new Point(
                viewport.width,
                rightStartingYs[startingYIndex + 1] - ribbonsInterstitialGutter,
            );
            const movingRibbonRenderer = createMovingRibbonRenderer({
                animationDurationScalar,
                animationStartingDirection: 'alternate-reverse',
                canvasContext,
                directionAngle: piAngle.toSubtracted(xAxisAdjacentAngle),
                fillStyle: styleSubject,
                getYLength: point => viewport.height - point.y,
                startingPointPair: [firstStartPoint, secondStartPoint],
                strokeStyle: styleSubject,
                xAxisAdjacentAngle,
            });
            const interpolationRenderer = createNumberTransitionRenderer({
                animationDuration: 1500 + Math.random() * 2000,
                animationIterationCount: Number.POSITIVE_INFINITY,
                animationStartingDirection: 'alternate',
                maximum: 1,
                minimum: 0,
                numberSubject: interpolatingPercentageSubject,
            });

            renderersByStartingTimeEntries.push([
                startingTime,
                movingRibbonRenderer,
            ]);
            renderersByStartingTimeEntries.push([
                startingTime,
                interpolationRenderer,
            ]);
        }
    }

    const handleCleanup: RendererCleanupCallback = () =>
        abortController.abort();

    return createCompositeRenderer({
        onCleanup: handleCleanup,
        renderersByStartingTimeEntries,
    });
}

function createCanvasContextStyleSubject({
    abortSignal,
    colorVariantSubject,
    complementaryColorVariantSubject,
    interpolatingPercentageSubject,
}: {
    abortSignal: AbortSignal;
    colorVariantSubject: Subject<Color>;
    complementaryColorVariantSubject: Subject<Color>;
    interpolatingPercentageSubject: Subject<number>;
}): Subject<string> {
    return mapSubjects(
        [
            colorVariantSubject,
            complementaryColorVariantSubject,
            interpolatingPercentageSubject,
        ],
        (color, complementaryColor, interpolatingPercentage) =>
            color
                .toInterpolated(complementaryColor, interpolatingPercentage)
                .toString(),
        { abortSignal },
    );
}

export { createBackgroundRenderer };
