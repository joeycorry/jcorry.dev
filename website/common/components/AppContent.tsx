import type { ReactNode } from 'react';
import { memo } from 'react';

import { useColorEffects } from '~/common/hooks/color';
import { useTechNameEffects } from '~/common/hooks/techName';
import { useViewportEffects } from '~/common/hooks/viewport';
import styles from '~/common/styles/AppContent.module.css';

import { Background } from './Background';
import { Header } from './Header';
import { Intro } from './Intro';

const AppContent = memo(UnmemoizedAppContent);

function UnmemoizedAppContent(): ReactNode {
    useColorEffects();
    useTechNameEffects();
    useViewportEffects();

    return (
        <main className={styles['app-content']}>
            <Background />
            <Header />
            <Intro />
        </main>
    );
}

export { AppContent };
