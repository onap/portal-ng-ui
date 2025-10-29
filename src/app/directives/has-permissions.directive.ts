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


import { Directive, ElementRef, Inject, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ACL_CONFIG, AclConfig } from '../modules/auth/injection-tokens';
import { AuthService } from '../services/auth.service';
import { takeUntil } from 'rxjs/operators';
import { UnsubscribeService } from '../services/unsubscribe/unsubscribe.service';

@Directive({
  selector: '[appHasPermissions]',
  providers: [UnsubscribeService]
})
export class HasPermissionsDirective {
  @Input() appHasPermissions = '';
  constructor(
    private el: ElementRef,
    readonly httpClient: HttpClient,
    readonly authService: AuthService,
    @Inject(ACL_CONFIG) readonly acl: AclConfig,
    private unsubscribeService: UnsubscribeService
  ) {
    // for unknown reasons this must be wrapped in set timeout, otherwise appHasPermissions is sometimes empty string
    setTimeout(() => {
      this.el.nativeElement.style.display = 'none';
      this.authService
        .loadCachedUserProfile()
        .pipe(takeUntil(this.unsubscribeService.unsubscribe$))
        .subscribe(userProfile => {
          const userRoles = userProfile?.roles ?? [];
          const intersectionOfRoles = Object.keys(acl).filter(role => userRoles.includes(role));
          for (const role of intersectionOfRoles) {
            if (acl[role].includes(this.appHasPermissions)) {
              this.el.nativeElement.style.display = 'initial';
              return;
            }
          }
        })
    }, 0);
  }
}
