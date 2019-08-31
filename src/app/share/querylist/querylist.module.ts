import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {QuerylistComponent} from './querylist.component';
import {HelpTemplateComponent} from './template/helptemplate/helptemplate.component';
import {InputTemplateComponent} from './template/inputtemplate/inputtemplate.component';
import {SelectTemplateComponent} from './template/selecttemplate/selecttemplate.component';
import {RangepickerTemplateComponent} from './template/rangepickertemplate/rangepickertemplate.component';
import {HelptemplateModule} from './template/helptemplate/helptemplate.module';
import {DynamicComponentDirective} from './directive/dynamic-component.directive';
import {InputtemplateModule} from './template/inputtemplate/inputtemplate.module';
import {SelecttemplateModule} from './template/selecttemplate/selecttemplate.module';
import {RangepickertemplateModule} from './template/rangepickertemplate/rangepickertemplate.module';


@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NgZorroAntdModule,

    HelptemplateModule,
    InputtemplateModule,
    SelecttemplateModule,
    RangepickertemplateModule,

  ],
  exports: [
    QuerylistComponent,
  ],
  declarations: [
    QuerylistComponent,
    DynamicComponentDirective,
  ],
  entryComponents: [
    InputTemplateComponent,
    SelectTemplateComponent,
    RangepickerTemplateComponent,
    HelpTemplateComponent
  ],
})
export class QuerylistModule {
}
