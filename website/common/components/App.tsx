import { Provider as JotaiProvider } from 'jotai';
import { StrictMode } from 'react';

import type * as JotaiUtils from '~/common/utils/jotai';

import AppContent from './AppContent';

type CreateJotaiStoreParameter = {
    jotaiStore: JotaiUtils.JotaiStore;
};

export type AppProps = CreateJotaiStoreParameter;

export default function App({ jotaiStore }: AppProps) {
    return (
        <StrictMode>
            <JotaiProvider store={jotaiStore}>
                <AppContent />
            </JotaiProvider>
        </StrictMode>
    );
}
