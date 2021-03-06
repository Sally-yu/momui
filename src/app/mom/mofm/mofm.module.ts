import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MofmRoutingModule} from './mofm-routing.module';
import {MofmComponent} from './mofm.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NgZorroAntdModule} from 'ng-zorro-antd';


@NgModule({
  declarations: [MofmComponent],
  imports: [
    CommonModule,
    MofmRoutingModule,
    FormsModule,
    HttpClientModule,
    NgZorroAntdModule,
  ],
  exports: [
    MofmComponent
  ]
})
export class MofmModule {
}
