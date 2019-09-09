import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WorkflowComponent} from './workflow.component';
import {NzIconModule, NzSpinModule} from 'ng-zorro-antd';

@NgModule({
  declarations: [
    WorkflowComponent
  ],
  imports: [
    CommonModule,
    NzSpinModule,
    NzIconModule
  ],
  exports: [
    WorkflowComponent
  ]
})
export class WorkflowModule {
}
