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


import { Component, Inject } from '@angular/core';
import { AlertService } from './modules/alerting';
import { environment } from '../environments/environment';
import { DOCUMENT } from '@angular/common';
import { LoadingIndicatorService } from 'src/app/services/loading-indicator.service';
import { KeyboardShortcuts } from './services/shortcut.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'frontend';
  isCustomStyleEnabled = environment.customStyleEnabled;
  readonly loading$ = this.loadingIndicator.isVisible();
  public isCollapsed = false
  public ACCESS_KEY = KeyboardShortcuts;

  constructor(
    protected alertService: AlertService,
    private loadingIndicator: LoadingIndicatorService,
    @Inject(DOCUMENT) private document: Document,
  ) {
  }

  collapseChanged() {
    this.isCollapsed = !this.isCollapsed;

  }
}
