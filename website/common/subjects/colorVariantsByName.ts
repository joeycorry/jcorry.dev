import { Subject } from '~/common/lib/subject';
import type { ColorVariantsByName } from '~/common/utils/color';

export const colorVariantsByNameSubject = new Subject<ColorVariantsByName>();
