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
import { TranslateService } from '@ngx-translate/core';

export enum KeyboardShortcuts {
  SHORTCUT_0 = '0',
  SHORTCUT_1 = '1',
  SHORTCUT_2 = '2',
  SHORTCUT_4 = '4',
  SHORTCUT_6 = '6',
}

@Injectable({
  providedIn: 'root',
})
export class ShortcutService {
  private shortcuts = new Map<KeyboardShortcuts, string>([
    [KeyboardShortcuts.SHORTCUT_0, this.translateService.instant('layout.header.shortcuts.details')],
    [KeyboardShortcuts.SHORTCUT_1, this.translateService.instant('layout.header.shortcuts.home')],
    [KeyboardShortcuts.SHORTCUT_2, this.translateService.instant('layout.header.shortcuts.main')],
    [KeyboardShortcuts.SHORTCUT_4, this.translateService.instant('layout.header.shortcuts.search')],
    [KeyboardShortcuts.SHORTCUT_6, this.translateService.instant('layout.header.shortcuts.menu')],
  ]);

  constructor(private translateService: TranslateService) {}

  public getShortcuts(): Map<KeyboardShortcuts, string> {
    return this.shortcuts;
  }
}
