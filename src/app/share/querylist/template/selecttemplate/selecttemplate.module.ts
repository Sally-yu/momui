import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {SelectTemplateComponent} from './selecttemplate.component';



@NgModule({
  declarations: [
    SelectTemplateComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule
  ],
  exports:[
    SelectTemplateComponent
  ]
})
export class SelecttemplateModule { }
