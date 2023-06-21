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

import { Component, Injectable, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import VersionJson from 'src/assets/version.json';
import { KeyboardShortcuts } from '../../../services/shortcut.service';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.css'],
})
export class SidemenuComponent {
  versionNumber: string;

  @Input() isSidebarCollapsed = false;

  public ACCESS_KEY = KeyboardShortcuts;
  public isKpiDashboardSubMenuCollapsed = false;

  constructor() {
    this.versionNumber = VersionJson.number;
  }
  collapsed() {
    this.isKpiDashboardSubMenuCollapsed = !this.isKpiDashboardSubMenuCollapsed;
  }
}
