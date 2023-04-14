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


import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ACL_CONFIG, AclConfig } from '../modules/auth/injection-tokens';
import { AuthService } from '../services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HasPermissionsGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly httpClient: HttpClient,
    private readonly router: Router,
    private readonly translateService: TranslateService,
    @Inject(ACL_CONFIG) readonly acl: AclConfig,
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.loadCachedUserProfile().pipe(
      map(userProfile => {
        // filter out the keys (the onap_ roles) that the user does not have
        const intersectionOfRoles = Object.keys(this.acl).filter(role => userProfile?.roles.includes(role));
        return this.hasPermissions(next.data.permission, intersectionOfRoles);
      }));
  }

  /**
   * Check if a user has a given permission.
   * @param permission the permission, as defined in the acl.json
   * @param roles the roles that the user possesses
   * @returns true if the user has the needed permission
   */
  private hasPermissions(permission: string, roles: string[]) {
    for (const role of roles) {
      if (this.acl[role].includes(permission)) {
        return true;
      }
    }
    this.router.navigate(['/statusPage'], {
      state: {
        header: this.translateService.instant('common.noPermissions.noPermissions'),
        message: this.translateService.instant('common.noPermissions.support'),
      },
    });
    return false;
  }
}
