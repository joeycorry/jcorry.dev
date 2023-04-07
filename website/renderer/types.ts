import type { Request } from 'express';
import type { ReactElement } from 'react';
import type {
    PageContextBuiltIn,
    PageContextBuiltInClientWithServerRouting,
} from 'vite-plugin-ssr/types';

export type DocumentProps = {
    defaultStyle?: string;
    htmlAttributes?: Record<string, string | undefined>;
    title: string;
};

type Page<PageProps extends Record<string, unknown> = Record<string, unknown>> =
    (pageProps: PageProps) => ReactElement;

export type CustomPageContext<
    PageProps extends Record<string, unknown> = Record<string, unknown>
> = {
    Page: Page<PageProps>;
    documentProps?: DocumentProps;
    exports: {
        documentProps?: DocumentProps;
    };
    pageProps?: PageProps;
};

export type ServerPageContext<
    PageProps extends Record<string, unknown> = Record<string, unknown>
> = PageContextBuiltIn<Page<PageProps>> &
    CustomPageContext<PageProps> & {
        originalRequest: Request;
    };

export type ServerOnBeforeRenderResult<
    PageProps extends Record<string, unknown> = Record<string, unknown>
> = { pageContext: Partial<ServerPageContext<PageProps>> };

export type ClientPageContext<
    PageProps extends Record<string, unknown> = Record<string, unknown>
> = PageContextBuiltInClientWithServerRouting<Page<PageProps>> & CustomPageContext<PageProps>;
