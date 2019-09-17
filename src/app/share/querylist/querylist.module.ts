import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  NzButtonModule,
  NzFormModule, NzGridModule,
  NzIconModule,
  NzModalModule,
  NzTransferModule
} from 'ng-zorro-antd';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {QuerylistComponent} from './querylist.component';
import {InputTemplateComponent} from './template/inputtemplate/inputtemplate.component';
import {SelectTemplateComponent} from './template/selecttemplate/selecttemplate.component';
import {RangepickerTemplateComponent} from './template/rangepickertemplate/rangepickertemplate.component';
import {InputtemplateModule} from './template/inputtemplate/inputtemplate.module';
import {SelecttemplateModule} from './template/selecttemplate/selecttemplate.module';
import {RangepickertemplateModule} from './template/rangepickertemplate/rangepickertemplate.module';
import {HelpcenterComponent} from "../helpcenter/helpcenter.component";
import {DatetemplateModule} from "./template/datetemplate/datetemplate.module";
import {DatetemplateComponent} from "./template/datetemplate/datetemplate.component";


@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzGridModule,
    NzButtonModule,
    NzIconModule,
    NzModalModule,
    NzTransferModule,

    //各模板模块
    InputtemplateModule,
    SelecttemplateModule,
    RangepickertemplateModule,
    DatetemplateModule,
  ],
  exports: [
    QuerylistComponent,
  ],
  declarations: [
    QuerylistComponent,
  ],
  entryComponents: [
    InputTemplateComponent,
    SelectTemplateComponent,
    RangepickerTemplateComponent,
    DatetemplateComponent,

    HelpcenterComponent,
  ],
})
export class QuerylistModule {
}
