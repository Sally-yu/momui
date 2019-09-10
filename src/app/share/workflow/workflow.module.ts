import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WorkflowComponent} from './workflow.component';
import {NzIconModule, NzPopoverModule, NzSpinModule, NzToolTipModule} from 'ng-zorro-antd';

@NgModule({
  declarations: [
    WorkflowComponent
  ],
  imports: [
    CommonModule,
    NzSpinModule,
    NzIconModule,
    NzPopoverModule,
    NzToolTipModule
  ],
  exports: [
    WorkflowComponent
  ]
})
export class WorkflowModule {
}
