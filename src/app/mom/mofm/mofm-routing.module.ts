import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MOFMComponent} from './mofm.component';


const routes: Routes = [
  {
    'path':'',component:MOFMComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MOFMRoutingModule { }
