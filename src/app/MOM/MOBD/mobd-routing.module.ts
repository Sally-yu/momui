import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MOBDComponent} from './mobd.component';


const routes: Routes = [
  {
    path: '', component: MOBDComponent, data: {title: '基础数据'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MOBDRoutingModule {
}
