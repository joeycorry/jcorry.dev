function setRootElementCssVariable({
    cssVariableName,
    cssValue,
}: {
    cssVariableName: string;
    cssValue: string;
}) {
    window.document.documentElement.style.setProperty(
        cssVariableName,
        cssValue,
    );
}

export { setRootElementCssVariable };
