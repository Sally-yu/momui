import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MaterialhelpComponent} from "./materialhelp.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {
  NzButtonModule, NzDividerModule,
  NzIconModule,
  NzInputModule,
  NzListModule,
  NzModalModule,
  NzPopoverModule, NzSelectModule, NzSwitchModule,
  NzTableModule, NzTabsModule
} from "ng-zorro-antd";
import {QuerylistModule} from "../../querylist/querylist.module";

@NgModule({
  declarations: [
    MaterialhelpComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NzModalModule,
    NzInputModule,
    NzIconModule,
    NzTableModule,
    NzListModule,
    NzPopoverModule,
    NzButtonModule,
    NzSwitchModule,
    NzTabsModule,
    NzSelectModule,
    NzDividerModule,
    QuerylistModule
  ],
  exports:[
    MaterialhelpComponent
  ]
})
export class MaterialhelpModule { }
