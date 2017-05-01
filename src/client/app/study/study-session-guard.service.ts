/**
 * study-session-guard.service
 * get-native.com
 *
 * Created by henryehly on 2017/05/01.
 */

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';

import { StudySessionService } from '../core/study-session/study-session.service';
import { StudyComponent } from './study.component';
import { Logger } from '../core/logger/logger';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class StudySessionGuard implements CanDeactivate<StudyComponent> {
    constructor(private logger: Logger, private session: StudySessionService) {
    }

    canDeactivate(component: StudyComponent,
                  currentRoute: ActivatedRouteSnapshot,
                  currentState: RouterStateSnapshot,
                  nextState?: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        this.logger.debug(this, 'canDeactivate');
        this.session.end();
        return true;
    }
}
