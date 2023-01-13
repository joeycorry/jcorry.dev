import type * as AtomUtils from 'common/utils/atom';
import type * as ColorUtils from 'common/utils/color';
import type { ReactElement } from 'react';
import type { PageContextBuiltIn } from 'vite-plugin-ssr';
import type { PageContextBuiltInClient } from 'vite-plugin-ssr/client';

export type PageProps = {
    valuesByBaseAtomName: AtomUtils.ValuesByBaseAtomName;
};

type Page = (pageProps: PageProps) => ReactElement;

export type CustomCommonPageContext = {
    pageProps: PageProps;
};

export type CustomClientPageContext = CustomCommonPageContext;

export type CustomServerPageContext = CustomCommonPageContext & {
    colorCssVariablesByName: ColorUtils.CssVariablesByName;
};

export type ClientPageContext = PageContextBuiltInClient<Page> &
    CustomClientPageContext;

export type ServerPageContext = PageContextBuiltIn<Page> &
    CustomServerPageContext;

export type ServerPageContextInit = {
    requestCookie: string;
    urlOriginal?: string;
};
