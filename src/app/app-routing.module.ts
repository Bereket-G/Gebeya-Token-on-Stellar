import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'send-token',
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
  { path: 'send-token', loadChildren: './pages/send-token/send-token.module#SendTokenPageModule' },
  {
    path: 'create',
    loadChildren: './create/create.module#CreatePageModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
