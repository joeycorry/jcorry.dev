import { techNameDisplayDataAtom } from 'common/atoms/techName';
import { useAtomValue } from 'jotai';
import { memo } from 'react';

import styles from './Intro.module.css';

function Intro() {
    const { hiddenTechName, visibleTechName } = useAtomValue(
        techNameDisplayDataAtom
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

export default memo(Intro);
