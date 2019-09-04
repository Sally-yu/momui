import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DemoRoutingModule} from './demo-routing.module';
import {DemoComponent} from './demo.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {SmarthelpModule} from '../../share/smarthelp/smarthelp.module';
import {QuerylistModule} from '../../share/querylist/querylist.module';
import {DemohelpModule} from '../../share/helpcenter/demohelp/demohelp.module';
import {WorkflowModule} from '../../share/workflow/workflow.module';


@NgModule({
  declarations: [
    DemoComponent
  ],
  imports: [
    CommonModule,
    DemoRoutingModule,
    FormsModule,
    HttpClientModule,
    NgZorroAntdModule,
    SmarthelpModule,
    QuerylistModule,
    DemohelpModule,
    WorkflowModule
  ],
  exports: [
    DemoComponent
  ]
})
export class DemoModule {
}
