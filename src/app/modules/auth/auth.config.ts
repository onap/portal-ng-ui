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


import { AuthConfig } from 'angular-oauth2-oidc';
import { environment } from '../../../environments/environment';

export const authConfig: AuthConfig = {
  // Url of the Identity Provider
  issuer: `${environment.keycloak.hostname}/realms/${environment.keycloak.realm}`,

  // URL of the SPA to redirect the user to after login
  redirectUri: environment.keycloak.redirectUri,

  // The SPA's id.
  // The SPA is registerd with this id at the auth-serverß
  clientId: environment.keycloak.clientId,

  responseType: environment.keycloak.responseType,
  // set the scope for the permissions the client should request
  // The first three are defined by OIDC.
  scope: environment.keycloak.scope,
  // Remove the requirement of using Https to simplify the demo
  // THIS SHOULD NOT BE USED IN PRODUCTION
  // USE A CERTIFICATE FOR YOUR IDP
  // IN PRODUCTION
  requireHttps: environment.keycloak.requireHttps,
  // at_hash is not present in JWT token
  showDebugInformation: environment.keycloak.showDebugInformation,
  disableAtHashCheck: environment.keycloak.disableAtHashCheck,
  skipIssuerCheck: environment.keycloak.skipIssuerCheck,
  strictDiscoveryDocumentValidation: environment.keycloak.strictDiscoveryDocumentValidation,
};
