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


import { Component } from '@angular/core';
import { map, repeatWhen, shareReplay, switchMap, takeUntil, tap } from 'rxjs/operators';
import { AlertService } from 'src/app/modules/alerting';
import { TranslateService } from '@ngx-translate/core';
import { UnsubscribeService } from 'src/app/services/unsubscribe/unsubscribe.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from 'src/app/components/shared/confirmation-modal/confirmation-modal.component';
import { BehaviorSubject, combineLatest, EMPTY, Subject } from 'rxjs';
import { UsersService } from 'openapi/output';
import { ActionType, EntityType } from '../../../model/user-last-action.model';
import { HistoryService } from '../../../services/history.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-user-administration-list',
  templateUrl: './user-administration-list.component.html',
  styleUrls: ['./user-administration-list.component.css'],
  providers: [UnsubscribeService],
})
export class UserAdministrationListComponent {
  readonly page$ = new BehaviorSubject<number>(1);
  readonly pageSize$ = new BehaviorSubject<number>(10);
  readonly loggedUserId$ = this.authService.loadCachedUserProfile().pipe(
    takeUntil(this.unsubscribeService.unsubscribe$),
    map(userInfo => userInfo!.sub));

  private readonly reload$ = new Subject<void>();
  readonly result$ = combineLatest([this.page$, this.pageSize$]).pipe(
    switchMap(([page, pageSize]) => {
      return this.userAdministrationService.listUsers(page, pageSize).pipe(
        map(response => {
          return {
            ...response,
            items: response.items.map(user => ({
              ...user,
              realmRoles: user.realmRoles?.filter(role => role.startsWith('portal_')),
            })),
          };
        }),
        repeatWhen(() => this.reload$),
      );
    }),
    shareReplay({ refCount: true, bufferSize: 1 }),
  );

  constructor(
    private readonly userAdministrationService: UsersService,
    private readonly alertService: AlertService,
    private readonly translateService: TranslateService,
    private readonly modalService: NgbModal,
    private readonly unsubscribeService: UnsubscribeService,
    private readonly authService: AuthService,
    private readonly historyService: HistoryService,
  ) {
  }

  changePage(page: number): void {
    this.page$.next(page);
  }

  changePageSize(pageSize: number): void {
    this.pageSize$.next(pageSize);
  }

  openModal(userId: string, userName: string): void {
    // open confirmation modal for user deletion
    const modalRef = this.modalService.open(ConfirmationModalComponent,{backdropClass:'backdropClass'});
    modalRef.componentInstance.okText = this.translateService.instant('common.buttons.delete');
    modalRef.componentInstance.title = this.translateService.instant('userAdministration.list.modal.delete.title');
    modalRef.componentInstance.text = this.translateService.instant('userAdministration.list.modal.delete.text', {
      userName,
    });
    modalRef.closed
      .pipe(
        takeUntil(this.unsubscribeService.unsubscribe$),
        switchMap((confirm: boolean) => {
          if (confirm) {
            return this.userAdministrationService.deleteUser(userId).pipe(
              switchMap(() =>
                this.historyService.createUserHistoryAction({
                  type: ActionType.DELETE,
                  entity: EntityType.USERADMINISTRATION,
                  entityParams: { userName, userId },
                }),
              ),
            );
          }
          return EMPTY;
        }),
        tap(() => {
          this.alertService.success(this.translateService.instant('userAdministration.messages.success.deleted'), {
            keepAfterRouteChange: true,
            autoClose: true,
          });
        }),
      )
      .subscribe(() => this.reload$.next());
  }
}
