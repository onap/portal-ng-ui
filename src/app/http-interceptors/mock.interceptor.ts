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
import { Observable } from 'rxjs';

/**
 * This Interceptor reroutes URLs that are defined in the `matchers` array to [Wiremock](https://wiremock.org/) endpoints.
 * This is useful, when the real api is not yet available.
 */
@Injectable()
export class MockInterceptor implements HttpInterceptor {
  // list of all available RegExp URL matchers
  // !! do not forget to remove matcher when API implementation is ready !!
  private readonly matchers: RegExp[] = [
    // for example:
    // /tiles/
  ];

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let newRequest = request;

    if (this.matchers.some(matcher => request.url.match(matcher))) {
      console.warn(`MockInterceptor is enabled for URL: '${request.url}'`);
      // intentional usage of .replace instead of .replaceAll to replace only first instance
      newRequest = request.clone({
        url: request.url.replace('/api/', '/mock-api/'),
      });
    }

    return next.handle(newRequest);
  }
}
