import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SelectTemplateComponent} from './selecttemplate.component';
import {NzFormModule, NzGridModule, NzInputModule, NzSelectModule} from "ng-zorro-antd";

@NgModule({
  declarations: [
    SelectTemplateComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzGridModule,
    NzSelectModule
  ],
  exports:[
    SelectTemplateComponent
  ]
})
export class SelecttemplateModule { }
