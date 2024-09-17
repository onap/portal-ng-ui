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

import { DashboardApplications } from './dashboard.model';
import { ActionFilter, ActionInterval } from './user-last-action.model';

export const STATE_KEYS = {
  DASHBOARD: 'dashboard',
  APPS: 'apps',
  TILES: 'availableTiles',
  USER_ACTIONS: 'lastUserAction',
  FILTER_TYPE: 'filterType',
  INTERVAL: 'interval',
};

export interface DashboardModel {
  apps: DashboardAppsModel;
}

export interface DashboardAppsModel {
  availableTiles: DashboardTileSettings[];
  lastUserAction: LastUserActionSettings;
}

export interface UserPreferencesModel {
  dashboard: DashboardModel;
}

export interface UpdateUserPreferenceModel {
  dashboard?: {
    apps?: {
      availableTiles?: DashboardTileSettings[];
      lastUserAction?: LastUserActionSettings;
    };
  };
}

export interface DashboardTileSettings {
  type: DashboardApplications;
  displayed: boolean;
}

export interface LastUserActionSettings {
  interval: ActionInterval;
  filterType: ActionFilter;
}

const availableDashboardApps: DashboardTileSettings[] = [
  {
    type: DashboardApplications.USER_LAST_ACTION_TILE,
    displayed: true,
  },
];

export const defaultLastUserActionSettings: LastUserActionSettings = {
  interval: ActionInterval.LAST1H,
  filterType: ActionFilter.ALL,
};

export const defaultUserSettings: UserPreferencesModel = {
  dashboard: {
    apps: {
      availableTiles: availableDashboardApps,
      lastUserAction: defaultLastUserActionSettings,
    },
  },
};

export const DASHBOARD_SECTION = 'dashboard';
