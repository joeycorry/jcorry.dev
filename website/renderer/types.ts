import type { H3Event } from 'h3';
import type { ReactElement } from 'react';
import type {
    PageContextBuiltInClientWithServerRouting,
    PageContextBuiltInServer,
} from 'vike/types';

export type DocumentProps = {
    faviconElementString?: string;
    htmlAttributes?: Record<string, string | undefined>;
    metaElementStrings?: string[];
    title: string;
};

type Page<PageProps extends Record<string, unknown> = Record<string, unknown>> =
    (pageProps: PageProps) => ReactElement;

export type CustomPageContext<
    PageProps extends Record<string, unknown> = Record<string, unknown>,
> = {
    Page: Page<PageProps>;
    documentProps?: DocumentProps;
    pageProps?: PageProps;
};

export type ServerPageContext<
    PageProps extends Record<string, unknown> = Record<string, unknown>,
> = PageContextBuiltInServer<Page<PageProps>> &
    CustomPageContext<PageProps> & {
        originalEvent: H3Event;
    };

export type ServerOnBeforeRenderResult<
    PageProps extends Record<string, unknown> = Record<string, unknown>,
> = { pageContext: Partial<ServerPageContext<PageProps>> };

export type ClientPageContext<
    PageProps extends Record<string, unknown> = Record<string, unknown>,
> = PageContextBuiltInClientWithServerRouting<Page<PageProps>> &
    CustomPageContext<PageProps>;
