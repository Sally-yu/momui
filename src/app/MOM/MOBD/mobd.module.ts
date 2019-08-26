import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MOBDRoutingModule } from './mobd-routing.module';
import {MOBDComponent} from './mobd.component';
import {SmarthelpModule} from '../../share/smarthelp/smarthelp.module';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {FormsModule} from '@angular/forms';
import { JCSJComponent } from './jcsj/jcsj.component';


@NgModule({
  declarations: [
    MOBDComponent,
    JCSJComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MOBDRoutingModule,
    NgZorroAntdModule,
    SmarthelpModule
  ],
})
export class MOBDModule { }
