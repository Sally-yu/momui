import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemohelpComponent } from './demohelp/demohelp.component';
import {DemohelpModule} from './demohelp/demohelp.module';



@NgModule({
  declarations: [DemohelpComponent],
  imports: [
    CommonModule,
    DemohelpModule
  ]
})
export class HelpcenterModule { }
