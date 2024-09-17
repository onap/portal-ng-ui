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
import { OAuthService, UserInfo } from 'angular-oauth2-oidc';
import { catchError, filter, map } from 'rxjs/operators';
import { NavigationStart, Router } from '@angular/router';
import { AlertService } from '../modules/alerting';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, EMPTY, Observable, of } from 'rxjs';

/**
 * Provides check for roles and token
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userProfile$ = new BehaviorSubject<UserInfo | undefined>(undefined);
  constructor(
    private readonly oauthService: OAuthService,
    private router: Router,
    private alertService: AlertService,
    private translateService: TranslateService,
  ) {
    //renew cache every page reload
    router.events.pipe(filter((e): e is NavigationStart => e instanceof NavigationStart)).subscribe(() => {
      try {
        return this.loadUserProfile()
          .then(userInfo => this.userProfile$.next(userInfo))
          .catch(e => {
            throw e;
          });
      } catch (e) {
        this.alertService.error(this.translateService.instant('common.messages.keycloakAccessTokenNotValid'), {
          id: 'keycloak',
          keepAfterRouteChange: true,
        });
        return Promise.resolve(null);
      }
    });
  }

  userProfileCache: UserInfo | undefined = undefined;

  /**
   * Convenience method of `hasValidAccessToken()` and `hasSufficientRoles()`
   * Asynchronous because the needed UserInfo is fetched from Keycloak
   */
  hasPermissions(): Observable<boolean> {
    if (this.hasValidAccessToken()) {
      return this.hasSufficientRoles();
    }
    return of(false);
  }

  /**
   * This answers: 'What if the user has an account, but without any permissions?'
   * Asynchronous because the needed UserInfo is fetched from Keycloak
   */
  hasSufficientRoles(): Observable<boolean> {
    return this.loadCachedUserProfile().pipe(map(info => info?.roles.join(',') !== 'offline_access'));
  }

  loadCachedUserProfile(): Observable<UserInfo | undefined> {
    return this.userProfile$.pipe(
      filter(userProfile => userProfile !== undefined),
      catchError(err => {
        console.error(err);
        return EMPTY;
      }),
    );
  }

  /**
   * Wrapper for `hasValidAccessToken` from OAuthService
   */
  hasValidAccessToken(): boolean {
    return this.oauthService.hasValidAccessToken();
  }
  /*
   * Private method = should not be used outside of this class, because it triggers additional request for userprofile
   * */
  private loadUserProfile(): Promise<UserInfo> {
    // in version 12.2 loadUserProfile() Promise returns data of type object instead of UserInfo
    //@ts-ignore
    return this.oauthService.loadUserProfile().then(userInfo => userInfo.info as UserInfo);
  }
}
