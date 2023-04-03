import type { CustomPageContext } from './types';

export function getDefaultStyleString({
    documentProps,
    exports,
}: CustomPageContext): string {
    return (
        documentProps?.defaultStyle ?? exports.documentProps?.defaultStyle ?? ''
    );
}

export function getHtmlAttributesString({
    documentProps,
    exports,
}: CustomPageContext): string {
    const htmlAttributes = {
        ...(exports.documentProps?.htmlAttributes ?? {}),
        ...(documentProps?.htmlAttributes ?? {}),
    };

    return Object.entries(htmlAttributes)
        .map(([attribute, value]) =>
            value === undefined ? attribute : `${attribute}="${value}"`
        )
        .join(' ');
}

export function getTitleString({
    documentProps,
    exports,
}: CustomPageContext): string {
    return documentProps?.title ?? exports.documentProps?.title ?? '';
}
