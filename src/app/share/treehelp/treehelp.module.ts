import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TreehelpComponent} from './treehelp.component';
import {FormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';



@NgModule({
  declarations: [
    TreehelpComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgZorroAntdModule,
  ],
  exports:[
    TreehelpComponent
  ]
})
export class TreehelpModule { }
