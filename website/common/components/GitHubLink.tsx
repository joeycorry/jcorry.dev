import { memo } from 'react';
import { GitHub } from 'react-feather';

function UnmemoizedGitHubLink() {
    return (
        <a
            href="https://github.com/joeycorry/jcorry.dev"
            rel="noreferrer"
            target="_blank"
            title="View Code"
        >
            <GitHub />
        </a>
    );
}

export const GitHubLink = memo(UnmemoizedGitHubLink);
