import { useAtomValue } from 'jotai';
import { memo } from 'react';

import { techNameDisplayDataAtom } from '~/common/atoms/techName';
import styles from '~/common/styles/Intro.module.css';

function UnmemoizedIntro() {
    const { hiddenTechName, visibleTechName } = useAtomValue(
        techNameDisplayDataAtom,
    );

    return (
        <section className={styles.intro}>
            <h1>Joey Corry</h1>
            <h6>
                <span
                    className={styles['tech-name']}
                    data-hidden-tech-name={hiddenTechName}
                >
                    {visibleTechName}
                </span>{' '}
                <span className={styles['job-title']}>Engineer</span>
            </h6>
        </section>
    );
}

export const Intro = memo(UnmemoizedIntro);
