import { memo } from 'react';

import * as ColorHooks from '~/common/hooks/color';
import * as FaviconHooks from '~/common/hooks/favicon';
import * as ShouldUseDarkModeHooks from '~/common/hooks/shouldUseDarkMode';
import * as TechNameHooks from '~/common/hooks/techName';
import * as ViewportHooks from '~/common/hooks/viewport';

import styles from './AppContent.module.css';
import Background from './Background';
import Header from './Header';
import Intro from './Intro';

function App() {
    ShouldUseDarkModeHooks.useEffects();
    ColorHooks.useEffects();
    FaviconHooks.useEffects();
    TechNameHooks.useEffects();
    ViewportHooks.useEffects();

    return (
        <main className={styles['app-content']}>
            <Background />
            <Header />
            <Intro />
        </main>
    );
}

export default memo(App);
