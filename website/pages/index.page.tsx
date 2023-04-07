import App from '~/common/components/App';
import * as JotaiUtils from '~/common/utils/jotai';

export type PageProps = {
    jotaiStoreSetParametersByName: JotaiUtils.JotaiStoreSetParametersByName;
};

export function Page({ jotaiStoreSetParametersByName }: PageProps) {
    const jotaiStore = JotaiUtils.createJotaiStore(
        jotaiStoreSetParametersByName
    );

    return <App jotaiStore={jotaiStore} />;
}
