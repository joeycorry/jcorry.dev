import { memo } from 'react';

import { useColorEffects } from '~/common/hooks/color';
import { useFaviconEffects } from '~/common/hooks/favicon';
import { useShouldUseDarkModeEffects } from '~/common/hooks/shouldUseDarkMode';
import { useTechNameEffects } from '~/common/hooks/techName';
import { useViewportEffects } from '~/common/hooks/viewport';

import styles from './AppContent.module.css';
import { Background } from './Background';
import { Header } from './Header';
import { Intro } from './Intro';

function UnmemoizedAppContent() {
    useShouldUseDarkModeEffects();
    useColorEffects();
    useFaviconEffects();
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

export const AppContent = memo(UnmemoizedAppContent);
