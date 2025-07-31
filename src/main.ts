import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { provideGoogleCharts } from 'angular-google-charts';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err))
  provideGoogleCharts()
  provideHttpClient();
