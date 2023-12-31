import '~/common/styles/App.css';

import { Provider as JotaiProvider } from 'jotai';
import { memo, StrictMode } from 'react';

import type { JotaiStore } from '~/common/utils/jotaiStore';

import { AppContent } from './AppContent';

type UnmemoizedAppProps = {
    jotaiStore: JotaiStore;
};

function UnmemoizedApp({ jotaiStore }: UnmemoizedAppProps) {
    return (
        <StrictMode>
            <JotaiProvider store={jotaiStore}>
                <AppContent />
            </JotaiProvider>
        </StrictMode>
    );
}

export const App = memo(UnmemoizedApp);
