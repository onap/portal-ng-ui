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

import { Router } from '@angular/router';
import { filterBuilder, FilterOperator } from 'src/app/helpers/filter-helpers';

/**
 * A JSONPath filter. One or more `Filter`s can be passed to the `filter=` param of the alarm API.
 */
export interface Filter {
  /**
   * The field to compare against, i.e `$.type`
   */
  parameter: string;
  /**
   * The JSONPath Filter Operators that are used for comparison (subset of [these](https://www.postgresql.org/docs/current/functions-json.html#FUNCTIONS-SQLJSON-FILTER-EX-TABLE)).
   * For instance `==` and `like_regex`:
   * ```
   * $.id == 1
   * $.type like_regex "type_(a|b)"
   * ```
   */
  operator: FilterOperator;
  /**
   * The value or pattern that the field should have, i.e `"type_(a|b)"`
   */
  value: string | number;
}

/**
 * This represents one filter expression for one column.
 * Use `undefined` to signal removal of the filter.
 *
 * Note that parameter needs to be the complete param (i.e `$.column`).
 * That is necessary because this will be the key when parsing the filter expression into a map.
 */
export type ColumnFilter = {
  parameter: string;
  filter: Filter | undefined;
};

export function changePage(router: Router, page: number): void {
  router.navigate([], { queryParams: { page }, queryParamsHandling: 'merge' });
}

export function changePageSize(router: Router, pageSize: number): void {
  router.navigate([], {
    queryParams: { page: 1, pageSize },
    queryParamsHandling: 'merge',
  });
}

export function changeFilter(router: Router, value: string | undefined): void {
  router.navigate([], {
    queryParams: { filter: value ? value.trim() : undefined, page: 1 },
    queryParamsHandling: 'merge',
  });
}

/**
 * Format a JSONPath filter expression into the format required by the angular router.
 * Add or update this filter param in the router.
 * @param router the angular router
 * @param filters the filter expression in JSONPath format
 * @param path path for new router link
 * @param params other queryParams
 */
export function changeFiltersInRouter(
  router: Router,
  filters: Map<string, Filter>,
  params?: { [key: string]: any },
  path?: any[],
): void {
  const composedFilter = filters.size > 0 ? filterBuilder(filters) : undefined;
  router.navigate(path ?? [], {
    queryParams: { filter: composedFilter, ...params, page: 1 },
    queryParamsHandling: 'merge',
  });
}
