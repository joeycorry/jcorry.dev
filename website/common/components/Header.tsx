import { memo } from 'react';

import { ColorSchemeButton } from './ColorSchemeButton';
import { GitHubLink } from './GitHubLink';
import styles from './Header.module.css';
import { PlayPauseButton } from './PlayPauseButton';

function UnmemoizedHeader() {
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

export const Header = memo(UnmemoizedHeader);
