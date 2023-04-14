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


import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActionModel, ActionRowModel, ActionType, EntityTypeModel } from '../../../../../model/user-last-action.model';

@Component({
  selector: 'app-action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.css'],
})
export class ActionButtonComponent {
  public readonly VIEW_ACTIONS = [ActionType.ACK, ActionType.UNACK, ActionType.CLEAR, ActionType.DEPLOY];
  public readonly REPEAT_ACTIONS = [ActionType.SEARCH, ActionType.VIEW, ActionType.EDIT];
  ActionType = ActionType;

  @Input() action: ActionRowModel<EntityTypeModel> | undefined;
  @Input() message: string | undefined;
  @Output() btnClick = new EventEmitter<ActionModel>();

  public onButtonClick(action: ActionModel): void {
    this.btnClick.emit(action);
  }
}
