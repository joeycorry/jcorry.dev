import type { Color } from '~/common/lib/colors/color';

const descriptionMetaElementString =
    '<meta name="description" content="A personal website about Joey Corry">';

function createKeywordsMetaElementString(): string {
    const keywords = [
        'joey corry',
        'jcorry',
        'joey dev',
        'software engineer',
        'full stack',
        'jcorry projects',
        'frontend',
        'backend',
    ];

    return `<meta name="keywords" content="${keywords.join(', ')}">`;
}

type CreateThemeColorMetaElementStringParameter = { color: Color };

function createThemeColorMetaElementString({
    color,
}: CreateThemeColorMetaElementStringParameter): string {
    return `<meta name="theme-color" content="${color.toString()}">`;
}

type CreateMetaElementStringsParameter = { color: Color };

export function createMetaElementStrings({
    color,
}: CreateMetaElementStringsParameter): string[] {
    return [
        descriptionMetaElementString,
        createKeywordsMetaElementString(),
        createThemeColorMetaElementString({ color }),
    ];
}

export function setThemeColor(color: Color) {
    const themeColorMetaElement =
        window.document.head.querySelector<HTMLMetaElement>(
            'meta[name="theme-color"]',
        );

    if (!themeColorMetaElement) {
        throw new Error('Theme color meta element not found');
    }

    themeColorMetaElement.content = color.toString();
}
