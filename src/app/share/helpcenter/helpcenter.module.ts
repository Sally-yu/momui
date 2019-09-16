import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HelpcenterComponent} from "./helpcenter.component";
import {NzFormModule, NzGridModule} from "ng-zorro-antd";
import {AlphahelpComponent} from "./alphahelp/alphahelp.component";

@NgModule({
  declarations: [
    HelpcenterComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzGridModule,
    NzFormModule
  ],
  exports:[
    HelpcenterComponent
  ],
  entryComponents:[

    //下属帮助组件 需要entry 方便查询条件动态查找
    AlphahelpComponent
  ]
})
export class HelpcenterModule { }
