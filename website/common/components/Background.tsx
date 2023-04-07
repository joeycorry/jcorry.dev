import { useAtomValue } from 'jotai';
import { memo, useRef } from 'react';

import { backgroundIsVisibleAtom } from '~/common/atoms/background';
import * as BackgroundHooks from '~/common/hooks/background';
import * as RendererManagerHooks from '~/common/hooks/rendererManager';

import styles from './Background.module.css';

function Background() {
    const isVisible = useAtomValue(backgroundIsVisibleAtom);
    const canvasElementRef = useRef<HTMLCanvasElement>(null);

    RendererManagerHooks.useEffects();
    BackgroundHooks.useEffects({ canvasElementRef });

    return (
        <canvas
            ref={canvasElementRef}
            id="background"
            className={styles.background}
            data-is-visible={isVisible.toString()}
        />
    );
}

export default memo(Background);
