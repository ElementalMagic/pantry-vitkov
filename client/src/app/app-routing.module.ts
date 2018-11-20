import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {SiteLayoutComponent} from "./shared/layouts/site-layout/site-layout.component";
import {MainComponent} from "./main/main.component";
import {LoginPageComponent} from "./login-page/login-page.component";
import {AuthGuard} from "./shared/classes/auth.guard";
import {NotFoundPageComponent} from "./not-found-page/not-found-page.component";
import {CollectionPageComponent} from "./collection-page/collection-page.component";
import {SecondaryLayoutComponent} from "./shared/layouts/secondary-layout/secondary-layout.component";
import {SingleCollectionComponent} from "./main/single-collection/single-collection.component";
import {ProductPageComponent} from "./product-page/product-page.component";
import {AdminPageComponent} from "./admin-page/admin-page.component";

const routes: Routes = [
  {
    path: "login",
    component: LoginPageComponent,
  },
  {
    path: "control",
    canActivate: [AuthGuard],
    component: AdminPageComponent
  },
  {
    path: '',
    component: SiteLayoutComponent,
    children: [
      {
        path: '',
        component: MainComponent
      },
      {
        path: "main",
        redirectTo: '',
        pathMatch: 'full'
      },

      {
        path: 'collection',
        component: SecondaryLayoutComponent,
        children: [
          {
            path: '',
            component: CollectionPageComponent
          },
          {
            path: ':id',
            component: ProductPageComponent
          }

        ]
      },
    ],
  },
  {
    path: '**',
    component: NotFoundPageComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule {

}
