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


import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, from, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Tile, TilesListResponse } from '../../model/tile';
import { map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TilesService {
  private readonly hostname = environment.hostname.replace('portal-ui-', '');
  private readonly tilesUrl = '/assets/tiles/tiles.json';

  private tiles$: Observable<Tile[]> | null = null;

  constructor() {}

  getTiles(): Observable<Tile[]> {
    if (!this.tiles$) {
      this.tiles$ = from(fetch(this.tilesUrl).then((rsp) => rsp.json())).pipe(
        map((tiles) => tiles.items as Tile[]),
        map((tiles) =>
          tiles.map((tile) => ({
            ...tile,
            redirectUrl: tile.redirectUrl.replace(/HOSTNAME/i, this.hostname),
          }))
        ),
        shareReplay(1) // Cache and share the result for future subscribers
      );
    }
    return this.tiles$;
  }
}
