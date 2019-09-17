import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DemoRoutingModule} from './demo-routing.module';
import {DemoComponent} from './demo.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NgZorroAntdModule, NzBadgeModule, NzButtonModule, NzMessageModule, NzTableModule} from 'ng-zorro-antd';
import {QuerylistModule} from '../../share/querylist/querylist.module';
import {FlowchartModule} from '../../share/flowchart/flowchart.module';
import {HelpcenterModule} from "../../share/helpcenter/helpcenter.module";
import {MaterialhelpModule} from "../../share/helpcenter/materialhelp/materialhelp.module";
import {AlphahelpModule} from "../../share/helpcenter/alphahelp/alphahelp.module";

@NgModule({
  declarations: [
    DemoComponent
  ],
  imports: [
    CommonModule,
    DemoRoutingModule,
    FormsModule,
    HttpClientModule,
    NzButtonModule,
    NzMessageModule,
    NzTableModule,
    NzBadgeModule,
    NgZorroAntdModule,
    FlowchartModule,




    MaterialhelpModule,


    QuerylistModule,//只是用动态查询组件
    HelpcenterModule,

    AlphahelpModule,//只使用普通定制帮助
  ],
  exports: [
    DemoComponent
  ]
})
export class DemoModule {
}
