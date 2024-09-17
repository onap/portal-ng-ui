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

import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  HostListener,
  ElementRef,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { FullscreenService } from 'src/app/services/fullscreen.service';
import { environment } from 'src/environments/environment';
import { KeyboardShortcuts, ShortcutService } from 'src/app/services/shortcut.service';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @Output() collapse = new EventEmitter<void>();

  /**
   *
   * @param {OAuthService} oauthService
   */
  isOnapTheme = false;
  switchToMainContent: string = '';
  isFullScreen = false;
  changePasswordUrl = `${environment.keycloak.hostname}/realms/${environment.keycloak.realm}/account/password`;
  shortcuts: Map<KeyboardShortcuts, string> = this.shortcutService.getShortcuts();

  public ACCESS_KEY = KeyboardShortcuts;
  @ViewChild('myNavElement') myNavElement!: ElementRef;

  constructor(
    private readonly fullscreenService: FullscreenService,
    private readonly oauthService: OAuthService,
    private offcanvasService: NgbOffcanvas,
    private shortcutService: ShortcutService,
  ) {}
  ngOnInit(): void {
    this.checkScreenMode();
  }

  @HostListener('document:fullscreenchange', ['$event'])
  @HostListener('document:webkitfullscreenchange', ['$event'])
  @HostListener('document:mozfullscreenchange', ['$event'])
  @HostListener('document:MSFullscreenChange', ['$event'])
  private checkScreenMode() {
    this.isFullScreen = !!document.fullscreenElement;
  }

  public openFullscreen() {
    this.fullscreenService.enter();
  }
  public closeFullscreen() {
    this.fullscreenService.leave();
  }

  public logIn() {
    this.oauthService.initCodeFlow();
  }

  public logOut() {
    this.oauthService.logOut();
  }

  get profile() {
    const claims = Object(this.oauthService.getIdentityClaims());
    return claims.given_name ? claims.given_name : 'no Name';
  }

  get email() {
    const claims = Object(this.oauthService.getIdentityClaims());
    return claims.email ? claims.email : 'no Email';
  }

  public toggleSidenav() {
    this.collapse.emit();
  }

  public openCanvas(content: TemplateRef<any>) {
    const isCanvasOpened = this.offcanvasService.hasOpenOffcanvas();
    if (isCanvasOpened) {
      this.offcanvasService.dismiss();
    } else {
      this.offcanvasService.open(content, { ariaLabelledBy: 'Keyboard shortcuts', position: 'end' });
    }
  }
}
