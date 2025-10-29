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


/* "Barrel" of Http Interceptors */
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpErrorInterceptor } from './http-error.interceptor';
import { MockInterceptor } from './mock.interceptor';
import { LoadingIndicatorInterceptor } from 'src/app/http-interceptors/loading-indicator.interceptor';
import { RequestidInterceptor } from './requestid.interceptor';
import { TimeoutInterceptor } from './timeout.interceptor';
import { LoggingInterceptor } from './logging.interceptor';

/** Http interceptor providers in outside-in order
 *  Gathers all the interceptor providers into an httpInterceptorProviders array
 */
// https://angular.io/guide/http#provide-the-interceptor
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: MockInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: TimeoutInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: LoadingIndicatorInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: RequestidInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true },
];
