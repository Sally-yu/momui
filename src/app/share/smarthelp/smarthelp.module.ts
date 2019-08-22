import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SmarthelpComponent} from './smarthelp.component';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {FormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    SmarthelpComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgZorroAntdModule
  ],
  exports: [
    SmarthelpComponent
  ]
})
export class SmarthelpModule {
}
