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

import { Injectable } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ModalContentComponent } from './modal-content';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(
    private modalService: NgbModal,
    private modalConfig: NgbModalConfig,
  ) {
    // customize default values of modals used by this component tree
    modalConfig.backdrop = 'static';
    modalConfig.keyboard = false;
  }

  open(message: string) {
    const modalRef = this.modalService.open(ModalContentComponent, { backdropClass: 'backdropClass' });
    modalRef.componentInstance.message = message;
  }
}
