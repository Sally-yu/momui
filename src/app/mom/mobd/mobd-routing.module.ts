import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MobdComponent} from './mobd.component';


const routes: Routes = [
  {
    path:'',component:MobdComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MobdRoutingModule { }
