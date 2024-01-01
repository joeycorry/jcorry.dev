function setRootElementCssVariable({
    cssValue,
    cssVariableName,
}: {
    cssValue: string;
    cssVariableName: string;
}) {
    window.document.documentElement.style.setProperty(
        cssVariableName,
        cssValue,
    );
}

export { setRootElementCssVariable };
