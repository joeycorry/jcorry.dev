import { memo } from 'react';

import styles from '~/common/styles/Intro.module.css';

function UnmemoizedIntro() {
    return (
        <section className={styles.intro}>
            <h1>
                Hi, I&apos;m{' '}
                <span className={styles['intro-name']}>Joey Corry</span>.
            </h1>
        </section>
    );
}

export const Intro = memo(UnmemoizedIntro);
