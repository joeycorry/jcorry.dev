import { App } from '~/common/components/App';
import type { JotaiStoreAtomSetValueParametersByName } from '~/common/utils/jotaiStore';
import { createJotaiStore } from '~/common/utils/jotaiStore';

export type PageProps = {
    jotaiStoreAtomSetValueParametersByName: JotaiStoreAtomSetValueParametersByName;
};

// eslint-disable-next-line import/no-default-export
export default function Page({
    jotaiStoreAtomSetValueParametersByName,
}: PageProps) {
    const jotaiStore = createJotaiStore(jotaiStoreAtomSetValueParametersByName);

    return <App jotaiStore={jotaiStore} />;
}
