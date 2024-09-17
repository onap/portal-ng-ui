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

import { AfterViewChecked, Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

//This directive we are using in switch functionality at attribute pane. We can hide attributes without value or show all the attributes.
// We are using this directive in the html file in the element (div) that wraps all the app-detail-rows.

@Directive({
  selector: '[appHideEmptyDetailRow]',
})
export class HideEmptyDetailRowDirective implements OnChanges, AfterViewChecked {
  @Input() appHideEmptyDetailRow!: boolean;
  constructor(private el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.appHideEmptyDetailRow && this.el.nativeElement.textContent) {
      this.setVisibility(this.el);
    }
  }

  ngAfterViewChecked() {
    if (this.appHideEmptyDetailRow && this.el.nativeElement.textContent) {
      this.setVisibility(this.el);
    }
  }

  public setVisibility(ref: ElementRef) {
    if (this.appHideEmptyDetailRow) {
      const detailRows = ref.nativeElement.querySelectorAll('app-detail-row');
      detailRows.forEach((item: any) => {
        const span = item.querySelector('span');
        if (!span) {
          return;
        }
        if (span.textContent === '' || span.textContent === '-') {
          item.style.display = 'none';
        } else {
          item.style.display = 'block';
        }
      });
    } else {
      const detailRows = ref.nativeElement.querySelectorAll('app-detail-row');
      detailRows.forEach((item: any) => {
        item.style.display = 'block';
      });
    }
  }
}
