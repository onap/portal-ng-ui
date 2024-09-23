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


import { Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import {
  ActionFilter,
  ActionInterval,
  ActionModel,
  ActionType,
  EntityType,
} from '../../../../model/user-last-action.model';
import { ActionsListResponse } from '../../../../../../openapi/output';
import { combineLatest, merge, Subject } from 'rxjs';
import { map, scan, shareReplay, switchMap } from 'rxjs/operators';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';
import { selectDistinctState, UserSettingsService } from '../../../../services/user-settings.service';
import { LastUserActionSettings, STATE_KEYS } from '../../../../model/user-preferences.model';
import { HistoryService } from '../../../../services/history.service';

@Component({
  selector: 'app-user-last-action-tile',
  templateUrl: './user-last-action-tile.component.html',
  styleUrls: ['./user-last-action-tile.component.css'],
  providers: [UnsubscribeService],
})
export class UserLastActionTileComponent implements OnInit {
  public readonly actionsFilter: ActionFilter[] = Object.values(ActionFilter);
  public readonly intervals: ActionInterval[] = Object.values(ActionInterval);
  public readonly ActionType = ActionType;
  public readonly EntityType = EntityType;
  public changeFilterType: Subject<ActionFilter> = new Subject<ActionFilter>();
  public changeIntervalType: Subject<ActionInterval> = new Subject<ActionInterval>();

  @ViewChild('template', { static: true }) template!: TemplateRef<unknown>;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private historyService: HistoryService,
    private unsubscribeService: UnsubscribeService,
    private userSettingsService: UserSettingsService,
  ) {}

  private userActionsSettings$ = this.userSettingsService
    .selectLastUserAction()
    .pipe(shareReplay({ refCount: true, bufferSize: 1 }));

  public actionFilterType$ = this.userActionsSettings$.pipe(
    selectDistinctState<LastUserActionSettings, ActionFilter>(STATE_KEYS.FILTER_TYPE as keyof LastUserActionSettings),
    shareReplay({ refCount: true, bufferSize: 1 }),
  );

  public actionIntervalType$ = this.userActionsSettings$.pipe(
    selectDistinctState<LastUserActionSettings, ActionInterval>(STATE_KEYS.INTERVAL as keyof LastUserActionSettings),
    shareReplay({ refCount: true, bufferSize: 1 }),
  );

  public actions$ = combineLatest([this.actionFilterType$, this.actionIntervalType$]).pipe(
    switchMap(([filter, interval]) => {
      const mappedInterval = UserLastActionTileComponent.mapActionInterval(interval);
      return this.historyService.getUserActions(mappedInterval).pipe(
        map(actions => UserLastActionTileComponent.mapActionsFromResponse(actions)),
        map(actions => this.filterBySelectedFilterType(filter, actions)),
      );
    }),
  );

  private commands$ = merge(
    this.changeIntervalType.pipe(map(interval => ({ interval: interval }))),
    this.changeFilterType.pipe(map(filterType => ({ filterType: filterType }))),
  );

  private settings$ = this.userActionsSettings$.pipe(
    switchMap(data => this.commands$.pipe(scan((settings, change) => ({ ...settings, ...change }), data))),
  );

  ngOnInit(): void {
    this.viewContainerRef.createEmbeddedView(this.template);

    this.settings$
      .pipe(
        switchMap(lastUserAction =>
          this.userSettingsService.updatePreferences({
            dashboard: {
              apps: {
                lastUserAction,
              },
            },
          }),
        ),
      )
      .subscribe();
  }

  private static mapActionsFromResponse(actions: ActionsListResponse): ActionModel[] {
    return actions.items.map((action: any) => {
      return {
        actionCreatedAt: action.actionCreatedAt,
        type: action.action.type,
        entity: action.action.entity,
        entityParams: {
          ...action.action.entityParams,
        },
      };
    });
  }

  private static mapActionInterval(interval: ActionInterval): number | undefined {
    switch (interval) {
      case ActionInterval.ALL:
        return undefined;
      case ActionInterval.LAST1D:
        return 24;
      case ActionInterval.LAST1H:
        return 1;
      case ActionInterval.LAST4H:
        return 4;
    }
  }

  private filterBySelectedFilterType(filter: ActionFilter, actions: ActionModel[]): ActionModel[] {
    if (filter === ActionFilter.ALL) {
      return actions;
    } else if (filter === ActionFilter.SEARCH) {
      return actions.filter(action => action.type === ActionType.SEARCH);
    } else {
      return actions.filter(action => action.type !== ActionType.SEARCH);
    }
  }
}
