import { App } from '~/common/components/App';
import type { JotaiStoreAtomSetValueParametersByName } from '~/common/utils/jotaiStore';
import { createJotaiStore } from '~/common/utils/jotaiStore';

export type PageProps = {
    jotaiStoreAtomSetValueParametersByName: JotaiStoreAtomSetValueParametersByName;
};

export function Page({ jotaiStoreAtomSetValueParametersByName }: PageProps) {
    const jotaiStore = createJotaiStore(jotaiStoreAtomSetValueParametersByName);

    return <App jotaiStore={jotaiStore} />;
}
