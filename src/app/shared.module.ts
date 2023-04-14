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

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableSkeletonComponent } from './components/shared/table-skeleton/table-skeleton.component';
import { PaginationComponent } from './components/shared/pagination/pagination.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BreadcrumbComponent } from './components/shared/breadcrumb/breadcrumb.component';
import { BreadcrumbItemComponent } from './components/shared/breadcrumb-item/breadcrumb-item.component';
import { NgModule } from '@angular/core';
import { HasPermissionPipe } from './pipes/has-permission.pipe';
import { HasPermissionsDirective } from './directives/has-permissions.directive';
import { ColonPipe } from './pipes/colon.pipe';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { I18nModule } from './modules/i18n/i18n.module';
import { AlertModule } from './modules/alerting';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingSpinnerComponent } from './components/shared/loading-spinner/loading-spinner.component';
import { InPipe } from 'src/app/pipes/in.pipe';
import { IsTodayPipe } from 'src/app/pipes/is-today.pipe';
import { MapPipe } from 'src/app/pipes/map.pipe';

@NgModule({
  imports: [CommonModule, NgbModule, I18nModule, FormsModule, ReactiveFormsModule, AlertModule, TranslateModule],
  declarations: [
    HasPermissionPipe,
    ColonPipe,
    InPipe,
    IsTodayPipe,
    MapPipe,
    HasPermissionsDirective,
    TableSkeletonComponent,
    PaginationComponent,
    BreadcrumbComponent,
    BreadcrumbItemComponent,
    LoadingSpinnerComponent,
  ],
  exports: [
    CommonModule,
    FormsModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    I18nModule,
    FormsModule,
    ReactiveFormsModule,
    AlertModule,
    HasPermissionPipe,
    ColonPipe,
    InPipe,
    IsTodayPipe,
    MapPipe,
    HasPermissionsDirective,
    PaginationComponent,
    TableSkeletonComponent,
    BreadcrumbComponent,
    BreadcrumbItemComponent,
    LoadingSpinnerComponent,
  ],
})
export class SharedModule {}
