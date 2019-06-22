/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import { LoadingService } from './@core/providers';

@Component({
  selector: 'ngx-app',
  template: '<div [nbSpinner]="isLoading" nbSpinnerSize="xxlarge"><router-outlet></router-outlet></div>',
})
export class AppComponent implements OnInit {

  isLoading: boolean = true;
  constructor(private analytics: AnalyticsService, private loading: LoadingService) {
    this.loading.state.subscribe(
      v => this.isLoading = v,
      () => this.isLoading = false,
    );
  }

  ngOnInit(): void {
    this.analytics.trackPageViews();
  }
}
