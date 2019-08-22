import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

declare type METHOD = 'POST' | 'GET' | null; //取数方式

@Component({
  selector: 'smarthelp',
  templateUrl: './smarthelp.component.html',
  styleUrls: ['./smarthelp.component.less']
})
export class SmarthelpComponent implements OnInit {

  //确定按钮弹出事件
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();

  //取消关闭等弹出事件
  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();

  //帮助标题
  @Input() title: string;

  //显示弹窗
  @Input() visible: boolean;

  //取数url
  @Input() url: string;

  //取数方式
  @Input() method: METHOD;

  //请求头
  @Input() urlHeader: any;

  //post请求体
  @Input() urlBody: any;

  //帮助数据源
  @Input() data;

  //默认每页记录数
  @Input() pageSize: number;

  //显示快速跳转页码
  @Input() showJumper: boolean;

  //帮助数据源列名映射关系
  @Input() columns;

  searchValue: string; // 搜索值
  loading: boolean; // 加载中

  selected: any;  // 暂时标记选中值

  pageOption = [5, 10, 20, 50, 100];


  constructor() {
    this.loading = true;
    this.pageSize = this.pageSize ? this.pageSize : 10;
    this.title = this.title ? this.title : '快捷帮助';
  }

  ngOnInit() {
    this.loading = false;
  }


  rowClick(row: any) {
    this.selected = row;
  }

  //取消按钮事件
  cancel() {
    this.onCancel.emit();
  }


  //确认返回事件
  ok() {
    this.onOk.emit(this.selected);
  }

}
