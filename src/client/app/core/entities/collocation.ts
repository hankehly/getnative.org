/**
 * collocation
 * get-native.com
 *
 * Created by henryehly on 2016/12/29.
 */

import { Entity } from './entity';
import { UsageExamples } from './usage-examples';

export interface Collocation extends Entity {
    text: string;
    description: string;
    ipa_spelling: string;
    usage_examples: UsageExamples;
}
