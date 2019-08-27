import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

declare type METHOD = 'POST' | 'GET' | null; //取数方式

@Component({
  selector: 'treehelp',
  templateUrl: './treehelp.component.html',
  styleUrls: ['./treehelp.component.less']
})
export class TreehelpComponent implements OnInit {

  //确定按钮弹出事件
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();

  //取消关闭等弹出事件
  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();

  //某节点展开事件
  @Output() onNodeExpanded: EventEmitter<any> = new EventEmitter<any>();

  //某节点折叠事件
  @Output() onNodeCollapsed: EventEmitter<any> = new EventEmitter<any>();

  //某层级全部节点展开
  @Output() onAllNodeExpanded: EventEmitter<any> = new EventEmitter<any>();

  //全层级部节点折叠
  @Output() onAllNodeCollapsed: EventEmitter<any> = new EventEmitter<any>();

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

  constructor() { }

  ngOnInit() {
  }

}
