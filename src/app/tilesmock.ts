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

import { Tile } from './model/tile';

export const TILESMOCK: Tile[] = [
  {
    id: 1,
    title: 'tile1',
    image_url: 'tile1.url',
    image_alt_text: 'tile1',
    description: 'tile1 desc',
    redirect_url: 'redirect_url',
    headers: 'header tile1',
  },
  {
    id: 2,
    title: 'tile2',
    image_url: 'tile2.url',
    image_alt_text: 'tile2',
    description: 'tile2 desc',
    redirect_url: 'redirect_url',
    headers: 'header tile2',
  },
];
