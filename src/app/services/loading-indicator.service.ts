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
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Injectable()
export class LoadingIndicatorService {
  private isVisible$ = new BehaviorSubject<boolean>(false);
  private timeDelay = 500;
  private counter = 0;

  show(): void {
    this.counter++;
    if (this.counter > 0) {
      setTimeout(() => this.isVisible$.next(true), 0);
    }
  }

  hide(): void {
    this.counter--;
    if (this.counter === 0) {
      setTimeout(() => this.isVisible$.next(false), 0);
    }
  }

  isVisible(): Observable<boolean> {
    return this.isVisible$.pipe(debounceTime(this.timeDelay));
  }
}
