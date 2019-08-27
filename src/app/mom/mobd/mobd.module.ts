import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MobdRoutingModule } from './mobd-routing.module';
import {MobdComponent} from './mobd.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NgZorroAntdModule} from 'ng-zorro-antd';


@NgModule({
  declarations: [
    MobdComponent
  ],
  imports: [
    CommonModule,
    MobdRoutingModule,
    FormsModule,
    HttpClientModule,
    NgZorroAntdModule,
  ],
  exports:[
    MobdComponent
  ]
})
export class MobdModule { }
