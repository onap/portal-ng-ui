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

import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  CreateUserRequest,
  Role,
  RoleListResponse,
  RolesService,
  UpdateUserRequest,
  UserResponse,
  UsersService,
} from 'openapi/output';
import { AlertService } from 'src/app/modules/alerting';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UnsubscribeService } from 'src/app/services/unsubscribe/unsubscribe.service';
import { NON_WHITE_SPACE_PATTERN, VALIDATION_PATTERN } from 'src/app/model/validation-pattern.model';
import { map, switchMap, take, takeUntil } from 'rxjs/operators';
import { markAsDirtyAndValidate } from 'src/app/helpers/helpers';
import { forkJoin, Observable, zip } from 'rxjs';
import { ActionType, EntityType } from '../../../model/user-last-action.model';
import { HistoryService } from '../../../services/history.service';

@Component({
  selector: 'app-user-administration-form',
  templateUrl: './user-administration-form.component.html',
  styleUrls: ['./user-administration-form.component.css'],
  providers: [UnsubscribeService],
})
export class UserAdministrationFormComponent implements OnInit {
  public readonly userId: string | null;
  public readonly keycloakUserForm: FormGroup;
  public user: UserResponse | undefined = undefined;

  public checkBoxes: {
    assigned: Role[];
    available: Role[];
  } = {
    assigned: [],
    available: [],
  };

  constructor(
    private readonly alertService: AlertService,
    private readonly route: ActivatedRoute,
    private readonly userAdministrationService: UsersService,
    private readonly rolesService: RolesService,
    private readonly router: Router,
    private readonly translateService: TranslateService,
    private readonly unsubscribeService: UnsubscribeService,
    private readonly historyService: HistoryService,
  ) {
    this.userId = this.route.snapshot.paramMap.get('userId');

    this.keycloakUserForm = new FormGroup({
      id: new FormControl({ value: null, disabled: true }),
      username: new FormControl({ value: null, disabled: this.userId !== null }, [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern(VALIDATION_PATTERN),
        Validators.pattern(NON_WHITE_SPACE_PATTERN),
      ]),
      email: new FormControl(null, [Validators.email, Validators.required, Validators.pattern(VALIDATION_PATTERN)]),
      firstName: new FormControl(null, [Validators.pattern(VALIDATION_PATTERN)]),
      lastName: new FormControl(null, [Validators.pattern(VALIDATION_PATTERN)]),
    });
  }

  ngOnInit(): void {
    if (this.userId !== null) {
      this.userAdministrationService
        .getUser(this.userId)
        .pipe(takeUntil(this.unsubscribeService.unsubscribe$))
        .subscribe(user => {
          this.user = user;
          this.keycloakUserForm.patchValue({
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          });
        });

      zip(
        this.userAdministrationService.listAvailableRoles(this.userId).pipe(map(available => available.items)),
        this.userAdministrationService.listAssignedRoles(this.userId).pipe(map(assigned => assigned.items)),
      )
        .pipe(takeUntil(this.unsubscribeService.unsubscribe$))
        .subscribe(([available, assigned]) => {
          this.checkBoxes = { available, assigned };
        });
    } else {
      this.rolesService
        .listRoles()
        .pipe(
          takeUntil(this.unsubscribeService.unsubscribe$),
          map(available => available.items),
        )
        .subscribe(available => {
          this.checkBoxes.available = available;
        });
    }
  }

  get userName(): FormControl {
    return this.keycloakUserForm.get('username') as FormControl;
  }

  get email(): FormControl {
    return this.keycloakUserForm.get('email') as FormControl;
  }

  get firstName(): FormControl {
    return this.keycloakUserForm.get('firstName') as FormControl;
  }

  get lastName(): FormControl {
    return this.keycloakUserForm.get('lastName') as FormControl;
  }

  public onSubmit(): void {
    markAsDirtyAndValidate(this.keycloakUserForm);
    if (this.keycloakUserForm.valid) {
      const formValue = this.keycloakUserForm.getRawValue();
      if (this.userId === null) {
        this.userAdministrationService
          .createUser(this.createUserRequest(formValue))
          .pipe(
            switchMap((data: UserResponse) =>
              this.historyService.createUserHistoryAction({
                type: ActionType.CREATE,
                entity: EntityType.USERADMINISTRATION,
                entityParams: { userName: data.username, userId: data.id },
              }),
            ),
            take(1),
          )
          .subscribe(() => {
            this.alertService.success(this.translateService.instant('userAdministration.messages.success.created'), {
              keepAfterRouteChange: true,
              autoClose: true,
            });
            this.router.navigate(['../list'], { relativeTo: this.route });
          });
      } else {
        this.updateUserData(
          this.userAdministrationService.updateUser(this.userId, this.updateUserRequest(formValue)),
          this.userAdministrationService.updateAssignedRoles(this.userId, undefined, this.checkBoxes.assigned),
        );
      }
    }
  }

  public isFormControlInvalid(formControl: AbstractControl | null): boolean {
    if (formControl !== null) {
      return formControl && formControl?.invalid && (formControl?.dirty || formControl?.touched);
    }
    return false;
  }

  public onCheckboxChange(roleId: string, checked: boolean): void {
    if (checked) {
      const checkedObj = { ...this.checkBoxes.available.find(({ id }) => id === roleId) } as Role;
      this.checkBoxes.assigned.push(checkedObj);
      this.checkBoxes.available = this.checkBoxes.available.filter(({ id }) => id !== roleId);
    } else {
      const uncheckedObj = { ...this.checkBoxes.assigned.find(({ id }) => id === roleId) } as Role;
      this.checkBoxes.available.push(uncheckedObj);
      this.checkBoxes.assigned = this.checkBoxes.assigned.filter(({ id }) => id !== roleId);
    }
  }

  private createUserRequest(formValue: any): CreateUserRequest {
    return {
      username: formValue.username,
      email: formValue.email,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      enabled: true,
      roles: this.checkBoxes.assigned,
    };
  }

  private updateUserRequest(formValue: any): UpdateUserRequest {
    return {
      email: formValue.email,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      enabled: true,
    };
  }

  private updateUserData(userResponse: Observable<UserResponse>, roleResponse: Observable<RoleListResponse>): void {
    forkJoin([userResponse, roleResponse])
      .pipe(
        switchMap(([,]) =>
          this.historyService.createUserHistoryAction({
            type: ActionType.EDIT,
            entity: EntityType.USERADMINISTRATION,
            entityParams: { userName: this.user!.username, userId: this.user!.id },
          }),
        ),
        take(1),
      )
      .subscribe(() => {
        this.alertService.success(this.translateService.instant('userAdministration.messages.success.updated'), {
          keepAfterRouteChange: true,
          autoClose: true,
        });
        this.router.navigate(['../../list'], { relativeTo: this.route });
      });
  }
}
