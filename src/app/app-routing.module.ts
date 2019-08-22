import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';


const routes: Routes = [
  {
    path: '', redirectTo: 'mobd', pathMatch: 'full'
  },
  {
    path: 'mobd', loadChildren: () => import('./MOM/MOBD/mobd.module').then(m => m.MOBDModule)
  },
  {
    path: 'mofm', loadChildren: () => import('./MOM/MOFM/mofm.module').then(m => m.MOFMModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
