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
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UsersService } from '../../../openapi/output';
import { catchError, map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
@Injectable({
  providedIn: 'root',
})
export class EditUserCanActivateGuard implements CanActivate {
  constructor(
    private usersService: UsersService,
    private router: Router,
    private translateService: TranslateService,
  ) {}
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const userId = route.paramMap.get('userId');
    if (userId) {
      return this.usersService.getUser(userId).pipe(
        catchError(() => {
          this.router.navigate(['/statusPage'], {
            state: {
              header: this.translateService.instant('userAdministration.messages.warnings.userDeleted.header'),
              message: this.translateService.instant('userAdministration.messages.warnings.userDeleted.message'),
            },
          });
          return of(false);
        }),
        map(() => {
          return true;
        }),
      );
    }
    return of(false);
  }
}
