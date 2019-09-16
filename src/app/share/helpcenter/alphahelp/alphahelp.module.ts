import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AlphahelpComponent} from "./alphahelp.component";
import {SmarthelpModule} from "../../smarthelp/smarthelp.module";

@NgModule({
  declarations: [
    AlphahelpComponent
  ],
  imports: [
    CommonModule,
    SmarthelpModule
  ],
  exports:[
    AlphahelpComponent
  ]
})
export class AlphahelpModule { }
