import {
  AfterViewChecked, AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import {SmarthelpComponent} from "../../smarthelp/smarthelp.component";
//导入配置文件
import j from "src/assets/tables/meta/meta.json";

@Component({
  selector: 'alphahelp',
  templateUrl: './alphahelp.component.html',
  styleUrls: ['./alphahelp.component.less']
})
export class AlphahelpComponent implements AfterViewChecked,AfterViewInit{

  //务必保证使用content变量名 存储和绑定输入框数据
  @Input() content;

  //务必保证使用result变量名 弹出选中后事件
  @Output() result: EventEmitter<any> = new EventEmitter<any>();

  //从配置文件读入数据
  columns = j;

  @ViewChild(SmarthelpComponent,{static:false}) smarthelp:SmarthelpComponent;

  constructor(
    private cdRef: ChangeDetectorRef
  ) {
  }

  afterHelp(data:any) {
    this.content=data;
    this.result.emit(this.content);
  }

  clear(){
    this.smarthelp.content=undefined;
  }

  ngAfterViewInit() {
    this.smarthelp.content=this.content;
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }


}
