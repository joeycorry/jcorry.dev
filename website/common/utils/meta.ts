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

function createMetaElementStrings({ color }: { color: Color }): string[] {
    return [
        descriptionMetaElementString,
        createKeywordsMetaElementString(),
        createThemeColorMetaElementString({ color }),
    ];
}

function createThemeColorMetaElementString({
    color,
}: {
    color: Color;
}): string {
    return `<meta name="theme-color" content="${color.toString()}">`;
}

function setThemeColor(color: Color): void {
    const themeColorMetaElement =
        window.document.head.querySelector<HTMLMetaElement>(
            'meta[name="theme-color"]',
        );

    if (!themeColorMetaElement) {
        throw new Error('Theme color meta element not found');
    }

    themeColorMetaElement.content = color.toString();
}

export { createMetaElementStrings, setThemeColor };
