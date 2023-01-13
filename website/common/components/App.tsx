import * as ColorHooks from 'common/hooks/color';
import * as FaviconHooks from 'common/hooks/favicon';
import * as ShouldUseDarkModeHooks from 'common/hooks/shouldUseDarkMode';
import * as TechNameHooks from 'common/hooks/techName';
import * as ViewportHooks from 'common/hooks/viewport';

import styles from './App.module.css';
import Background from './Background';
import Header from './Header';
import Intro from './Intro';

export default function App() {
    ShouldUseDarkModeHooks.useEffects();
    ColorHooks.useEffects();
    FaviconHooks.useEffects();
    TechNameHooks.useEffects();
    ViewportHooks.useEffects();

    return (
        <main className={styles.app}>
            <Background />
            <Header />
            <Intro />
        </main>
    );
}
