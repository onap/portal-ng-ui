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


export enum ActionFilter {
  ALL = 'ALL',
  SEARCH = 'SEARCH',
  ACTION = 'ACTION',
}

export enum ActionType {
  SEARCH = 'SEARCH',
  VIEW = 'VIEW',
  EDIT = 'EDIT',
  DEPLOY = 'DEPLOY',
  DELETE = 'DELETE',
  CREATE = 'CREATE',
  CLEAR = 'CLEAR',
  ACK = 'ACK',
  UNACK = 'UNACK',
}

export enum ActionInterval {
  LAST1H = '1H',
  LAST4H = '4H',
  LAST1D = '1D',
  ALL = 'ALL',
}

export enum EntityType {
  USERADMINISTRATION = 'USERADMINISTRATION',
}

export interface EntityUserHistoryActionModel {
  userId: string;
  userName: string;
}

export interface CreateActionModel<T> {
  type: ActionType;
  entity: EntityType;
  entityParams: T;
}

export interface ActionRowModel<T> {
  actionCreatedAt: string;
  type: ActionType;
  entity: EntityType;
  entityParams: T;
}

export interface ActionModel {
  actionCreatedAt: string;
  type: ActionType;
  entity: EntityType;
  entityParams: EntityTypeModel;
}

export type EntityTypeModel =
  | EntityUserHistoryActionModel
