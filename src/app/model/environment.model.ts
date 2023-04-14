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


export interface Environment {
  customStyleEnabled: boolean;
  backendServerUrl: string;
  hostname: string;
  keycloakEditProfile: string;
  production: boolean;
  keycloak: KeycloakEnvironment;
  dateTimeFormat: string;
  loggingUrl: string;
  loggingEnabled: boolean
  supportUrlLink: string

}

export interface KeycloakEnvironment {
  issuer: string;
  redirectUri: string;
  clientId: string;
  responseType: string;
  scope: string;
  requireHttps: boolean;
  showDebugInformation: boolean;
  disableAtHashCheck: boolean;
  skipIssuerCheck: boolean;
  strictDiscoveryDocumentValidation: boolean;
}
