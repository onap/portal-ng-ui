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


import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserAdministrationListComponent } from './user-administration-list/user-administration-list.component';
import { AuthGuard } from '../../guards/auth.guard';
import { HasPermissionsGuard } from '../../guards/has-permissions.guard';
import { UserAdministrationFormComponent } from './user-administration-form/user-administration-form.component';
import { EditUserCanActivateGuard } from '../../guards/edit-user.can-activate.guard';

const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  {
    path: 'list',
    component: UserAdministrationListComponent,
    canActivate: [AuthGuard, HasPermissionsGuard],
    data: { permission: 'users.administration.list' },
  },
  {
    path: 'create',
    component: UserAdministrationFormComponent,
    canActivate: [AuthGuard, HasPermissionsGuard],
    data: { permission: 'users.administration.create' },
  },
  {
    path: ':userId/edit',
    component: UserAdministrationFormComponent,
    canActivate: [AuthGuard, HasPermissionsGuard, EditUserCanActivateGuard],
    data: { permission: 'users.administration.edit' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserAdministrationRoutingModule {}
