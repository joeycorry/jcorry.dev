import '~/common/styles/App.css';

import { Provider as JotaiProvider } from 'jotai';
import { memo, StrictMode } from 'react';

import { useAppEffects } from '~/common/hooks/app';
import type { JotaiStore } from '~/common/utils/jotaiStore';

import { AppContent } from './AppContent';

type UnmemoizedAppProps = {
    jotaiStore: JotaiStore;
};

function UnmemoizedApp({ jotaiStore }: UnmemoizedAppProps) {
    useAppEffects();

    return (
        <StrictMode>
            <JotaiProvider store={jotaiStore}>
                <AppContent />
            </JotaiProvider>
        </StrictMode>
    );
}

export const App = memo(UnmemoizedApp);
