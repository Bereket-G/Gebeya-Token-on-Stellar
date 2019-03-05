import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  {
    path: 'list',
    loadChildren: './list/list.module#ListPageModule'
  },
  { path: 'send-token', loadChildren: './send-token/send-token.module#SendTokenPageModule' },
  {
    path: 'create',
    loadChildren: './create/create.module#CreatePageModule'
  },
  {
    path: 'link',
    loadChildren: './link/link.module#LinkPageModule'
  },
  { path: 'buy-token', loadChildren: './buy-token/buy-token.module#BuyTokenPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
