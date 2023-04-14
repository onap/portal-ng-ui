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


import { Component, Input, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Alert, AlertType } from './alert.model';
import { AlertService } from './alert.service';
import { UnsubscribeService } from 'src/app/services/unsubscribe/unsubscribe.service';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Problem } from '../../../../openapi/output';
import DownstreamSystemEnum = Problem.DownstreamSystemEnum;

@Component({
  selector: 'app-alert',
  templateUrl: 'alert.component.html',
  styleUrls: ['alert.component.css'],
  providers: [UnsubscribeService],
})
export class AlertComponent implements OnInit {
  @Input() id = 'default-alert';
  @Input() fade = true;

  isCollapsed = true;
  informativeAlerts: AlertType[] = [AlertType.Success, AlertType.Info];
  alerts: Alert[] = [];
  alertSubscription!: Subscription;
  routeSubscription!: Subscription;
  AlertType = AlertType;
  environment = environment;
  DownstreamSystem = DownstreamSystemEnum;
  constructor(
    private router: Router,
    private alertService: AlertService,
    private unsubscribeService: UnsubscribeService,
  ) {}

  ngOnInit() {
    // subscribe to new alert notifications
    this.alertSubscription = this.alertService.alerts
      .pipe(takeUntil(this.unsubscribeService.unsubscribe$))
      .subscribe(alert => {
        // clear alerts when an empty alert is received
        if (!alert.message) {
          // filter out alerts without 'keepAfterRouteChange' flag
          this.alerts = this.alerts.filter(x => x.keepAfterRouteChange);

          // remove 'keepAfterRouteChange' flag on the rest
          this.alerts.forEach(x => delete x.keepAfterRouteChange);
          return;
        }
        if (this.alerts.filter(a => a.message === alert.message).length === 0) {
          // add alert to array
          this.alerts.push(alert);
        }
        // auto close alert if required
        if (alert.type === AlertType.Warning) {
          setTimeout(() => this.removeAlert(alert), 10000);
        }
      });

    // clear alerts on location change
    this.routeSubscription = this.router.events
      .pipe(takeUntil(this.unsubscribeService.unsubscribe$))
      .subscribe(event => {
        if (event instanceof NavigationStart) {
          this.alertService.clear(this.id);
        }
      });
  }

  removeAlert(alert: Alert) {
    // check if already removed to prevent error on auto close
    if (!this.alerts.includes(alert)) {
      return;
    }

    if (this.fade) {
      // fade out alert
      this.alerts.find(x => x === alert)!.fade = true;

      // remove alert after faded out
      setTimeout(() => {
        this.alerts = this.alerts.filter(x => x !== alert);
      }, 250);
    } else {
      // remove alert
      this.alerts = this.alerts.filter(x => x !== alert);
    }
  }

  cssClass(alert: Alert) {
    if (!alert) {
      return;
    }

    const classes = ['show', 'alert', 'alert-dismissable'];

    const alertTypeClass = {
      /*
      [AlertType.Success]: 'alert alert-success',
      [AlertType.Error]: 'alert alert-danger',
      [AlertType.Info]: 'alert alert-info',
      [AlertType.Warning]: 'alert alert-warning'
      */
      [AlertType.Success]: 'alert-success',
      [AlertType.Error]: 'alert-danger',
      [AlertType.Info]: 'alert-info',
      [AlertType.Warning]: 'alert-warning',
    };

    classes.push(alertTypeClass[alert.type]);

    if (alert.fade) {
      classes.push('fade');
    }

    return classes.join(' ');
  }
}
