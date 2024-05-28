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


import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { startWith, tap } from 'rxjs/operators';

import { RequestCache } from '../services/cacheservice/request-cache.service';
import { urlTileApi } from '../services/tileservice/tiles.service';

/**
 * Interceptor that returns HttpResponses from cache and updates cache if outdated
 * This applies to GET requests from specified urls (specified in this class)
 */
@Injectable()
// https://angular.io/guide/http#using-interceptors-for-caching
// https://github.com/angular/angular/blob/master/aio/content/examples/http/src/app/http-interceptors/caching-interceptor.ts
export class CachingInterceptor implements HttpInterceptor {
  private cachedUrls: Array<string> = [
    urlTileApi,
    window.location.origin + '/keycloak/realms/ONAP/protocol/openid-connect/userinfo',
  ];

  // cache is the cache service that supports get() and put()
  constructor(private cache: RequestCache) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // continue if not cacheable.
    if (!this.isCacheable(request)) {
      return next.handle(request);
    }

    const cachedResponse = this.cache.get(request);

    // when a custom 'x-refresh' header is set, refresh the cash
    // (see https://github.com/angular/angular/blob/master/aio/content/examples/http/src/app/package-search/package-search.service.ts)
    if (request.headers.get('x-refresh')) {
      const results$ = this.getUpdatedResponse(request, next, this.cache);
      return cachedResponse ? results$.pipe(startWith(cachedResponse)) : results$;
    }
    // cache-or-fetch
    return cachedResponse ? of(cachedResponse) : this.getUpdatedResponse(request, next, this.cache);
  }

  /**
   * Checks if the request is cacheable.
   * This is true if the request is a http GET and the url is defined in this method
   * (-> urlTileApi)
   */
  private isCacheable(req: HttpRequest<any>): boolean {
    // Only GET requests are cacheable
    return (
      req.method === 'GET' &&
      // Only the tile api is cacheable in this app
      -1 < this.cachedUrls.indexOf(req.url)
    );
  }

  /**
   * Get server response observable by sending request to `next()`.
   * Will add the response to the cache on the way out.
   */
  private getUpdatedResponse(
    req: HttpRequest<any>,
    next: HttpHandler,
    cache: RequestCache,
  ): Observable<HttpEvent<any>> {
    return next.handle(req.clone()).pipe(
      tap(event => {
        // There may be other events besides the response.
        if (event instanceof HttpResponse) {
          cache.put(req, event); // Update the cache.
        }
      }),
    );
  }
}
