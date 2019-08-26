import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MOFMRoutingModule } from './mofm-routing.module';
import {MOFMComponent} from './mofm.component';
import {FormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {SmarthelpModule} from '../../share/smarthelp/smarthelp.module';


@NgModule({
  declarations: [
    MOFMComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgZorroAntdModule,
    MOFMRoutingModule,
    SmarthelpModule
  ]
})
export class MOFMModule { }
