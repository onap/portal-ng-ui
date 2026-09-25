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
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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
  // Fetched at runtime rather than imported, so that a version.json mounted by the deployment is shown
  // instead of the placeholder the file carries at build time.
  readonly versionNumber$: Observable<string> = from(
    fetch('assets/version.json').then(rsp => rsp.json() as Promise<{ number: string }>),
  ).pipe(
    map(version => version.number),
    catchError(() => of('')),
  );

  @Input() isSidebarCollapsed = false;

  public ACCESS_KEY = KeyboardShortcuts;
  public isKpiDashboardSubMenuCollapsed = false;

  collapsed() {
    this.isKpiDashboardSubMenuCollapsed = !this.isKpiDashboardSubMenuCollapsed;
  }
}
