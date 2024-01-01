import type { CustomPageContext } from './types';

function createFaviconElementString({
    pageContext: { documentProps },
}: {
    pageContext: CustomPageContext;
}): string {
    return (
        documentProps?.faviconElementString ??
        '<link rel="icon" href="data:image/x-icon;," type="image/x-icon">'
    );
}

function createHtmlAttributesString({
    pageContext: { documentProps },
}: {
    pageContext: CustomPageContext;
}): string {
    const htmlAttributes = documentProps?.htmlAttributes ?? {};

    return Object.entries(htmlAttributes)
        .map(([attribute, value]) =>
            value === undefined ? attribute : `${attribute}="${value}"`,
        )
        .join(' ');
}

function createMetaElementStrings({
    pageContext: { documentProps },
}: {
    pageContext: CustomPageContext;
}): string[] {
    return [
        '<meta charset="UTF-8" />',
        '<meta name="viewport" content="width=device-width, initial-scale=1.0" />',
        ...(documentProps?.metaElementStrings ?? []),
    ];
}

function createTitleElementString({
    pageContext: { documentProps },
}: {
    pageContext: CustomPageContext;
}): string {
    const title = documentProps?.title ?? '';

    return `<title>${title}</title>`;
}

export {
    createFaviconElementString,
    createHtmlAttributesString,
    createMetaElementStrings,
    createTitleElementString,
};
