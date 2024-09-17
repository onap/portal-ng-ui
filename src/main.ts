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

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { ajax } from 'rxjs/ajax';
import { catchError, switchMap } from 'rxjs/operators';
import { EMPTY, from } from 'rxjs';
import { ACL_CONFIG, AclConfig } from './app/modules/auth/injection-tokens';

if (environment.production) {
  enableProdMode();
}

const fetchAclConfig$ = ajax.getJSON<AclConfig>(`assets/acl.json`);

fetchAclConfig$
  .pipe(
    switchMap(acl => from(platformBrowserDynamic([{ provide: ACL_CONFIG, useValue: acl }]).bootstrapModule(AppModule))),
    catchError(() => {
      return EMPTY;
    }),
  )
  .subscribe(() => {
    console.log('App bootstrapped successfully');
  });
