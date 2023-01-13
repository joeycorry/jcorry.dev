import Color from 'common/lib/color';

type GetFaviconParameter = {
    color: Color;
};

export function setFavicon({ color }: GetFaviconParameter) {
    const canvasElement = document.createElement('canvas');
    const canvasContext = canvasElement.getContext('2d')!;
    canvasElement.width = 24;
    canvasElement.height = 24;

    canvasContext.fillStyle = color.toString();
    canvasContext.fill(new Path2D('M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z'));

    const faviconElement = (document.head.querySelector('link[rel="icon"]') ||
        document.createElement('link')) as HTMLLinkElement;

    if (!document.head.contains(faviconElement)) {
        faviconElement.rel = 'icon';
        faviconElement.type = 'image/png';

        document.head.appendChild(faviconElement);
    }

    faviconElement.href = canvasElement.toDataURL(faviconElement.type);
}
