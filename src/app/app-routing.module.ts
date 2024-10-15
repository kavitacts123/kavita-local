import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';
import { NonAuthGuard } from './services/non.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./modules/website/website.module').then(
        (m) => m.WebsiteModule
      ), 
    canActivate: [NonAuthGuard]
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./modules/admin/admin.module').then(
        (m) => m.AdminModule
      ),
    canActivate: [AuthGuard]
  },
  {
    path: 'talent',
    loadChildren: () =>
      import('./modules/talent/talent.module').then(
        (m) => m.TalentModule
      ),
    canActivate: [AuthGuard]  // Protect this route with AuthGuard if necessary
  },
  {
    path: 'scout',
    loadChildren: () =>
      import('./modules/scout/scout.module').then(
        (m) => m.ScoutModule
      ),
    canActivate: [AuthGuard]  // Protect this route with AuthGuard if necessary
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
