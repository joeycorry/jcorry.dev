import type { Color } from '~/common/lib/colors/color';

function createFaviconDataUrl({ color }: { color: Color }): string {
    const canvasElement = window.document.createElement('canvas');
    const canvasContext = canvasElement.getContext('2d')!;
    const raindropPath = new Path2D('M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z');

    canvasElement.width = 24;
    canvasElement.height = 24;
    canvasContext.fillStyle = color.toString();

    canvasContext.fill(raindropPath);

    return canvasElement.toDataURL('image/png');
}

function createFaviconElementString({ color }: { color: Color }): string {
    if (import.meta.env.SSR) {
        return `<link rel="icon" type="image/x-icon" href="data:image/x-icon;,">`;
    }

    const dataUrl = createFaviconDataUrl({ color });

    return `<link rel="icon" type="image/png" href="${dataUrl}">`;
}

function setFaviconColor(color: Color) {
    const faviconElement =
        window.document.head.querySelector<HTMLLinkElement>('link[rel="icon"]');

    if (!faviconElement) {
        throw new Error('Favicon element not found');
    }

    if (faviconElement.type !== 'image/png') {
        faviconElement.type = 'image/png';
    }

    faviconElement.href = createFaviconDataUrl({ color });
}

export { createFaviconElementString, setFaviconColor };
