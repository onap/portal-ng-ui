// @ts-nocheck
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


export const environment: Environment = {
  customStyleEnabled: true,
  backendServerUrl: window.location.origin + '/api',
  hostname: window.location.hostname,
  production: true,
  keycloak: {
    hostname: window["env"]["keycloak"]["hostname"] || `${window.location.origin.replace('portal-ng', 'keycloak')}`,
    realm: window["env"]["keycloak"]["realm"] || 'ONAP',
    redirectUri: window.location.origin, // URL of the SPA to redirect the user to after login
    clientId: window["env"]["keycloak"]["clientId"] || 'portal-app', // The Frontend is registered with this id at the auth-server
    responseType: 'code',
    scope: 'openid', // set the scope for the permissions the client should request
    requireHttps: false, // Don't require https
    showDebugInformation: false,
    disableAtHashCheck: true, // if at_hash is not present in JWT token
    skipIssuerCheck: false,
    strictDiscoveryDocumentValidation: true,
  },
  dateTimeFormat: 'dd/MM/yyyy  HH:mm:ss',
  loggingUrl: window.location.origin + '/onap_logging',
  supportUrlLink: 'https://wiki.onap.org/',
  loggingEnabled: window["env"]["loggingEnabled"] || false,
};
