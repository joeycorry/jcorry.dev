import { getRandomArrayElement } from './array';
import { modulo } from './math';

export const techNames = [
    'TypeScript',
    'JavaScript',
    'Ruby',
    'React',
    'Rails',
] as const;

export type TechName = (typeof techNames)[number];

type GetTechNameIndexParameter = { techName: TechName };

export function getTechNameIndex({ techName }: GetTechNameIndexParameter) {
    return techNames.indexOf(techName);
}

type GetNextTechNameIndexParameter = { currentTechName: TechName };

function getNextTechNameIndex({
    currentTechName,
}: GetNextTechNameIndexParameter) {
    return modulo(
        getTechNameIndex({ techName: currentTechName }) + 1,
        techNames.length,
    );
}

type GetNextTechNameParameter = { currentTechName: TechName };

export function getNextTechName({ currentTechName }: GetNextTechNameParameter) {
    return techNames[getNextTechNameIndex({ currentTechName })];
}

export function getRandomTechName() {
    return getRandomArrayElement(techNames);
}
