import { useAtomValue, useSetAtom } from 'jotai';
import { memo, useCallback } from 'react';
import { Moon, Sun } from 'react-feather';

import { backgroundIsVisibleAtom } from '~/common/atoms/background';
import { shouldUseDarkModeAtom } from '~/common/atoms/shouldUseDarkMode';
import { useNoArgumentSetAtom } from '~/common/hooks/atom';
import { useColorVariantCssValuesByName } from '~/common/hooks/color';
import { getDelayedPromise } from '~/common/utils/async';

function useColorSchemeButtonClickHandler() {
    const setBackgroundIsVisible = useSetAtom(backgroundIsVisibleAtom);
    const toggleDarkMode = useNoArgumentSetAtom(shouldUseDarkModeAtom);

    return useCallback(async () => {
        setBackgroundIsVisible(false);
        await getDelayedPromise(400);
        toggleDarkMode();
    }, [setBackgroundIsVisible, toggleDarkMode]);
}

function UnmemoizedColorSchemeButton() {
    const backgroundIsVisible = useAtomValue(backgroundIsVisibleAtom);
    const shouldUseDarkMode = useAtomValue(shouldUseDarkModeAtom);
    const primaryColorCssValue =
        useColorVariantCssValuesByName()['--primary-color'];
    const handleColorSchemeButtonClick = useColorSchemeButtonClickHandler();
    const [title, Icon] = shouldUseDarkMode
        ? ['Enable Light Mode', Sun]
        : ['Enable Dark Mode', Moon];

    return (
        <button
            disabled={!backgroundIsVisible}
            title={title}
            onClick={handleColorSchemeButtonClick}
        >
            <Icon stroke={primaryColorCssValue} />
        </button>
    );
}

export const ColorSchemeButton = memo(UnmemoizedColorSchemeButton);
