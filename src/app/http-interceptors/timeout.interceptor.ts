/*
 * Copyright (c) 2022. Deutsche Telekom AG
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { AlertService } from '../modules/alerting';
import { TranslateService } from '@ngx-translate/core';

//60 seconds
export const DEFAULT_TIMEOUT = 60000;

@Injectable()
export class TimeoutInterceptor implements HttpInterceptor {
  constructor(
    private alertService: AlertService,
    private translateService: TranslateService,
  ) {}
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      timeout(DEFAULT_TIMEOUT),
      catchError(err => {
        if (err instanceof TimeoutError) {
          this.alertService.error(this.translateService.instant('common.messages.timeout'));
        }
        return throwError(err);
      }),
    );
  }
}
