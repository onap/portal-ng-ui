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
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Tile, TilesListResponse } from '../../model/tile';
import { map } from 'rxjs/operators';

export const urlTileApi = environment.backendServerUrl + '/tiles';

@Injectable({
  providedIn: 'root',
})
// Tutorial on the http client: https://angular.io/tutorial/toh-pt6#get-heroes-with-httpclient
export class TilesService {
  constructor(private httpClient: HttpClient) {}
  /**
   * GET tiles from the server
   */
  getTiles(refresh = false): Observable<Tile[]> {
    if (refresh) {
      const headers = new HttpHeaders({ 'x-refresh': 'true' });
      return this.httpClient
        .get<TilesListResponse>(urlTileApi, { headers })
        .pipe(map(tilesListResponse => tilesListResponse.items));
    }

    return this.httpClient.get<TilesListResponse>(urlTileApi).pipe(map(tilesListResponse => tilesListResponse.items));
  }

  /**
   * GET tile by id
   * @param id to get specific tile
   */
  getTileById(id: number): Promise<Tile> {
    return this.httpClient.get<Tile>(urlTileApi + '/' + id).toPromise();
  }

  /**
   * POST: add a new tile to the database
   * @param tile
   * @returns the new saved tile
   */
  saveTiles(tile: Tile): Promise<Tile> {
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.httpClient.post<Tile>(urlTileApi, tile, options).toPromise();
  }

  /**
   * PUT: update the tile on the server
   * @returns the updated hero
   * @param tile
   */
  updateTiles(tile: Tile): Promise<Tile> {
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.httpClient.put<Tile>(urlTileApi + '/' + tile.id, tile, options).toPromise();
  }

  /**
   * DELETE: delete the tile from the server
   * @param tile to delete
   */
  deleteTile(tile: Tile): Promise<void> {
    return this.httpClient.delete<void>(urlTileApi + '/' + tile.id).toPromise();
  }
}
