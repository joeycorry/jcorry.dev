import { memo } from 'react';

import styles from '~/common/styles/Header.module.css';

import { ColorSchemeButton } from './ColorSchemeButton';

const Header = memo(UnmemoizedHeader);

function UnmemoizedHeader() {
    return (
        <header className={styles.header}>
            <ul>
                <li className={styles['color-scheme-li']}>
                    <ColorSchemeButton />
                </li>
            </ul>
        </header>
    );
}

export { Header };
