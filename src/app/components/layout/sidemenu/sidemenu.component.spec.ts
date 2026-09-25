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


import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

import { SidemenuComponent } from './sidemenu.component';

describe('SidemenuComponent', () => {
  let fixture: ComponentFixture<SidemenuComponent>;

  async function render(): Promise<HTMLElement> {
    await TestBed.configureTestingModule({
      declarations: [SidemenuComponent],
      imports: [TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(SidemenuComponent);
    fixture.detectChanges();
    await firstValueFrom(fixture.componentInstance.versionNumber$);
    fixture.detectChanges();
    return fixture.nativeElement.querySelector('.portal-version-number');
  }

  it('shows the version from the deployed assets/version.json', async () => {
    const fetchSpy = spyOn(window, 'fetch').and.resolveTo(new Response(JSON.stringify({ number: '0.2.0' })));

    const version = await render();

    expect(fetchSpy).toHaveBeenCalledWith('assets/version.json');
    expect(version.textContent?.trim()).toBe('0.2.0');
  });

  it('shows no version when assets/version.json cannot be loaded', async () => {
    spyOn(window, 'fetch').and.rejectWith(new TypeError('Failed to fetch'));

    const version = await render();

    expect(version.textContent?.trim()).toBe('');
  });
});
