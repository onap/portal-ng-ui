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

export interface TilesListResponse {
  items: Tile[];
}
export interface Tile {
  id: number;
  title: string;
  imageUrl: string;
  imageAltText: string;
  description: string;
  redirectUrl: string;
  headers?: string;
  groups: Group[];
  roles: Role[];
}

export enum Group {
  ADMIN = 'ADMIN',
  DEVELOPER = 'DEVELOPER',
  OPERATOR = 'OPERATOR',
}

export enum Role {
  PORTAL_OPERATOR = 'PORTAL_OPERATOR',
  PORTAL_DESIGNER = 'PORTAL_DESIGNER',
  PORTAL_ADMIN = 'PORTAL_ADMIN',
}
