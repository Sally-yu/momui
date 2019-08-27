import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {HttpService} from './service/http.service';

declare type METHOD = 'POST' | 'GET' | null; //取数方式
declare type INPUTTYPE = 'string' | 'number' | 'date' | 'datatime' | 'enum' | 'help' | 'treehelp' | 'bool' | null;

@Component({
  selector: 'smarthelp',
  templateUrl: './smarthelp.component.html',
  styleUrls: ['./smarthelp.component.less']
})
export class SmarthelpComponent implements OnInit, OnChanges {

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

  //是否树形帮助
  @Input() tree: boolean;

  searchValue: string; // 简单搜索值
  loading: boolean; // 加载中

  selected: any;  // 暂时标记选中值

  pageOption = [5, 10, 20, 50, 100];

  constructor(
    private http: HttpService
  ) {
    this.pageSize = this.pageSize ? this.pageSize : 10;
    this.title = this.title ? this.title : '快捷帮助';
  }

  ngOnInit() {
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

  clean() {
    this.data = null;
    this.columns = null;
    this.url = null;
    this.method = null;
  }

  getData() {

    // 不传data，只传url
    if (!this.data && this.url) {
      //判断取数方式
      const ob = this.method == 'POST' ? this.http.post(this.url, this.urlHeader, this.urlBody) :
        this.http.get(this.url, this.urlHeader);
      //取数据源
      ob.subscribe(res => {
          const list = JSON.parse(JSON.stringify(res));
          if (list['data']) {
            if (list['columns']) {
              this.columns = list['columns'];
            }
            //不返回数据列，自动生成，不判断类型，不建议用
            else {
              for (var key in list['data']) {
                this.columns = [...this.columns, {code: key, name: key}];
              }
            }
            this.data = list['data'];
          }
          this.loading = false;
        },
        error1 => {
          this.loading = false;
        }
      );
    }
    // 传data优先data
    else if (this.data && this.columns) {
      this.loading = false;
    }
    //不传columns自己循环一个 不分类型，不建议用
    else if (this.data && !this.columns) {
      for (var key in this.data) {
        this.columns = [...this.columns, {code: key, name: key}];
      }
      this.loading = false;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']) {
      if (changes['visible'].firstChange) {
        return; //首次加载触发
      }
      if (changes['visible'].currentValue) {
        //打开后
        this.loading = true;
        this.getData();

      } else if (!changes['visible'].currentValue) {
        //关闭后，清空data数据源,columns数据列
        this.data = null;
        this.columns = null;
        this.loading = false;
      }
    }
  }
}
