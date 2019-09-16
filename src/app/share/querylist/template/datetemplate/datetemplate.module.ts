import { NgModule } from '@angular/core';
import {DatetemplateComponent} from "./datetemplate.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NzDatePickerModule, NzFormModule, NzGridModule, NzIconModule, NzInputModule} from "ng-zorro-antd";



@NgModule({
  declarations: [
    DatetemplateComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NzIconModule,
    NzFormModule,
    NzGridModule,
    NzInputModule,
    NzDatePickerModule
  ],
  exports:[
    DatetemplateComponent
  ]
})
export class DatetemplateModule { }
