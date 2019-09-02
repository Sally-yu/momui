import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DemohelpComponent} from './demohelp.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {SmarthelpModule} from '../../smarthelp/smarthelp.module';



@NgModule({
  declarations: [
    DemohelpComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgZorroAntdModule,
    SmarthelpModule
  ],
  exports:[
    DemohelpComponent
  ]
})
export class DemohelpModule { }
