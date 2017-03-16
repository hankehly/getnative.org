/**
 * speaker
 * get-native.com
 *
 * Created by henryehly on 2016/12/24.
 */

import { Entity } from './entity';
import { LangCode } from '../typings/lang-code';
import { Gender } from '../typings/gender';

export interface Speaker extends Entity {
    description?: string;
    name: string;
    lang?: LangCode;
    gender?: Gender;
    location?: string;
    thumbnail_image_url?: string;
}
