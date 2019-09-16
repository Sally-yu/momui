import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SmarthelpComponent} from './smarthelp.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {
  NzButtonModule,
  NzIconModule,
  NzInputModule,
  NzListModule,
  NzModalModule, NzPopoverModule,
  NzSwitchModule,
  NzTableModule,
} from "ng-zorro-antd";


@NgModule({
  declarations: [
    SmarthelpComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NzModalModule,
    NzInputModule,
    NzIconModule,
    NzTableModule,
    NzListModule,
    NzPopoverModule,
    NzButtonModule,
    NzSwitchModule
  ],
  exports: [
    SmarthelpComponent
  ]
})
export class SmarthelpModule {
}
