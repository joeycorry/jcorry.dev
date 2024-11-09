import { getRandomArrayElement } from './array';
import { modulo } from './math';

type TechName = (typeof techNames)[number];

const techNames = [
    'TypeScript',
    'JavaScript',
    'Ruby',
    'React',
    'Rails',
] as const;

function getNextTechName(currentTechName: TechName): TechName {
    const nextTechNameIndex = modulo(
        techNames.indexOf(currentTechName) + 1,
        techNames.length,
    );

    return techNames[nextTechNameIndex];
}

function getRandomTechName(): TechName {
    return getRandomArrayElement(techNames);
}

export type { TechName };
export { getNextTechName, getRandomTechName, techNames };
