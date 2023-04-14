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


import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';

/**
 * This is a wrapper component for the `ngbPagination` component of ngBootstrap ([official wiki page](https://ng-bootstrap.github.io/#/components/pagination/overview)).
 * This contains the pagination element, as well as the selection element for the page size.
 *
 *
 * Deal with both using the `pageChange` and `pageSizeChange` events, i.e in your template:
 * ``` html
 * <app-pagination
 *    [collectionSize]="..."
      [pageSize]="..."
      [page]="..."
 *    (pageChange)="changePage($event)"
 *    (pageSizeChange)="changePageSize($event)"
 * >
 * </app-pagination>
 * ```
 */
@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
  providers: [NgbPaginationConfig],
})
export class PaginationComponent {
  /**
   * This event is fired when an item in the `select`-element is changed
   */
  @Output() pageSizeChange: EventEmitter<number> = new EventEmitter<number>();

  /**
   * Specify what page sizes should be selectable by the user.
   */
  @Input() itemsPerPage = [10, 20, 50];

  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
  @Input() collectionSize = 10;
  @Input() pageSize = 10;
  @Input() page = 1;

  constructor(config: NgbPaginationConfig) {
    config.boundaryLinks = true;
    config.directionLinks = true;
    config.disabled = false;
    config.ellipses = false;
    config.maxSize = 3;
    config.pageSize = 10;
    config.rotate = true;
    config.size = 'sm';
  }

  /**
   * Emit the currently selected page from the `ngb-Pagination`
   * @param page the page that is selected
   */
  emitPageChange(page: number) {
    this.pageChange.emit(page);
  }

  /**
   * Emit the currently selected page size from the `select`
   * @param size the number of items per page that is selected
   */
  emitModelChange(size: number) {
    this.pageSizeChange.emit(size);
  }
}
