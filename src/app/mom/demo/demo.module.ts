import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DemoRoutingModule} from './demo-routing.module';
import {DemoComponent} from './demo.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NzButtonModule, NzMessageModule} from 'ng-zorro-antd';
import {SmarthelpModule} from '../../share/smarthelp/smarthelp.module';
import {QuerylistModule} from '../../share/querylist/querylist.module';
import {WorkflowModule} from '../../share/workflow/workflow.module';
import {AlphahelpModule} from "../../share/helpcenter/alphahelp/alphahelp.module";
import {HelpcenterModule} from "../../share/helpcenter/helpcenter.module";

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
    SmarthelpModule,
    QuerylistModule,
    WorkflowModule,
    AlphahelpModule,
    HelpcenterModule
  ],
  exports: [
    DemoComponent
  ]
})
export class DemoModule {
}
