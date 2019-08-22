import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { SafePipe } from './pipe/safe.pipe';


@NgModule({
  declarations: [SafePipe],
  imports: [
    CommonModule,
    CoreRoutingModule
  ]
})
export class CoreModule { }
