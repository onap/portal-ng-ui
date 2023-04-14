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


import { Sort, SortDirection } from '../components/shared/sort/sort.component';
import { Router } from '@angular/router';

export function parseSortStringToSort(str: string): Sort {
  return str.startsWith('-')
    ? { parameter: str.split('-')[1], direction: SortDirection.DESC }
    : { parameter: str, direction: SortDirection.ASC };
}
export function applyNewSorting(router: Router, sort: Sort) {
  if (sort.direction === SortDirection.NONE) {
    router.navigate([], {
      queryParams: { page: 1, sort: null },
      queryParamsHandling: 'merge',
    });
  } else {
    router.navigate([], {
      queryParams: { page: 1, sort: sort.direction === SortDirection.ASC ? sort.parameter : '-' + sort.parameter },
      queryParamsHandling: 'merge',
    });
  }
}
export function parseSortToSortString(sort: Sort): string {
  if (sort.direction === SortDirection.ASC) {
    return sort.parameter;
  }
  if (sort.direction === SortDirection.DESC) {
    return '-' + sort.parameter;
  }
  return '';
}

export function parseSortToSortJsonString(sort: Sort): string {
  if (sort.direction === SortDirection.ASC) {
    return '$.' + sort.parameter;
  }
  if (sort.direction === SortDirection.DESC) {
    return '-$.' + sort.parameter;
  }
  return '';
}
