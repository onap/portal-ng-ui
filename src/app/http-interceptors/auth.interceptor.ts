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
import { OAuthStorage } from 'angular-oauth2-oidc';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authStorage: OAuthStorage) {}

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const url = req.url.toLowerCase();
    if (!url.startsWith(environment.backendServerUrl) && !url.startsWith(environment.loggingUrl)) {
      return next.handle(req);
    }

    const accessToken = this.authStorage.getItem('access_token');
    const idToken = this.authStorage.getItem('id_token');
    if (accessToken === null || idToken === null) {
      return throwError(new Error('Missing access or ID token'));
    }
    const headers = req.headers
      .set('Authorization', `Bearer ${accessToken}`)
      .set('X-Auth-Identity', `Bearer ${idToken}`);
    req = req.clone({ headers });

    return next.handle(req);
  }
}
