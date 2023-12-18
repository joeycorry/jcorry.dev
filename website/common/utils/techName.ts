import {
    getArrayElementAtModuloReducedIndex,
    getRandomArrayElement,
} from './array';

const presetTechNames = [
    'JavaScript',
    'Ruby',
    'TypeScript',
    'React',
    'Rails',
    'Node',
] as const;

export type TechNameAnimationData = {
    animationStatus: 'backspacing' | 'paused' | 'typing';
    visibleLength: number;
};

export type TechName = (typeof presetTechNames)[number];

type TechNameAnimationIsFinishedParameter = {
    animationData: TechNameAnimationData;
    techName: TechName;
};

export function techNameAnimationIsFinished({
    animationData: { animationStatus, visibleLength },
    techName,
}: TechNameAnimationIsFinishedParameter) {
    return animationStatus === 'paused' && visibleLength === techName.length;
}

export function techNameAnimationIsWaitingForNewTechName({
    animationStatus,
    visibleLength,
}: TechNameAnimationData) {
    return animationStatus === 'paused' && visibleLength === 0;
}

type GetTechNameAnimationStepTimeParameter = {
    animationData: TechNameAnimationData;
    techName: TechName;
};

export function getTechNameAnimationStepTime({
    animationData: { animationStatus },
    techName,
}: GetTechNameAnimationStepTimeParameter) {
    if (animationStatus === 'backspacing') {
        return 400 / techName.length;
    } else if (animationStatus === 'typing') {
        return 700 / techName.length;
    }

    return 100;
}

export function getNextTechName(techName: TechName) {
    const currentIndex = presetTechNames.findIndex(
        techName_ => techName === techName_,
    );

    if (currentIndex === -1) {
        throw new Error(`Invalid tech name: ${techName}`);
    }

    return getArrayElementAtModuloReducedIndex(
        presetTechNames,
        currentIndex + 1,
    )!;
}

export function getRandomTechName() {
    return getRandomArrayElement(presetTechNames);
}
