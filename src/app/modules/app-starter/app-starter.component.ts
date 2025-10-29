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


import { Component } from '@angular/core';
import {  map, shareReplay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { from, Observable, of } from 'rxjs';
import { Tile } from 'src/app/model/tile';
import { TilesService } from 'src/app/services/tileservice/tiles.service';

@Component({
  selector: 'app-app-starter',
  templateUrl: './app-starter.component.html',
  styleUrls: ['./app-starter.component.css'],
})
export class AppStarterComponent {
  public tiles$: Observable<Tile[]> = this.tileService.getTiles();

  constructor(private tileService: TilesService) {}
}
