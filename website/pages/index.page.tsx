import App from 'common/components/App';
import AtomProvider from 'common/components/AtomProvider';
import { StrictMode } from 'react';
import * as RendererTypes from 'renderer/types';

type PageProps = RendererTypes.PageProps;

export function Page({ valuesByBaseAtomName }: PageProps) {
    return (
        <StrictMode>
            <AtomProvider valuesByBaseAtomName={valuesByBaseAtomName}>
                <App />
            </AtomProvider>
        </StrictMode>
    );
}
