import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlowchartComponent} from './flowchart.component';
import {NzIconModule, NzToolTipModule} from 'ng-zorro-antd';

@NgModule({
  declarations: [
    FlowchartComponent
  ],
  imports: [
    CommonModule,
    NzIconModule,
    NzToolTipModule
  ],
  exports: [
    FlowchartComponent
  ]
})
export class FlowchartModule {
}
