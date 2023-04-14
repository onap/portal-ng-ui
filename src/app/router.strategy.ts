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


import {ActivatedRouteSnapshot, DetachedRouteHandle, BaseRouteReuseStrategy} from '@angular/router';

export class AppRouteReuseStrategy implements BaseRouteReuseStrategy {
  public shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    if(future.data.reuseComponent) {
      return false
    }
    return (future.routeConfig === curr.routeConfig);
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return true;
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return false;
  }

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return false;
  }

  store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void;
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void;
  store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle | null): void {
    //this is intentional
  }

}
