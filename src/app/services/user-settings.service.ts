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


import { distinctUntilChanged, map, pluck, switchMap, take } from 'rxjs/operators';
import { PreferencesResponse, PreferencesService } from '../../../openapi/output';
import {
  DashboardAppsModel,
  DashboardModel,
  DashboardTileSettings,
  defaultUserSettings,
  LastUserActionSettings, STATE_KEYS,
  UpdateUserPreferenceModel,
  UserPreferencesModel,
} from '../model/user-preferences.model';
import { BehaviorSubject, Observable, pipe, UnaryFunction } from 'rxjs';
import { mergeWith as _mergeWith, isObject as _isObject } from 'lodash';
import { isString } from '../helpers/helpers';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserSettingsService {
  private userSettings: UserPreferencesModel = defaultUserSettings;
  private preferencesTracker$ = new BehaviorSubject<UserPreferencesModel>(this.userSettings);

  constructor(private preferencesService: PreferencesService) {
    this.getPreferences();
  }

  getPreferences$(): Observable<UserPreferencesModel> {
    return this.preferencesTracker$.asObservable();
  }

  selectDashboard = () =>
    this.getPreferences$().pipe(selectDistinctState<UserPreferencesModel, DashboardModel>(STATE_KEYS.DASHBOARD));
  selectDashboardApps = () =>
    this.selectDashboard().pipe(selectDistinctState<DashboardModel, DashboardAppsModel>(STATE_KEYS.APPS));
  selectDashboardAvailableTiles = () =>
    this.selectDashboardApps().pipe(selectDistinctState<DashboardAppsModel, DashboardTileSettings[]>(STATE_KEYS.TILES));
  selectLastUserAction = () =>
    this.selectDashboardApps().pipe(
      selectDistinctState<DashboardAppsModel, LastUserActionSettings>(STATE_KEYS.USER_ACTIONS),
    );

  getPreferences(): void {
    this.preferencesService
      .getPreferences()
      .pipe(
        map(preferences => {
          return _mergeWith({}, defaultUserSettings, preferences.properties, (objValue, srcValue) => {
            if (
              (Array.isArray(srcValue) && !srcValue.some(_isObject)) ||
              isString(srcValue) ||
              typeof srcValue === 'boolean' ||
              Number.isInteger(srcValue)
            ) {
              return srcValue;
            }
          }) as UserPreferencesModel;
        }),
      )
      .subscribe(userPreferences => {
        this.preferencesTracker$.next(userPreferences);
      });
  }

  updatePreferences(preferences: UpdateUserPreferenceModel): Observable<PreferencesResponse> {
    return this.getPreferences$().pipe(
      take(1),
      switchMap(data => {
        const properties = _mergeWith({}, data, preferences, (objValue, srcValue) => {
          if (
            Array.isArray(srcValue) ||
            isString(srcValue) ||
            typeof srcValue === 'boolean' ||
            Number.isInteger(srcValue)
          ) {
            return srcValue;
          }
        }) as UserPreferencesModel;
        this.preferencesTracker$.next(properties);
        return this.preferencesService.savePreferences({ properties });
      }),
    );
  }

  removePreferences(): Observable<PreferencesResponse> {
    return this.preferencesService.updatePreferences({ properties: {} });
  }
}

export function selectDistinctState<T, I>(key: string): UnaryFunction<Observable<T>, Observable<I>> {
  return pipe(pluck<T, I>(key), distinctUntilChanged<I>());
}
