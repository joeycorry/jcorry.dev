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

export function getTechNameIndex({ techName }: { techName: TechName }) {
    return techNames.indexOf(techName);
}

function getNextTechNameIndex({
    currentTechName,
}: {
    currentTechName: TechName;
}) {
    return modulo(
        getTechNameIndex({ techName: currentTechName }) + 1,
        techNames.length,
    );
}

export function getNextTechName({
    currentTechName,
}: {
    currentTechName: TechName;
}) {
    return techNames[getNextTechNameIndex({ currentTechName })];
}

export function getRandomTechName() {
    return getRandomArrayElement(techNames);
}
