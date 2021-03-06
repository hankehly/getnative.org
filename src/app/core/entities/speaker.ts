/**
 * speaker
 * getnative.org
 *
 * Created by henryehly on 2016/12/24.
 */

import { Entity } from './entity';
import { LanguageCode } from '../typings/language-code';
import { Gender } from '../typings/gender';

export interface Speaker extends Entity {
    description?: string;
    name: string;
    lang?: LanguageCode;
    gender?: Gender;
    location?: string;
    picture_url?: string;
}
