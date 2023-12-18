import { Renderer } from '~/common/lib/renderer';
import type { Subject } from '~/common/lib/subject';
import type { Bounds } from '~/common/utils/bounded';
import type { RendererOptions } from '~/common/utils/renderer';

type CreateNumberTransitionRendererParameter = {
    numberSubject: Subject<number>;
    range: Bounds;
} & RendererOptions;

export function createNumberTransitionRenderer({
    numberSubject,
    range,
    ...rendererOptions
}: CreateNumberTransitionRendererParameter) {
    const intervalMagnitude = range.maximum - range.minimum;

    return new Renderer(
        ({ currentAnimationPercentage }) => [
            () =>
                numberSubject.set(
                    currentAnimationPercentage * intervalMagnitude +
                        range.minimum,
                ),
        ],
        rendererOptions,
    );
}
