import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import j from "src/assets/tables/meta/meta.json";
import {SmarthelpComponent} from "../../smarthelp/smarthelp.component";

@Component({
  selector: 'app-alphahelp',
  templateUrl: './alphahelp.component.html',
  styleUrls: ['./alphahelp.component.less']
})
export class AlphahelpComponent {

  //务必保证使用item变量名 存储和绑定输入框数据
  @Input() item;

  //务必保证使用result变量名 弹出选中后事件
  @Output() result: EventEmitter<any> = new EventEmitter<any>();

  columns = j;

  @ViewChild(SmarthelpComponent,{static:false}) smarthelp:SmarthelpComponent;

  constructor(
  ) {
  }

  afterHelp(data:any) {
    this.item=data;
    this.result.emit(this.item);
  }

  clear(){
    this.smarthelp.item=undefined;
  }

}
