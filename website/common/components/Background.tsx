import { backgroundIsVisibleAtom } from 'common/atoms/background';
import * as BackgroundHooks from 'common/hooks/background';
import * as CanvasRendererManagerHooks from 'common/hooks/canvasRendererManager';
import { useAtomValue } from 'jotai';
import { useRef } from 'react';

import styles from './Background.module.css';

export default function Background() {
    const isVisible = useAtomValue(backgroundIsVisibleAtom);
    const canvasElementRef = useRef<HTMLCanvasElement>(null);

    CanvasRendererManagerHooks.useEffects({ canvasElementRef });
    BackgroundHooks.useEffects({ canvasElementRef });

    return (
        <canvas
            ref={canvasElementRef}
            className={styles.background}
            data-is-visible={isVisible.toString()}
        />
    );
}
