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

import { Environment } from '../app/model/environment.model';

/**
 * The config that is used for local development.
 *
 * It can be replaced during build by using the `fileReplacements` array.
 * `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
 * The list of file replacements can be found in `angular.json`.
 */
export const environment: Environment = {
  customStyleEnabled: true,
  backendServerUrl: window.location.origin + '/api',
  hostname: window.location.hostname,
  production: false,
  keycloak: {
    hostname: window.location.origin, // Url of the Identity Provider
    realm: 'ONAP',
    redirectUri: window.location.origin, // URL of the SPA to redirect the user to after login
    clientId: 'portal-app', // The Frontend is registered with this id at the auth-server
    responseType: 'code',
    scope: 'openid', // set the scope for the permissions the client should request
    requireHttps: false, // Don't require https
    showDebugInformation: false,
    disableAtHashCheck: true, // if at_hash is not present in JWT token
    skipIssuerCheck: true,
    strictDiscoveryDocumentValidation: false,
  },
  dateTimeFormat: 'dd/MM/yyyy  HH:mm:ss',
  loggingUrl: window.location.origin + '/onap_logging',
  supportUrlLink: 'https://wiki.onap.org/',
  loggingEnabled: false,
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
