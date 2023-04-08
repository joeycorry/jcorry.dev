import { memo } from 'react';
import { GitHub } from 'react-feather';

import { useColorVariantCssValuesByName } from '~/common/hooks/color';

function UnmemoizedGitHubLink() {
    const primaryColorCssValue =
        useColorVariantCssValuesByName()['--primary-color'];

    return (
        <a
            href="https://github.com/joeycorry/jcorry.dev"
            rel="noreferrer"
            target="_blank"
            title="View Code"
        >
            <GitHub stroke={primaryColorCssValue} />
        </a>
    );
}

export const GitHubLink = memo(UnmemoizedGitHubLink);
