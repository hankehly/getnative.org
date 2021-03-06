/**
 * notifications.component
 * getnative.org
 *
 * Created by henryehly on 2016/12/09.
 */

import { ChangeDetectorRef, Component, OnDestroy, ViewChild } from '@angular/core';

import { NotificationService } from '../../core/notification/notification.service';
import { SwitchComponent } from '../../shared/switch/switch.component';
import { HttpService } from '../../core/http/http.service';
import { UserService } from '../../core/user/user.service';
import { APIHandle } from '../../core/http/api-handle';
import { APIErrors } from '../../core/http/api-error';
import { Logger } from '../../core/logger/logger';
import { User } from '../../core/entities/user';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import * as _ from 'lodash';

@Component({
    selector: 'gn-notifications',
    templateUrl: 'notifications.component.html',
    styleUrls: ['notifications.component.scss']
})
export class NotificationsComponent implements OnDestroy {

    @ViewChild('browserNotificationSwitch') browserNotificationSwitch: SwitchComponent;
    user: User = this.userService.current$.getValue();
    OnDestroy$ = new Subject<void>();

    errors = {
        browserNotificationsEnabled: null,
        emailNotificationsEnabled: null
    };

    flags = {
        notificationUnsupported: !this.notification.supported,
        notificationPermissionDenied: false,
        processing: {
            browserNotificationsEnabled: false,
            emailNotificationsEnabled: false
        }
    };

    notificationUnsupported = !this.notification.supported;
    browserNotificationGranted = this.userService.current$.getValue().browser_notifications_enabled &&
        this.notification.permission$.getValue() === 'granted';

    constructor(private userService: UserService, private http: HttpService, private logger: Logger,
                private notification: NotificationService, private changeDetectorRef: ChangeDetectorRef) {
    }

    ngOnDestroy(): void {
        this.logger.debug(this, 'OnDestroy');
        this.OnDestroy$.next();
    }

    isEmailVerificationsOn(): boolean {
        if (this.user.email_verified) {
            return this.user.email_notifications_enabled;
        }

        return false;
    }

    updateEmailPreference(value: boolean) {
        this.flags.processing.emailNotificationsEnabled = true;
        this.http.request(APIHandle.UPDATE_USER, {body: {email_notifications_enabled: value}})
            .takeUntil(this.OnDestroy$)
            .subscribe(
                this.onUpdateEmailNotificationsEnabledNext.bind(this, value),
                this.onUpdateEmailNotificationsEnabledError.bind(this)
            );
    }

    private onUpdateEmailNotificationsEnabledNext(value: boolean): void {
        this.flags.processing.emailNotificationsEnabled = false;
        this.userService.update({email_notifications_enabled: value});
    }

    private onUpdateEmailNotificationsEnabledError(errors: APIErrors): void {
        this.flags.processing.emailNotificationsEnabled = false;
        this.errors.emailNotificationsEnabled = _.first(errors);
    }

    updateBrowserPreference(value: boolean) {
        if (!value) {
            if (this.userService.current$.getValue().browser_notifications_enabled) {
                this.persistBrowserNotificationPreference(false);
            } else {
                this.logger.debug(this, '`browser_notifications_enabled = false` is synchronized on client/server.');
            }
        } else {
            this.notification.requestPermission()
                .takeUntil(this.OnDestroy$)
                .subscribe(this.onRequestNotificationPermissionNext.bind(this));
        }
    }

    /* Browser bug: When updating off -> on, the switch component doesn't become disabled during the http request.
     * To deal with the problem, I force the component to check for changes using ChangeDetectorRef.detectChanges();
     * https://stackoverflow.com/questions/34827334/triggering-angular2-change-detection-manually */
    private persistBrowserNotificationPreference(value: boolean): void {
        this.flags.processing.browserNotificationsEnabled = true;
        this.changeDetectorRef.detectChanges();
        this.http.request(APIHandle.UPDATE_USER, {body: {browser_notifications_enabled: value}})
            .takeUntil(this.OnDestroy$)
            .subscribe(
                this.onUpdateBrowserNotificationsEnabledNext.bind(this, value),
                this.onUpdateBrowserNotificationsEnabledError.bind(this)
            );
    }

    private onUpdateBrowserNotificationsEnabledNext(value: boolean): void {
        this.flags.processing.browserNotificationsEnabled = false;
        this.changeDetectorRef.detectChanges();
        this.userService.update({browser_notifications_enabled: value});
    }

    private onUpdateBrowserNotificationsEnabledError(errors: APIErrors): void {
        this.flags.processing.browserNotificationsEnabled = false;
        this.changeDetectorRef.detectChanges();
        if (errors && errors.length) {
            this.errors.browserNotificationsEnabled = _.first(errors);
        } else {
            this.errors.browserNotificationsEnabled = {code: 'Unknown', message: 'Unknown error'};
        }
    }

    private onRequestNotificationPermissionNext(status: NotificationPermission): void {
        if (status === 'granted') {
            this.flags.notificationPermissionDenied = false;
            this.persistBrowserNotificationPreference(true);
        } else {
            this.flags.notificationPermissionDenied = true;
            this.browserNotificationSwitch.on = false;
            this.browserNotificationSwitch.toggle();
        }
    }

}
