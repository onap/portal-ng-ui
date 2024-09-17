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
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { from, Observable, of } from 'rxjs';
import { Tile } from 'src/app/model/tile';

@Component({
  selector: 'app-app-starter',
  templateUrl: './app-starter.component.html',
  styleUrls: ['./app-starter.component.css'],
})
export class AppStarterComponent implements OnInit {
  //I will leave this for future purpose in case we will have disabled tiles in the Portal
  // disabledTiles:number[] = [11,12,13]

  private readonly hostname = environment.hostname.replace('portal-ui-', '');

  public readonly tiles$: Observable<Tile[]> = from(
    fetch('/assets/tiles/tiles.json?t=' + Date.now()).then(rsp => rsp.json()),
  ).pipe(
    map(tiles => tiles.items as Tile[]),
    map(tiles => tiles.map(tile => ({ ...tile, redirectUrl: tile.redirectUrl.replace(/HOSTNAME/i, this.hostname) }))),
  );

  ngOnInit(): void {}
}
