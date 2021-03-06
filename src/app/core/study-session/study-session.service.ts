/**
 * study-session.service
 * getnative.org
 *
 * Created by henryehly on 2017/04/30.
 */

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { LocalStorageService } from '../local-storage/local-storage.service';
import { kCurrentStudySession } from '../local-storage/local-storage-keys';
import { StudySessionSection } from '../typings/study-session-section';
import { StudySession } from '../entities/study-session';
import { NavbarService } from '../navbar/navbar.service';
import { HttpService } from '../http/http.service';
import { APIHandle } from '../http/api-handle';
import { Logger } from '../logger/logger';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import * as _ from 'lodash';

@Injectable()
export class StudySessionService {

    set current(value: any) {
        this.localStorage.setItem(kCurrentStudySession, value);
    }

    get current() {
        return this.localStorage.getItem(kCurrentStudySession);
    }

    get isComplete(): boolean {
        return this.current.session.is_completed;
    }

    get sectionName(): string {
        let name: string;
        switch (this.current.section) {
            case StudySessionSection.Listening:
                name = 'listening';
                break;
            case StudySessionSection.Shadowing:
                name = 'shadowing';
                break;
            case StudySessionSection.Speaking:
                name = 'speaking';
                break;
            case StudySessionSection.Writing:
                name = 'writing';
                break;
            default:
                break;
        }
        return name;
    }

    get secondsRemaining(): number {
        return this.timeLeftSource.getValue();
    }

    private timeLeftSource: BehaviorSubject<number>;
    timeLeftEmitted$: Observable<number>;

    private timerStoppedSource: Subject<void>;
    timerStoppedEmitted$: Observable<void>;

    private sectionTimerPausedSource: Subject<void>;
    sectionTimerPausedEmitted$: Observable<void>;

    private sectionTimerResumedSource: Subject<void>;
    sectionTimerResumedEmitted$: Observable<void>;

    private sectionTimer: NodeJS.Timer;

    constructor(private http: HttpService, private localStorage: LocalStorageService, private logger: Logger, private router: Router,
                private navbar: NavbarService) {
        this.timerStoppedSource = new Subject<void>();
        this.timerStoppedEmitted$ = this.timerStoppedSource.asObservable();

        this.timeLeftSource = new BehaviorSubject<number>(0);
        this.timeLeftEmitted$ = this.timeLeftSource.asObservable().takeUntil(this.timerStoppedEmitted$);

        this.sectionTimerPausedSource = new Subject<void>();
        this.sectionTimerPausedEmitted$ = this.sectionTimerPausedSource.asObservable();

        this.sectionTimerResumedSource = new Subject<void>();
        this.sectionTimerResumedEmitted$ = this.sectionTimerResumedSource.asObservable();
    }

    startSectionTimer(secondsRemaining?: number): void {
        let seconds = secondsRemaining || _.floor(this.current.session.study_time / 4);
        this.logger.debug(this, 'startSectionTimer', seconds);

        seconds--;
        this.timeLeftSource.next(seconds);

        this.sectionTimer = <NodeJS.Timer>setInterval(() => {
            seconds--;

            this.timeLeftSource.next(seconds);

            if (seconds === 0) {
                clearInterval(this.sectionTimer);
            }
        }, 1000);
    }

    stopSectionTimer(): void {
        this.logger.debug(this, 'stop section timer');
        clearInterval(this.sectionTimer);
        this.timerStoppedSource.next();
    }

    pauseSectionTimer(): void {
        this.logger.debug(this, 'pause section timer');
        clearInterval(this.sectionTimer);
        this.sectionTimerPausedSource.next();
    }

    resumeSectionTimer(): void {
        this.logger.debug(this, 'resume section timer');
        this.startSectionTimer(this.secondsRemaining);
        this.sectionTimerResumedSource.next();
    }

    resetSectionTimer(): void {
        this.logger.debug(this, 'resetSectionTimer');
        const timeLeft = _.floor(this.current.session.study_time / 4);
        this.timeLeftSource.next(timeLeft);
    }

    create(options: StudySession): Observable<any> {
        return this.http.request(APIHandle.START_STUDY_SESSION, {body: options}).do(this.onStartStudySession.bind(this));
    }

    transition(section: StudySessionSection) {
        this.updateCurrentSessionCache({section: section});
        this.router.navigate(['/study']);
    }

    updateCurrentSessionCache(value: any): void {
        this.logger.debug(this, 'will update this.current with value', this.current, value);
        const current = this.current;
        _.assign(current, value);
        this.current = current;
    }

    end(): void {
        this.logger.debug(this, 'ending study session');
        this.navbar.hideProgressBar();
        this.stopSectionTimer();
        this.localStorage.removeItem(kCurrentStudySession);
    }

    forceSectionEnd(): void {
        this.logger.debug(this, 'force end of section');
        clearInterval(this.sectionTimer);
        this.timeLeftSource.next(0);
    }

    private onStartStudySession(studySession: StudySession) {
        this.current = {session: studySession};
        this.resetSectionTimer();
    }

}
