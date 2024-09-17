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

import { HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

const maxAge = 60000;

@Injectable({
  providedIn: 'root',
})
// https://github.com/angular/angular/blob/master/aio/content/examples/http/src/app/request-cache.service.ts
export class RequestCacheService implements RequestCache {
  // The cache is a Map of (most importantly but not exclusively) HttpResponses
  cache = new Map<string, RequestCacheEntry>();

  /**
   * Get an http request from cache
   * @param request the http request that should be retrieved from cache
   */
  get(request: HttpRequest<any>): HttpResponse<any> | undefined {
    const requestUrl = request.urlWithParams;
    const cachedResponse = this.cache.get(requestUrl);

    if (!cachedResponse) {
      return undefined;
    }

    const isExpired = cachedResponse.lastRead < Date.now() - maxAge;

    return isExpired ? undefined : cachedResponse.response;
  }

  /**
   * Put a http response for a given request url (taken from the request object) in the cache
   * @param request the http request that should be associated with the http response
   * @param response the http response that should be stored in cache
   */
  put(request: HttpRequest<any>, response: HttpResponse<any>): void {
    const requestUrl = request.urlWithParams;

    // Map a request url to an object
    const newEntry = { requestUrl, response, lastRead: Date.now() };
    this.cache.set(requestUrl, newEntry);

    // Remove expired entries from the cache
    const expired = Date.now() - maxAge;
    this.cache.forEach(entry => {
      if (entry.lastRead < expired) {
        this.cache.delete(entry.requestUrl);
      }
    });
  }
}

/**
 * Service that manages the cache.
 * `get()` HttpResponses from cache and `put()` responses into the cache
 */
export abstract class RequestCache {
  abstract get(request: HttpRequest<any>): HttpResponse<any> | undefined;
  abstract put(request: HttpRequest<any>, response: HttpResponse<any>): void;
}

/**
 * Wrapper Object that stores the HttpResponse together with the `requestUrl` of the request and the `lastRead` time it was cached
 */
export interface RequestCacheEntry {
  requestUrl: string;
  response: HttpResponse<any>;
  lastRead: number;
}
