import { memo } from 'react';

import { ColorSchemeButton } from './ColorSchemeButton';
import { GitHubLink } from './GitHubLink';
import styles from './Header.module.css';

function UnmemoizedHeader() {
    return (
        <header className={styles.header}>
            <ul>
                <li>
                    <GitHubLink />
                </li>
                <li className="color-scheme">
                    <ColorSchemeButton />
                </li>
            </ul>
        </header>
    );
}

export const Header = memo(UnmemoizedHeader);
