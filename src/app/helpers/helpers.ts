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

import { FormArray, FormGroup } from '@angular/forms';

export function isNotUndefined<T>(val: T | undefined): val is T {
  return val !== undefined;
}

export function isNotNull<T>(val: T | null): val is T {
  return val !== null;
}

export function markAsDirtyAndValidate(formGroup: FormGroup): void {
  Object.values(formGroup.controls).forEach(control => {
    control.markAsDirty();
    control.updateValueAndValidity();
  });
}

export function isNullOrUndefined(val: any): boolean {
  return val === null || val === undefined;
}

export function isNotNullOrUndefined(val: any): boolean {
  return val !== null && val !== undefined;
}

export function isNullOrUndefinedOrEmptyString(val: any): boolean {
  return val === null || val === undefined || val === '';
}

export function isEmptyArray(array: any[]): boolean {
  return !array.length;
}

export function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function areFormControlsValid(form: FormGroup): boolean {
  const formControls = Object.keys(form.controls)
    .map(key => form.controls[key])
    .filter(control => !(control instanceof FormArray));
  return formControls.find(control => control.invalid && (control.dirty || control.touched)) === undefined;
}

export function isString(value: any): boolean {
  return typeof value === 'string' || value instanceof String;
}

export function resetSelectDefaultValue(cssSelector: string): void {
  setTimeout(() => {
    const element = document.querySelector(cssSelector);
    if (element) {
      //@ts-ignore
      document.querySelector(cssSelector)?.selectedIndex = -1;
    }
  }, 0);
}
