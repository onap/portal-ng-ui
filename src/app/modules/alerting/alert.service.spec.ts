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

// https://dev.to/coly010/unit-testing-angular-services-1anm
import { Alert, AlertType } from './alert.model';
import { TestBed } from '@angular/core/testing';
import { AlertModule } from './alert.module';
import { AlertService } from './alert.service';
import { Subject } from 'rxjs';
import SpyObj = jasmine.SpyObj;

/**
 * describe sets up the Test Suite for the TileService
 */
describe('AlertService', () => {
  let service: AlertService;
  let mockAlert: Alert;
  let message: string;
  let spyAlert: SpyObj<any>;
  let subject: Subject<Alert>;

  /**
   * beforeEach tells the test runner to run this code before every test in the Test Suite
   * It is using Angular's TestBed to create the testing environment and finally it is injecting the TilesService
   * and placing a reference to it in the service variable defined earlier.
   */
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlertService, AlertModule, Subject],
    });
    service = TestBed.inject(AlertService);
    subject = TestBed.inject(Subject);
    mockAlert = TestBed.inject(Alert);
    spyAlert = spyOn(service, 'alert');
    message = 'This is a test-alert';
    mockAlert.message = message;
  });

  it('should be create', () => {
    expect(service).toBeTruthy();
  });
  /**
   * tests for the alert methods info, warning, error and success with a spyobject
   */
  it('should return success alert', () => {
    mockAlert.type = AlertType.Success;
    service.success(message);
    expect(spyAlert).toHaveBeenCalledWith(mockAlert);
  });

  it('should return warning alert', () => {
    mockAlert.type = AlertType.Warning;
    service.warn(message);
    expect(spyAlert).toHaveBeenCalledWith(mockAlert);
  });

  it('should return error alert', () => {
    mockAlert.type = AlertType.Error;
    service.error(message);
    expect(spyAlert).toHaveBeenCalledWith(mockAlert);
  });

  it('should return info alert', () => {
    mockAlert.type = AlertType.Info;
    service.info(message);
    expect(spyAlert).toHaveBeenCalledWith(mockAlert);
  });

  it('clear ', () => {
    subject = service['subject'];
    const spy = spyOn(subject, 'next');
    const alert = new Alert();
    alert.id = 'default-alert';
    service.clear();
    expect(spy).toHaveBeenCalledWith(alert);
  });
});
