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


import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertService } from '../modules/alerting';
import { TranslateService } from '@ngx-translate/core';
import { Problem } from '../../../openapi/output';
import { Router } from '@angular/router';
import { DEFAULT_TIMEOUT } from './timeout.interceptor';

/**
 * This class adds global handling of http-request related errors
 */

export enum RequestMethod {
  DELETE = 'DELETE',
  POST = 'POST',
  GET = 'GET',
}

interface ProblemDetail {
  errorDetail: Problem;
  requestId?: string;
  urlTree: string[];
}
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  errorDetail!: Problem;
  constructor(private alertService: AlertService, private translateService: TranslateService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(rsp => {
        const urlTree = this.router.url.split('/');
        this.errorDetail = this.createErrorDetail(rsp);
        const requestId = request.headers.get('x-request-id') || undefined;
        const detail: ProblemDetail = {
          errorDetail: this.errorDetail,
          requestId,
          urlTree,
        };

        if (request.url.includes('onap_logging')) {
          this.alertService.warn(this.translateService.instant('common.block.logging'), {
            id: 'onap_logging',
          });
          return throwError(this.errorDetail);
        }
        if (request.method === RequestMethod.POST && request.url.includes('keycloak')) {
          this.alertService.error(this.translateService.instant('common.block.authorization'), {
            id: 'keycloak',
          });
          return throwError(this.errorDetail);
        }
        if (request.url.includes('preferences')) {
          this.getPreferenceMessage(request, detail);
          return throwError(this.errorDetail);
        }
        if (request.url.includes('actions')) {
          this.getActionMessage(request, detail);
          return throwError(this.errorDetail);
        }

        switch (urlTree[1].split('?')[0]) {
          case 'user-administration':
            this.getUserAdministrationMessage(request, detail, urlTree);
            break;
          case 'dashboard':
            this.getErrorMessage('dashboard', detail);
            break;
          case 'app-starter':
            this.getErrorMessage('appStarter', detail);
            break;
          default:
            this.getErrorMessage('defaultMessage', detail);
            break;
        }
        return throwError(this.errorDetail);
      }),
    );
  }

  private getUserAdministrationMessage(request: HttpRequest<any>, detail: ProblemDetail, urlTree: string[]) {
    if (request.method === RequestMethod.DELETE) {
      return this.getErrorMessage('userAdministration.delete', detail);
    }
    if (urlTree.includes('create')) {
      return this.getErrorMessage('userAdministration.create', detail);
    }
    if (urlTree.includes('edit')) {
      return this.getErrorMessage('userAdministration.edit', detail);
    }
  }

  private getActionMessage(request: HttpRequest<any>, detail: ProblemDetail) {
    if (request.method === RequestMethod.POST) {
      return this.getErrorMessage('saveAction', detail);
    }
    this.getErrorMessage('loadAction', detail);
  }

  private getPreferenceMessage(request: HttpRequest<any>, detail: ProblemDetail) {
    if (request.method === RequestMethod.POST) {
      return this.getErrorMessage('savePreferences', detail);
    }
    this.getErrorMessage('loadPreferences', detail);
  }

  private createErrorDetail(response: any): Problem {
    if (response instanceof TimeoutError) {
      return {
        detail: this.translateService.instant('common.block.timeout', { value: DEFAULT_TIMEOUT / 1000 }),
        title: response.name,
        status: 408,
      };
    }
    return response.error ? response.error : response;
  }

  private getErrorMessage(type: string, detail: ProblemDetail) {
    this.alertService.error(`${this.translateService.instant('common.block.' + type)}`, detail);
  }
}
