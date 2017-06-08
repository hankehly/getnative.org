/**
 * video
 * get-native.com
 *
 * Created by henryehly on 2017/01/06.
 */

import { Entity } from './entity';
import { Speaker } from './speaker';
import { Language } from '../typings/language';
import { Subcategory } from './subcategory';
import { Entities } from './entities';
import { Transcript } from './transcript';

export interface Video extends Entity {
    description?: string;
    cued?: boolean;
    language?: Language;
    length?: number;
    liked?: boolean;
    like_count?: number;
    loop_count?: number;
    loop_velocity?: number;
    related_videos?: Entities<Video>;
    speaker?: Speaker;
    picture_url?: string;
    subcategory?: Subcategory;
    transcripts?: Entities<Transcript>;
    video_url?: string;
}
