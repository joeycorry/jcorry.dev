import type { ReactNode } from 'react';
import { memo } from 'react';

import styles from '~/common/styles/Intro.module.css';

const Intro = memo(UnmemoizedIntro);

function UnmemoizedIntro(): ReactNode {
    return (
        <section className={styles.intro}>
            <h1>
                Hi, I&apos;m{' '}
                <span className={styles['intro-name']}>Joey Corry</span>!
            </h1>
        </section>
    );
}

export { Intro };
