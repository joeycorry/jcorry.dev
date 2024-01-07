import { useAtom, useAtomValue } from 'jotai';
import type { ReactNode } from 'react';
import { memo, useCallback } from 'react';
import { Moon, Sun } from 'react-feather';

import { backgroundIsVisibleAtom } from '~/common/atoms/background';
import { colorSchemeAtom } from '~/common/atoms/color';
import styles from '~/common/styles/ColorSchemeButton.module.css';

const ColorSchemeButton = memo(UnmemoizedColorSchemeButton);

function useColorSchemeButtonClickHandler(): () => void {
    const [colorScheme, setColorScheme] = useAtom(colorSchemeAtom);

    return useCallback(() => {
        setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
    }, [colorScheme, setColorScheme]);
}

function UnmemoizedColorSchemeButton(): ReactNode {
    const backgroundIsVisible = useAtomValue(backgroundIsVisibleAtom);
    const colorScheme = useAtomValue(colorSchemeAtom);
    const handleColorSchemeButtonClick = useColorSchemeButtonClickHandler();
    const [title, Icon] =
        colorScheme === 'dark'
            ? ['Enable Light Mode', Sun]
            : ['Enable Dark Mode', Moon];

    return (
        <button
            className={styles['icon-button']}
            disabled={!backgroundIsVisible}
            title={title}
            onClick={handleColorSchemeButtonClick}
        >
            <Icon />
        </button>
    );
}

export { ColorSchemeButton };
