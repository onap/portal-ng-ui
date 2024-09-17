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
import {
  ActionType,
  CreateActionModel,
  EntityType,
  EntityUserHistoryActionModel,
} from '../model/user-last-action.model';
import { ActionsListResponse, ActionsResponse, ActionsService } from '../../../openapi/output';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  constructor(
    private readonly actionService: ActionsService,
    private readonly oauthService: OAuthService,
  ) {}

  public getUserActions(interval: number | undefined): Observable<ActionsListResponse> {
    const userId = Object(this.oauthService.getIdentityClaims()).sub;
    return this.actionService.getActions(userId, 1, 1000, interval);
  }

  public createUserHistoryAction(action: CreateActionModel<EntityUserHistoryActionModel>): Observable<ActionsResponse> {
    let mappedAction = {
      type: action.type,
      entity: action.entity,
      entityParams: {
        userName: action.entityParams.userName,
        userId: action.entityParams.userId,
      },
    };
    return this.createAction(mappedAction);
  }

  private createAction(action: {
    type: ActionType;
    entity: EntityType;
    entityParams: { [key: string]: string | undefined };
  }): Observable<ActionsResponse> {
    const userId = Object(this.oauthService.getIdentityClaims()).sub;
    const actionCreatedAt = new Date().toISOString();
    return this.actionService.createAction(userId, undefined, {
      userId,
      actionCreatedAt,
      action,
    });
  }
}
