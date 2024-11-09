import type { ReactNode } from 'react';
import { memo } from 'react';
import { GitHub } from 'react-feather';

import styles from '~/common/styles/GitHubLink.module.css';

const GitHubLink = memo(UnmemoizedGitHubLink);

function UnmemoizedGitHubLink(): ReactNode {
    return (
        <a
            className={styles['icon-button']}
            href="https://github.com/joeycorry/jcorry.dev"
            rel="noreferrer"
            target="_blank"
            title="View Code"
        >
            <GitHub />
        </a>
    );
}

export { GitHubLink };
