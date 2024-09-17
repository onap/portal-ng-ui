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

import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { UserSettingsService } from '../../services/user-settings.service';
import { DashboardApplications, DashboardTileSettings } from '../../model/dashboard.model';
import { UnsubscribeService } from '../../services/unsubscribe/unsubscribe.service';
import { map, shareReplay, switchMap, takeUntil } from 'rxjs/operators';
import { merge, Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [UnsubscribeService],
})
export class DashboardComponent implements OnInit {
  DashboardApplications = DashboardApplications;

  public dropAction = new Subject<CdkDragDrop<string[]>>();
  public updateAction = new Subject<DashboardTileSettings>();

  constructor(
    private unsubscribeService: UnsubscribeService,
    private userSettingsService: UserSettingsService,
  ) {}

  public tiles$: Observable<DashboardTileSettings[]> = this.userSettingsService
    .selectDashboardAvailableTiles()
    .pipe(shareReplay({ refCount: true, bufferSize: 1 }));

  filterDisplayedTiles(tiles: DashboardTileSettings[]): DashboardTileSettings[] {
    return tiles.filter(tile => tile.displayed);
  }

  public visibleTiles$: Observable<DashboardTileSettings[]> = this.tiles$.pipe(
    switchMap(tiles =>
      this.updateAction.pipe(
        map(updatedTile => {
          const index = tiles.findIndex(tile => tile.type === updatedTile.type);
          tiles[index].displayed = updatedTile.displayed;
          return [...tiles];
        }),
      ),
    ),
  );

  public movedTiles$: Observable<DashboardTileSettings[]> = this.tiles$.pipe(
    switchMap(tiles =>
      this.dropAction.pipe(
        map(event => {
          moveItemInArray(tiles, event.previousIndex, event.currentIndex);
          return tiles;
        }),
      ),
    ),
  );
  ngOnInit() {
    merge(this.visibleTiles$, this.movedTiles$)
      .pipe(
        takeUntil(this.unsubscribeService.unsubscribe$),
        switchMap(availableTiles =>
          this.userSettingsService.updatePreferences({
            dashboard: {
              apps: {
                availableTiles,
              },
            },
          }),
        ),
      )
      .subscribe();
  }
}
