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
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { take, tap } from 'rxjs/operators';
import { LoggingService } from '../services/logging.service';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  constructor(private readonly loggingService: LoggingService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (environment.loggingEnabled) {
      if (
        request.url.toLowerCase().startsWith(environment.backendServerUrl) &&
        !request.url.toLowerCase().startsWith(environment.loggingUrl)
      ) {
        const requestMessage = `Portal-ui - request - X-Request-Id <${request.headers.get('x-request-id')}> <${
          request.method
        }> <${request.url}>`;
        this.loggingService
          .writeLog(`'@timestamp': ${new Date().toISOString()}, message: ${requestMessage}`)
          .pipe(take(1))
          .subscribe();

        return next.handle(request).pipe(
          tap((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
              const requestId = event.headers.get('x-request-id');
              const responseMessage = `Portal-ui - response - X-Request-Id <${requestId ?? 'Not set'}> <${
                event.status
              }>`;
              this.loggingService
                .writeLog(`'@timestamp': ${new Date().toISOString()}, message: ${responseMessage}`)
                .pipe(take(1))
                .subscribe();
            }
          }),
        );
      }
      return next.handle(request);
    }
    return next.handle(request);
  }
}
