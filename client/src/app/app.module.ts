import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { AppComponent } from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AppRoutingModule} from "./app-routing.module";
import { SiteLayoutComponent } from './shared/layouts/site-layout/site-layout.component';
import { MainComponent } from './main/main.component';
import { LoaderComponent } from './loader/loader.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AdminPanelLayoutComponent } from './shared/layouts/admin-panel-layout/admin-panel-layout.component';
import {TokenInterceptor} from "./shared/classes/token.interceptor";
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { SingleCollectionComponent } from './main/single-collection/single-collection.component';
import { CollectionPageComponent } from './collection-page/collection-page.component';
import { SecondaryLayoutComponent } from './shared/layouts/secondary-layout/secondary-layout.component';
import { ProductPageComponent } from './product-page/product-page.component';
import { ProductFormComponent } from './collection-page/product-form/product-form.component';
import { AdminPageComponent } from './admin-page/admin-page.component';

@NgModule({
  declarations: [
    AppComponent,
    SiteLayoutComponent,
    MainComponent,
    LoaderComponent,
    LoginPageComponent,
    AdminPanelLayoutComponent,
    NotFoundPageComponent,
    SingleCollectionComponent,
    CollectionPageComponent,
    SecondaryLayoutComponent,
    ProductPageComponent,
    ProductFormComponent,
    AdminPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: TokenInterceptor
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
