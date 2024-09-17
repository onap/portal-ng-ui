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
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../../shared.module';
import { EntityUserAdministrationRowComponent } from './apps/user-last-action-tile/entity-user-administration-row/entity-user-administration-row.component';
import { ActionButtonComponent } from './apps/user-last-action-tile/action-button/action-button.component';
import { ActionRowComponent } from './apps/user-last-action-tile/action-row/action-row.component';
import { UserLastActionTileComponent } from './apps/user-last-action-tile/user-last-action-tile.component';
import { DashboardComponent } from './dashboard.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    DashboardComponent,
    UserLastActionTileComponent,
    ActionRowComponent,
    ActionButtonComponent,
    EntityUserAdministrationRowComponent,
  ],
  imports: [DashboardRoutingModule, SharedModule, DragDropModule],
})
export class DashboardModule {}
