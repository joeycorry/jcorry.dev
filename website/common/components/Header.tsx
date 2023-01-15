import { backgroundIsVisibleAtom } from 'common/atoms/background';
import { shouldUseDarkModeAtom } from 'common/atoms/shouldUseDarkMode';
import { techNameAnimationShouldRepeatAtom } from 'common/atoms/techName';
import * as AtomHooks from 'common/hooks/atom';
import * as ColorHooks from 'common/hooks/color';
import * as TechNameHooks from 'common/hooks/techName';
import * as AsyncUtils from 'common/utils/async';
import { useAtomValue, useSetAtom } from 'jotai';
import { useCallback } from 'react';
import { GitHub, Moon, Pause, Play, Sun } from 'react-feather';

import styles from './Header.module.css';

function usePlayPauseButtonClickListener() {
    const startAnimation = TechNameHooks.useAnimationStarter();
    const techNameAnimationShouldRepeat = useAtomValue(
        techNameAnimationShouldRepeatAtom
    );
    const toggleTechNameAnimationShouldRepeat = AtomHooks.useNoArgumentSetAtom(
        techNameAnimationShouldRepeatAtom
    );

    return useCallback(() => {
        if (!techNameAnimationShouldRepeat) {
            startAnimation();
        }

        toggleTechNameAnimationShouldRepeat();
    }, [
        startAnimation,
        techNameAnimationShouldRepeat,
        toggleTechNameAnimationShouldRepeat,
    ]);
}

function PlayPauseButton() {
    const techNameAnimationShouldRepeat = useAtomValue(
        techNameAnimationShouldRepeatAtom
    );
    const currentPrimaryColorString = ColorHooks.useCurrentPrimaryColorString();
    const onPlayPauseButtonClick = usePlayPauseButtonClickListener();
    const [title, Icon] = techNameAnimationShouldRepeat
        ? ['Pause Color Changes', Pause]
        : ['Initiate Color Changes', Play];

    return (
        <button title={title} onClick={onPlayPauseButtonClick}>
            <Icon stroke={currentPrimaryColorString} />
        </button>
    );
}

function useColorSchemeButtonClickListener() {
    const setBackgroundIsVisible = useSetAtom(backgroundIsVisibleAtom);
    const toggleDarkMode = AtomHooks.useNoArgumentSetAtom(
        shouldUseDarkModeAtom
    );

    return useCallback(async () => {
        setBackgroundIsVisible(false);
        await AsyncUtils.delay(400);
        toggleDarkMode();
    }, [setBackgroundIsVisible, toggleDarkMode]);
}

function ColorSchemeButton() {
    const backgroundIsVisible = useAtomValue(backgroundIsVisibleAtom);
    const shouldUseDarkMode = useAtomValue(shouldUseDarkModeAtom);
    const currentPrimaryColorString = ColorHooks.useCurrentPrimaryColorString();
    const onColorSchemeButtonClick = useColorSchemeButtonClickListener();
    const [title, Icon] = shouldUseDarkMode
        ? ['Enable Light Mode', Moon]
        : ['Enable Dark Mode', Sun];

    return (
        <button
            disabled={!backgroundIsVisible}
            title={title}
            onClick={onColorSchemeButtonClick}
        >
            <Icon stroke={currentPrimaryColorString} />
        </button>
    );
}

function GitHubLink() {
    const currentPrimaryColorString = ColorHooks.useCurrentPrimaryColorString();

    return (
        <a
            href="https://github.com/joeycorry/jcorry.dev"
            rel="noreferrer"
            target="_blank"
            title="View Code"
        >
            <GitHub stroke={currentPrimaryColorString} />
        </a>
    );
}

export default function Header() {
    return (
        <header className={styles.header}>
            <ul>
                <li>
                    <PlayPauseButton />
                </li>
                <li>
                    <ColorSchemeButton />
                </li>
                <li>
                    <GitHubLink />
                </li>
            </ul>
        </header>
    );
}
