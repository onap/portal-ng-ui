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

import { Inject, Pipe, PipeTransform } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ACL_CONFIG, AclConfig } from '../modules/auth/injection-tokens';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

/*
  hasPermission pipe returns Promise<boolean | void> value based on the authentication file (acl.json) and user's role.
  Using the pipe we are able to show/hide the elements in the app for specific user role.
  Input parameter is the string from the acl.json
  USAGE:  *ngIf="'dashboard.tile.KPI_DASHBOARD_TILE' | hasPermission | async"
*/
@Pipe({
  name: 'hasPermission',
})
export class HasPermissionPipe implements PipeTransform {
  constructor(
    readonly httpClient: HttpClient,
    readonly authService: AuthService,
    @Inject(ACL_CONFIG) readonly acl: AclConfig,
  ) {}

  transform(value: string): Observable<boolean | void> {
    return this.authService.loadCachedUserProfile().pipe(
      take(1),
      map(userProfile => {
        const intersectionOfRoles = Object.keys(this.acl).filter(role => userProfile?.roles.includes(role));
        for (const role of intersectionOfRoles) {
          if (this.acl[role].includes(value)) {
            return true;
          }
        }
        return false;
      }),
    );
  }
}
