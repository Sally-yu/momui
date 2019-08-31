import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HelpTemplateComponent} from './helptemplate.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {HttpClientModule} from '@angular/common/http';
import {SmarthelpModule} from '../../../smarthelp/smarthelp.module';



@NgModule({
  declarations: [
    HelpTemplateComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgZorroAntdModule,
    HttpClientModule,
    SmarthelpModule,
  ],
  exports:[
    HelpTemplateComponent
  ]
})
export class HelptemplateModule { }
