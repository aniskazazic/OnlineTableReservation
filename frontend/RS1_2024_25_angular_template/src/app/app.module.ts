import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {MyAuthInterceptor} from './services/auth-services/my-auth-interceptor.service';
import {ErrorInterceptor} from './services/ErrorInterceptor';
import {MyAuthService} from './services/auth-services/my-auth.service';
import {SharedModule} from './modules/shared/shared.module';
import {AuthModule} from './modules/auth/auth.module';
import { LocaleGetByCategoryComponent } from './endpoints/locale-get-by-category/locale-get-by-category.component';
import { AddLocaleComponent } from './modules/add-locale/add-locale.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {DragDrop} from '@angular/cdk/drag-drop';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Make sure this is imported
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {CustomTranslateLoader} from './services/translate-loader';
import {HttpClient} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { CheckoutComponent } from './modules/checkout/checkout.component';
import { NgChartsModule } from 'ng2-charts';

import { SuccessComponent } from './modules/success/success.component';
import {NgApexchartsModule} from 'ng-apexcharts'; // Make sure this is imported

import { ToastrModule } from 'ngx-toastr';


import { AiChatComponent } from './modules/AiChat/ai-chat/ai-chat.component';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/i18n/', '.json');  // Postavite putanju na /i18n/
}

@NgModule({
  declarations: [
    AppComponent,
    AddLocaleComponent,
    CheckoutComponent,
    SuccessComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule, // Omogućava korištenje UnauthorizedComponent u AppRoutingModule
    AuthModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    NgApexchartsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right', // može i 'toast-bottom-right', 'toast-top-left' itd.
      timeOut: 3000,                     // koliko traje toast (ms)
      closeButton: true,
      progressBar: true
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => new CustomTranslateLoader(http),
        deps: [HttpClient]
      },
      defaultLanguage: 'bs'
    }),
    DragDropModule,
    NgChartsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MyAuthInterceptor, // Handles 401 and refresh token logic
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor, // Handles other errors
      multi: true,
    },
  ],
  exports: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
