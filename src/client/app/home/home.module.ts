/**
 * home.module
 * get-native.com
 *
 * Created by henryehly on 2016/11/06.
 */

import { NgModule } from '@angular/core';

import { HomeComponent } from './home.component';
import { FeatureDescriptionService } from './feature-description/feature-description.service';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    imports: [SharedModule, HomeRoutingModule],
    declarations: [HomeComponent],
    exports: [HomeComponent],
    providers: [FeatureDescriptionService]
})

export class HomeModule {
}
