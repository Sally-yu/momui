import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RangepickerTemplateComponent} from './rangepickertemplate.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NzDatePickerModule, NzFormModule, NzGridModule, NzInputModule} from 'ng-zorro-antd';

@NgModule({
  declarations: [
    RangepickerTemplateComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzGridModule,
    NzDatePickerModule
  ],
  exports:[
    RangepickerTemplateComponent
  ]
})
export class RangepickertemplateModule { }
