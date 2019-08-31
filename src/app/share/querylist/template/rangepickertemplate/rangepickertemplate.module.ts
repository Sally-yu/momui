import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RangepickerTemplateComponent} from './rangepickertemplate.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';



@NgModule({
  declarations: [
    RangepickerTemplateComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule
  ],
  exports:[
    RangepickerTemplateComponent
  ]
})
export class RangepickertemplateModule { }
