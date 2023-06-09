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


import { TestBed } from '@angular/core/testing';

import { RequestCacheService } from './request-cache.service';

describe('RequestCacheService', () => {
  let service: RequestCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
