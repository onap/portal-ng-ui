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


import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AppStarterComponent } from './modules/app-starter/app-starter.component';
import { OAuthLogger, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AlertModule } from './modules/alerting';
import { SidemenuComponent } from './components/layout/sidemenu/sidemenu.component';
import { HeaderComponent } from './components/layout/header/header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { HasPermissionsDirective } from './directives/has-permissions.directive';
import { LoadingIndicatorService } from './services/loading-indicator.service';

describe('AppComponent', () => {
  let component: AppComponent;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          AppComponent,
          AppStarterComponent,
          SidemenuComponent,
          HeaderComponent,
          HasPermissionsDirective,
        ],
        imports: [RouterTestingModule, HttpClientTestingModule, AlertModule, TranslateModule],
        providers: [
          AppComponent,
          UrlHelperService,
          OAuthService,
          OAuthLogger,
          LoadingIndicatorService
        ],
      }).compileComponents();
      component = TestBed.inject(AppComponent);
    }),
  );
  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'frontend'`, () => {
    expect(component.title).toEqual('frontend');
  });
});
