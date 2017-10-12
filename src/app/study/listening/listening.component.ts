/**
 * listening.component
 * getnativelearning.com
 *
 * Created by henryehly on 2016/12/11.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';

import { StudySessionService } from '../../core/study-session/study-session.service';
import { StudySessionSection } from '../../core/typings/study-session-section';
import { Logger } from '../../core/logger/logger';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Component({
    templateUrl: 'listening.component.html',
    styleUrls: ['listening.component.scss']
})
export class ListeningComponent implements OnInit, OnDestroy {

    src = this.session.current.video.video_url;
    transcripts = this.session.current.video.transcripts;

    private OnDestroy$ = new Subject<void>();

    constructor(private logger: Logger, private session: StudySessionService) {
    }

    ngOnInit(): void {
        this.logger.debug(this, 'OnInit');
        this.session.startSectionTimer();
        this.session.timeLeftEmitted$.takeUntil(this.OnDestroy$).filter(time => time === 0).subscribe(() => {
            this.logger.debug(this, 'listening time finished');
            this.session.transition(StudySessionSection.Shadowing);
        });
    }

    ngOnDestroy(): void {
        this.logger.debug(this, 'OnDestroy');
        this.OnDestroy$.next();
    }

}