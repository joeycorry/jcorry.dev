import { useAtomValue } from 'jotai';
import { memo, useCallback } from 'react';
import { Moon, Sun } from 'react-feather';

import { backgroundIsVisibleAtom } from '~/common/atoms/background';
import { shouldUseDarkModeAtom } from '~/common/atoms/shouldUseDarkMode';
import { useNoArgumentSetAtom } from '~/common/hooks/atom';

function useColorSchemeButtonClickHandler() {
    const toggleDarkMode = useNoArgumentSetAtom(shouldUseDarkModeAtom);

    return useCallback(() => {
        toggleDarkMode();
    }, [toggleDarkMode]);
}

function UnmemoizedColorSchemeButton() {
    const backgroundIsVisible = useAtomValue(backgroundIsVisibleAtom);
    const shouldUseDarkMode = useAtomValue(shouldUseDarkModeAtom);
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
            <Icon />
        </button>
    );
}

export const ColorSchemeButton = memo(UnmemoizedColorSchemeButton);
