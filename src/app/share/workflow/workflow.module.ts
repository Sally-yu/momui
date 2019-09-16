import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WorkflowComponent} from './workflow.component';
import {NzIconModule, NzToolTipModule} from 'ng-zorro-antd';

@NgModule({
  declarations: [
    WorkflowComponent
  ],
  imports: [
    CommonModule,
    NzIconModule,
    NzToolTipModule
  ],
  exports: [
    WorkflowComponent
  ]
})
export class WorkflowModule {
}
