import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {InputTemplateComponent} from './inputtemplate.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';



@NgModule({
  declarations: [
    InputTemplateComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule
  ],
  exports:[
    InputTemplateComponent,

  ]
})
export class InputtemplateModule { }
