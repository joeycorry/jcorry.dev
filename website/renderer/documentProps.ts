import type { CustomPageContext } from './types';

export function createHtmlAttributesString({
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

export function createFaviconElementString({
    pageContext: { documentProps },
}: {
    pageContext: CustomPageContext;
}): string {
    return (
        documentProps?.faviconElementString ??
        '<link rel="icon" href="data:image/x-icon;," type="image/x-icon">'
    );
}

export function createMetaElementStrings({
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

export function createTitleElementString({
    pageContext: { documentProps },
}: {
    pageContext: CustomPageContext;
}): string {
    const title = documentProps?.title ?? '';

    return `<title>${title}</title>`;
}
