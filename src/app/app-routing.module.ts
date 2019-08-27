import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';


const routes: Routes = [
  {
    path: 'demo', loadChildren: () => import('./mom/demo/demo.module').then(m => m.DemoModule)
  },
  {
    path: '', redirectTo: 'mobd', pathMatch: 'full'
  },
  {
    path: 'mobd', loadChildren: () => import('./mom/mobd/mobd.module').then(m => m.MobdModule)
  },
  {
    path: 'mofm', loadChildren: () => import('./mom/mofm/mofm.module').then(m => m.MofmModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
