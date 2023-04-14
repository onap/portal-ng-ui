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


import { Inject, Injectable } from '@angular/core';
import { Problem } from '../../../../openapi/output';

@Injectable({ providedIn: 'root' })
export class Alert {
  id?: string;
  type!: AlertType;
  message?: string;
  autoClose?: boolean;
  keepAfterRouteChange?: boolean;
  fade?: boolean;
  errorDetail?: Problem;
  requestId?: string;
  urlTree?: string[]

  constructor(@Inject(Alert) init?: Partial<Alert>) {
    Object.assign(this, init);
  }
}



export enum AlertType {
  Success,
  Error,
  Info,
  Warning,
}
