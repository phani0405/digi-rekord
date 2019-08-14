/**
 * @license
 * @author Radha Krishna
 */
import { APP_BASE_HREF } from '@angular/common';
//import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThemeModule } from './@theme/theme.module';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';


import { AuthModule, PagesModule } from './index';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './feature/not-found/not-found.component';
import { CONFIG } from './app.constant';
import { AuthGuard, LoginUserService } from './helpers/services/service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor, ResponseInterceptor } from './helpers/interceptor/interceptor';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { Broadcaster } from './helpers/services/service';

@NgModule({
  declarations: [AppComponent, NotFoundComponent],
  imports: [
    HttpClientModule,
    BrowserAnimationsModule,
    AuthModule,
    PagesModule,
    ToastModule.forRoot(),
    NgbModule.forRoot(),
    ThemeModule.forRoot(),
    RouterModule.forRoot([
      { path: CONFIG.ROUTES.PRIVATE, loadChildren: 'app/feature/feature.module#PagesModule', canActivate: [AuthGuard] },
      { path: '', redirectTo: CONFIG.ROUTES.LOGIN, pathMatch: 'full' },
      { path: '**', component: NotFoundComponent},
    ], {useHash: true}),
  ],
  providers: [LoginUserService, AuthGuard, Broadcaster,
      {
        provide: HTTP_INTERCEPTORS,
        useClass: TokenInterceptor,
        multi: true,
      },
      {
        provide: HTTP_INTERCEPTORS,
        useClass: ResponseInterceptor,
        multi: true,
      },
    ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
