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


import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/layout/header/header/header.component';
import { OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';
import { AuthConfigModule } from './modules/auth/auth.config.module';
import { HttpClientModule } from '@angular/common/http';
import { AlertModule } from './modules/alerting';
import { ModalContentComponent } from './components/modal/modal-content';
import { RequestCache, RequestCacheService } from './services/cacheservice/request-cache.service';
import { httpInterceptorProviders } from './http-interceptors/interceptors';
import { SidemenuComponent } from './components/layout/sidemenu/sidemenu.component';
import { ConfirmationModalComponent } from './components/shared/confirmation-modal/confirmation-modal.component';
import { environment } from '../environments/environment';
import { ApiModule, Configuration } from '../../openapi/output';
import { LoadingIndicatorService } from 'src/app/services/loading-indicator.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found';
import { RouteReuseStrategy } from '@angular/router';
import { AppRouteReuseStrategy } from './router.strategy';
import { StatusPageComponent } from './components/shared/status-page/status-page.component';
import { UserAdministrationModule } from './modules/user-administration/user-administration.module';
import { SharedModule } from './shared.module';
import { AppStarterModule } from './modules/app-starter/app-starter.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
// Sentry.init({
//   dsn: 'http://726f0fcf0f55429eb1c7e613d25d2daf@10.212.1.83:9000/2',

//   // Enable performance metrics: https://docs.sentry.io/performance-monitoring/getting-started/?platform=javascript
//   integrations: [new TracingIntegrations.BrowserTracing()],
//   tracesSampleRate: 0.2,
// });

// @Injectable()
// export class SentryErrorHandler implements ErrorHandler {
//   constructor() {}
//   handleError(error: any) {
//     Sentry.captureException(error.originalError || error);
//     throw error;
//   }
// }

export function changeConfig() {
  return new Configuration({ basePath: environment.backendServerUrl });
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ModalContentComponent,
    SidemenuComponent,
    PageNotFoundComponent,
    ConfirmationModalComponent,
    StatusPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AuthConfigModule,
    AlertModule,
    AuthConfigModule,
    ApiModule.forRoot(changeConfig),
    OAuthModule.forRoot({ resourceServer: { sendAccessToken: false } }),
    BrowserAnimationsModule,
    UserAdministrationModule,
    DashboardModule,
    SharedModule,
    AppStarterModule,
   ],
  // { provide: ErrorHandler, useClass: SentryErrorHandler },
  providers: [
    { provide: RequestCache, useClass: RequestCacheService },
    httpInterceptorProviders,
    { provide: OAuthStorage, useValue: localStorage },
    LoadingIndicatorService,
    { provide: RouteReuseStrategy, useClass: AppRouteReuseStrategy },
  ],
  bootstrap: [AppComponent],
  entryComponents: [ModalContentComponent, ConfirmationModalComponent],
})
export class AppModule {}
