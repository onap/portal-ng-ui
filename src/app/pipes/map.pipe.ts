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


import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'map',
  pure: false
})
/*
  MapPipe allows us to run a function in a template
  for example, you need to filter out some elements from the array before displaying these elements. You can call a function for getting filtered array
  directly from template, but this function will be triggered everytime when user interacts with page.
  MapPipe allows you to call a function through this pipe, so function will be called only when necessary.
  Usage:
    we have function in .ts file that's called filterZeroValues
    in template we can use this function:
    *ngFor="let item in elements | map : filterZeroValues"
    where the first parameter of map pipe is function to be called, and other parameters will be passed as arguments to this function
    Important note: as you can see from implementation, elements array will be passed to your function as a first argument
*/
export class MapPipe implements PipeTransform {

  transform<T, R>(
    thisArg: T,
    project: (t:T, ...others: any[]) => R,
    ...args: any[]
  ): R {
    return project(thisArg, ...args);
  }

}
