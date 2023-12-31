type SetRootElementCssVariableParameter = {
    cssVariableName: string;
    cssValue: string;
};

export function setRootElementCssVariable({
    cssVariableName,
    cssValue,
}: SetRootElementCssVariableParameter) {
    window.document.documentElement.style.setProperty(
        cssVariableName,
        cssValue,
    );
}
