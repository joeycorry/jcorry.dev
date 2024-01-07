import '~/common/styles/App.css';

import { Provider as JotaiProvider } from 'jotai';
import type { ReactNode } from 'react';
import { memo, StrictMode } from 'react';

import type { JotaiStore } from '~/common/utils/jotaiStore';

import { AppContent } from './AppContent';

type AppProps = {
    jotaiStore: JotaiStore;
};

const App = memo(UnmemoizedApp);

function UnmemoizedApp({ jotaiStore }: AppProps): ReactNode {
    return (
        <StrictMode>
            <JotaiProvider store={jotaiStore}>
                <AppContent />
            </JotaiProvider>
        </StrictMode>
    );
}

export { App };
