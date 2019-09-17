import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HelpcenterComponent} from "./helpcenter.component";
import {NzFormModule, NzGridModule} from "ng-zorro-antd";
import {AlphahelpComponent} from "./alphahelp/alphahelp.component";
import {MaterialhelpComponent} from "./materialhelp/materialhelp.component";
import {AlphahelpModule} from "./alphahelp/alphahelp.module";
import {MaterialhelpModule} from "./materialhelp/materialhelp.module";

@NgModule({
  declarations: [
    HelpcenterComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzGridModule,
    NzFormModule,

    //TODO:注册帮助模块
    AlphahelpModule,
    MaterialhelpModule,

  ],
  exports:[
    HelpcenterComponent,
  ],
  entryComponents:[

    //TODO:在此处添加需要动态加载的帮助组件
    AlphahelpComponent,
    MaterialhelpComponent,

  ]
})
export class HelpcenterModule {
}
