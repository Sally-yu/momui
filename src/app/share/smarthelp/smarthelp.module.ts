import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SmarthelpComponent} from './smarthelp.component';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';


@NgModule({
  declarations: [
    SmarthelpComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgZorroAntdModule,
  ],
  exports: [
    SmarthelpComponent
  ]
})
export class SmarthelpModule {
}
