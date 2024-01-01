import { App } from '~/common/components/App';
import type { JotaiStoreAtomSetValueParametersByName } from '~/common/utils/jotaiStore';
import { createJotaiStore } from '~/common/utils/jotaiStore';

type PageProps = {
    jotaiStoreAtomSetValueParametersByName: JotaiStoreAtomSetValueParametersByName;
};

function Page({ jotaiStoreAtomSetValueParametersByName }: PageProps) {
    const jotaiStore = createJotaiStore(jotaiStoreAtomSetValueParametersByName);

    return <App jotaiStore={jotaiStore} />;
}

export type { PageProps };
// eslint-disable-next-line import/no-default-export
export default Page;
