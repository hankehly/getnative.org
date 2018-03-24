/**
 * local-storage.service
 * getnative.org
 *
 * Created by henryehly on 2016/11/20.
 */

import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Logger } from '../logger/logger';

import { Subject } from 'rxjs/Subject';

@Injectable()
export class LocalStorageService {

    storageEvent$ = new Subject<StorageEvent>();
    clear$ = new Subject();

    constructor(private logger: Logger, @Inject(PLATFORM_ID) private platformId: Object) {
        this.clear$.subscribe(this.onClear.bind(this));
    }

    broadcastStorageEvent(ev: StorageEvent): void {
        if (ev.key === null && ev.newValue === null && ev.oldValue === null) {
            this.logger.debug(this, 'Storage Event clear()');
            this.clear$.next();
        } else {
            this.logger.debug(this, `Storage Event ${ev.key}`);
            this.storageEvent$.next(ev);
        }
    }

    get length(): number {
        return isPlatformBrowser(this.platformId) ? localStorage.length : 0;
    }

    /* Todo: Encrypt all stored data */
    setItem(key: string, data: any): void {
        if (isPlatformBrowser(this.platformId)) {
            if (data === null || data === undefined) {
                /* Todo: ErrorService */
                throw new Error('Cannot store a null or undefined value.');
            } else if (typeof data !== 'string') {
                data = JSON.stringify(data);
            }

            localStorage.setItem(key, data);
        }
    }

    getItem(key: string): any {
        if (!isPlatformBrowser(this.platformId)) {
            return {};
        }

        const retVal = localStorage.getItem(key);

        try {
            return JSON.parse(retVal);
        } catch (e) {
            return retVal;
        }
    }

    hasItem(key: string): boolean {
        return this.getItem(key) !== null;
    }

    removeItem(key: string): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem(key);
        }
    }

    onClear(): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.clear();
        }
    }

}
