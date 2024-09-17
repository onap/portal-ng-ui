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

import { Filter } from 'src/app/helpers/listing';

/**
 * The JSONPath Filter Operators that are used for comparison (subset of [these](https://www.postgresql.org/docs/current/functions-json.html#FUNCTIONS-SQLJSON-FILTER-EX-TABLE)).
 * For instance:
 * ```
 * $.id == 1
 * $.type like_regex "type_(a|b)"
 * ```
 */
export enum FilterOperator {
  EQUAL = ' == ',
  NOT_EQUAL = ' != ',
  LIKE_REGEX = ' like_regex ',
  OR = ' || ',
  EQUAL_IN = ' IN ',
}

/**
 * Turns a Filter that is not formatted into a valid JSONPath one
 * @param filter the filter that is not in JSONPath format
 * @param string pass string: true if you want a return type string
 * @returns a Filter with formatted: true or a string when parameter string: true
 */
export function createJsonPathFilter(filter: Filter): Filter;
export function createJsonPathFilter(filter: Filter, returnsString: true): string;
export function createJsonPathFilter(filter: Filter, returnsString = false): Filter | string {
  // like_regex only works with strings
  if (filter.operator === FilterOperator.LIKE_REGEX) {
    if (returnsString) {
      return createFilter(addFieldPrefix(filter.parameter), filter.operator, toSearchRegex(filter.value.toString()));
    }
    return {
      parameter: addFieldPrefix(filter.parameter),
      operator: filter.operator,
      value: toSearchRegex(filter.value.toString()),
    };
  }
  if (typeof filter.value === 'number') {
    if (returnsString) {
      return createFilter(addFieldPrefix(filter.parameter), filter.operator, filter.value.toString());
    }
    return {
      parameter: addFieldPrefix(filter.parameter),
      operator: filter.operator,
      value: filter.value,
    };
  }
  if (returnsString) {
    return createFilter(addFieldPrefix(filter.parameter), filter.operator, quote(filter.value));
  }
  return {
    parameter: addFieldPrefix(filter.parameter),
    operator: filter.operator,
    value: quote(filter.value),
  };
}

/**
 * Concatenates the provided input into a string.
 * @param parameter the field to filter
 * @param value the value it should match
 * @param operator the operator for comparison (`==`,`!=`,`like_regex`,...)
 * @param forApi
 * @returns a concatenated string
 */
export function createFilter(
  parameter: string,
  operator: FilterOperator,
  value: string | string[],
  forApi = false,
): string {
  if (forApi && operator === FilterOperator.EQUAL_IN) {
    const valueArray = Array.isArray(value) ? value : value.split(',');
    return addParentheses(createOrCondition(composeFilterFromArray(valueArray, parameter, FilterOperator.EQUAL)));
  }
  return `${parameter}${operator}${value}`;
}
/**
 * Create array of composed filter
 * @param value array of strings e.g array of IDs for alarms
 * @param parameter the field to filter e.g $.id
 * @param operator the operator for comparison
 * @returns a string[]
 */
function composeFilterFromArray(value: string[], parameter: string, operator: FilterOperator): string[] {
  return value.reduce((acc: string[], curr) => [...acc, `${parameter}${operator}${curr}`], []);
}
/**
 * Join array of string  using '||' operator
 * @param value string[]
 * @returns a string
 */
function createOrCondition(value: string[]) {
  return value.join(FilterOperator.OR);
}
/**
 * Wraps a string in parentheses `"string"` -> `("string")`
 * @param value string to wrap in quotes
 * @returns a string wrapped in quotes
 */
function addParentheses(value: string) {
  return ` ( ${value} ) `;
}
/**
 * Wraps a string in quotes `"string"` -> `"'string'"`
 * @param value string to wrap in quotes
 * @returns a string wrapped in quotes
 */
export function quote(value: string): string {
  return `"${value}"`;
}

/**
 * Add a `$.` prefix to the provided field
 * @param value the field to match against
 * @returns the field with a `$.` prefix
 */
export function addFieldPrefix(value: string): string {
  return `$.${value}`;
}

/**
 * Concatenate a list of categories into a regex expression for alternative matches.
 * I.e `[a,b,c]` -> `"^(a|b|c)$"`
 * @param categories the alternative values that should be matched
 * @returns a regex expression of alternative matches
 */
export function toCategoricalRegex(categories: string[]): string {
  return `"^(${categories.join('|')})$"`;
}

/**
 * Extracts the list of categories from a given regular expression.
 * I.e `"^(a|b|c)$"` -> `[a,b,c]`
 * @param regex a regex expression of alternative matches
 * @returns the categories from the regex
 */
export function fromCategoricalRegex(regex: string): string[] {
  let strippedRegex = regex.slice(3, regex.length - 3);
  return strippedRegex.split('|');
}

/**
 * Turns the given searchTerm into a case insensitive value to be used with like_regex
 * I.e `term` -> `"term" flag "i"`
 * @param searchTerm the search term
 * @returns the term in the format to be used with like_regex
 */
export function toSearchRegex(searchTerm: string): string {
  return `"${searchTerm}" + flag "i"`;
}

/**
 * Strips the value of a like_regex filter off its formatting.
 * I.e `"value" flag "i"` -> `value`
 * @param regex the value for the `like_regex` operation
 * @returns the value without quotes and flags
 */
export function fromSearchRegex(regex: string): string {
  const rawValue = regex?.split(' ')[0];
  if (rawValue.charAt(0) != '"' || rawValue.charAt(rawValue.length - 1) != '"') {
    throw new Error('Error while extracting the value from the url. Is it in the correct format?');
  }
  return rawValue.substring(1, rawValue.length - 1);
}

/**
 * Join the individual filters with `&&` into a long expression
 * @param filters the array of filter strings
 * @returns a long filter string chained by `&&`'s
 */
export function composeFilter(filters: string[]): string {
  return filters.join('&&');
}

/**
 * Turn the provided string of filters into a Map of filters
 * @param filter the filter string
 * @returns a Map of filters
 */
export function parseFilterFromUrl(filter: string | null): Map<string, Filter> {
  if (!filter) {
    return new Map<string, Filter>();
  }
  const filters = filter.split('&&');
  return splitFilterByOperator(filters);
}

/**
 * Parse a list of strings in filter format into a Map of Filters
 * @param filters list of strings in format `['']`
 * @returns a map of Filters
 */
function splitFilterByOperator(filters: string[]): Map<string, Filter> {
  const mappedFilters = new Map<string, Filter>();
  filters
    .map(filter => {
      if (filter.includes(FilterOperator.EQUAL_IN)) {
        const [parameter, value] = filter.split(FilterOperator.EQUAL_IN);
        return { parameter, value, operator: FilterOperator.EQUAL_IN };
      }
      if (filter.includes(FilterOperator.EQUAL)) {
        const [parameter, value] = filter.split(FilterOperator.EQUAL);
        return { parameter, value, operator: FilterOperator.EQUAL };
      }
      if (filter.includes(FilterOperator.NOT_EQUAL)) {
        const [parameter, value] = filter.split(FilterOperator.NOT_EQUAL);
        return { parameter, value, operator: FilterOperator.NOT_EQUAL };
      }
      if (filter.includes(FilterOperator.LIKE_REGEX)) {
        const [parameter, value] = filter.split(FilterOperator.LIKE_REGEX);
        return { parameter, value, operator: FilterOperator.LIKE_REGEX };
      }
      throw new Error('Unsupported operator');
    })
    .forEach(item => mappedFilters.set(item.parameter, item));
  return mappedFilters;
}

/**
 * Transforms the map of filters back into a JSONPATH filter string
 * @param filters
 * @param forApi
 * @returns a string containing all filter expressions or undefined if size of the Filter Map is 0
 */
export function filterBuilder(filters: Map<string, Filter>, forApi = false): string | undefined {
  if (filters.size === 0) {
    return undefined;
  }
  const filtersString: string[] = [];
  for (const [, filter] of filters.entries()) {
    filtersString.push(createFilter(filter.parameter, filter.operator, filter.value.toString(), forApi));
  }
  return composeFilter(filtersString);
}
