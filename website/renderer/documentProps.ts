import type { CustomPageContext } from './types';

type CreateHtmlAttributesStringParameter = {
    pageContext: CustomPageContext;
};

export function createHtmlAttributesString({
    pageContext: { documentProps },
}: CreateHtmlAttributesStringParameter): string {
    const htmlAttributes = documentProps?.htmlAttributes ?? {};

    return Object.entries(htmlAttributes)
        .map(([attribute, value]) =>
            value === undefined ? attribute : `${attribute}="${value}"`,
        )
        .join(' ');
}

type CreateFaviconElementStringParameter = {
    pageContext: CustomPageContext;
};

export function createFaviconElementString({
    pageContext: { documentProps },
}: CreateFaviconElementStringParameter): string {
    return (
        documentProps?.faviconElementString ??
        '<link rel="icon" href="data:image/x-icon;," type="image/x-icon">'
    );
}

type CreateMetaElementStringsParameter = {
    pageContext: CustomPageContext;
};

export function createMetaElementStrings({
    pageContext: { documentProps },
}: CreateMetaElementStringsParameter): string[] {
    return [
        '<meta charset="UTF-8" />',
        '<meta name="viewport" content="width=device-width, initial-scale=1.0" />',
        ...(documentProps?.metaElementStrings ?? []),
    ];
}

type CreateTitleElementStringParameter = {
    pageContext: CustomPageContext;
};

export function createTitleElementString({
    pageContext: { documentProps },
}: CreateTitleElementStringParameter): string {
    const title = documentProps?.title ?? '';

    return `<title>${title}</title>`;
}
