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
import { UserAdministrationListComponent } from './user-administration-list/user-administration-list.component';
import { UserAdministrationFormComponent } from './user-administration-form/user-administration-form.component';
import { UserAdministrationRoutingModule } from './user-administration-routing.module';
import { SharedModule } from '../../shared.module';

@NgModule({
  declarations: [UserAdministrationListComponent, UserAdministrationFormComponent],
  imports: [UserAdministrationRoutingModule, SharedModule],
})
export class UserAdministrationModule {}
