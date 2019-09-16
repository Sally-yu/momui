import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {InputTemplateComponent} from './inputtemplate.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NzFormModule, NzGridModule, NzIconModule, NzInputModule, NzToolTipModule} from "ng-zorro-antd";

@NgModule({
  declarations: [
    InputTemplateComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzGridModule,
    NzInputModule,
    NzIconModule,
    NzToolTipModule
  ],
  exports:[
    InputTemplateComponent,

  ]
})
export class InputtemplateModule { }
