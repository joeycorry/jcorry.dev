import { Observable } from '~/common/lib/observable';
import type { ColorVariantsByName } from '~/common/utils/color';

export const colorVariantsByNameObservable =
    new Observable<ColorVariantsByName>();
