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

import { Pipe, PipeTransform } from '@angular/core';
/**
 * This class can be used to mock the `translate` pipe in jasmine test cases.
 *
 * Usage:
 * ``` typescript
 * TestBed.configureTestingModule({
        declarations: [TranslatePipeMock,...],
        providers: [{ provide: TranslatePipe, useClass: TranslatePipeMock },...]
}).compileComponents();
* ```
*/
// Courtesy of: https://github.com/ngx-translate/core/issues/636#issuecomment-451137902
@Pipe({
  name: 'translate',
})
export class TranslatePipeMock implements PipeTransform {
  public name = 'translate';

  public transform(query: string): any {
    return query;
  }
}
