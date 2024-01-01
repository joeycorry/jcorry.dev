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

function getNextTechName({ currentTechName }: { currentTechName: TechName }) {
    return techNames[getNextTechNameIndex({ currentTechName })];
}

function getRandomTechName() {
    return getRandomArrayElement(techNames);
}

function getTechNameIndex({ techName }: { techName: TechName }) {
    return techNames.indexOf(techName);
}

export type { TechName };
export { getNextTechName, getRandomTechName, getTechNameIndex, techNames };
