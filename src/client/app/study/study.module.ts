/**
 * study.module
 * get-native.com
 *
 * Created by henryehly on 2016/12/11.
 */

import { NgModule } from '@angular/core';

import { StudyComponent } from './study.component';
import { SharedModule } from '../shared/shared.module';
import { StudyRoutingModule } from './study-routing.module';
import { ListeningComponent } from './listening/listening.component';
import { ShadowingComponent } from './shadowing/shadowing.component';
import { SpeakingComponent } from './speaking/speaking.component';

@NgModule({
    imports: [SharedModule, StudyRoutingModule],
    declarations: [StudyComponent, ListeningComponent, ShadowingComponent, SpeakingComponent]
})
export class StudyModule {
}
