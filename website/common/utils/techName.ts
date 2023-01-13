import * as ArrayUtils from './array';

const techNames = [
    'JavaScript',
    'Ruby',
    'TypeScript',
    'React',
    'Rails',
    'Node',
] as const;

export type AnimationData = {
    animationStatus: 'backspacing' | 'paused' | 'typing';
    visibleLength: number;
};

export type TechName = (typeof techNames)[number];

type AnimationIsFinishedParameter = {
    animationData: AnimationData;
    techName: TechName;
};

export function animationIsFinished({
    animationData: { animationStatus, visibleLength },
    techName,
}: AnimationIsFinishedParameter) {
    return animationStatus === 'paused' && visibleLength === techName.length;
}

export function animationIsWaitingForNewTechName({
    animationStatus,
    visibleLength,
}: AnimationData) {
    return animationStatus === 'paused' && visibleLength === 0;
}

type GetAnimationStepTimeParameter = {
    animationData: AnimationData;
    techName: TechName;
};

export function getAnimationStepTime({
    animationData: { animationStatus },
    techName,
}: GetAnimationStepTimeParameter) {
    if (animationStatus === 'backspacing') {
        return 400 / techName.length;
    } else if (animationStatus === 'typing') {
        return 700 / techName.length;
    }

    return 100;
}

export function getNextTechName(techName: TechName) {
    return ArrayUtils.moduloReducedAt(
        techNames,
        techNames.findIndex(techName_ => techName === techName_) + 1
    )!;
}

export function getRandomTechName() {
    return ArrayUtils.getRandomElement(techNames);
}
