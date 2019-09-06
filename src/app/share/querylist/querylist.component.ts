import {Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DynamicComponentDirective} from './directive/dynamic-component.directive';
import {InputTemplateComponent} from './template/inputtemplate/inputtemplate.component';
import {HelpTemplateComponent} from './template/helptemplate/helptemplate.component';
import {SelectTemplateComponent} from './template/selecttemplate/selecttemplate.component';
import {RangepickerTemplateComponent} from './template/rangepickertemplate/rangepickertemplate.component';
import {HttpService} from './service/http.service';
import {NzTransferComponent} from 'ng-zorro-antd';


@Component({
  selector: 'querylist',
  templateUrl: './querylist.component.html',
  styleUrls: ['./querylist.component.less']
})
export class QuerylistComponent implements OnInit {
  @ViewChild(DynamicComponentDirective, {static: true}) componentHost: DynamicComponentDirective;
  @ViewChild('transfer', {static: false}) transfer: NzTransferComponent;

  //TODO:查询回调
  @Output() onQuery: EventEmitter<any> = new EventEmitter<any>();
  //TODO:清空回调
  @Output() onReset: EventEmitter<boolean> = new EventEmitter<boolean>();
  //TODO:折叠改变回调
  @Output() onCollapseChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  //TODO:打开查询条件配置回调
  @Output() onOptionsOpen: EventEmitter<any> = new EventEmitter<any>();

  //TODO:取数url
  @Input() url: string = null;
  //TODO:取数方式
  @Input() method: string = null;
  //TODO:请求头
  @Input() urlHeader: any = null;
  //TODO:post请求体
  @Input() urlBody: any = null;

  //TODO:查询块标题
  @Input() title: string = '筛选条件';
  //TODO:查询穿梭框标题
  @Input() modalTitle: string = '配置筛选条件';
  //TODO:穿梭框穿梭按钮文字
  @Input() transferOptions: Array<string> = ['', ''];
  //TODO:穿梭框搜索框
  @Input() search: boolean = false;
  //TODO:穿梭框全选
  @Input() selectAll: boolean = false;
  //TODO:穿梭框宽度
  @Input() transferWidth: number = 200;
  //TODO:穿梭框高度
  @Input() transferHeight: number = 400;

  //TODO:背景颜色
  @Input() backgroundColor: string;
  //TODO:是否边框
  @Input() bordered: boolean = false;
  //TODO:倒角数值
  @Input() radius: string;
  //TODO:候选列
  @Input() columns: Array<any> = [];

  @Input() queryPlanCode: string;//当前查询方案编码，根据该编码，获取对应的查询方案，必须传值

  //展示穿梭对话框
  showTransfer: boolean = false;

  jsonData: Array<any> = [];//TODO:存储动态查询条件
  showNumber: number = 0;//TODO:需通过后台系统配置获取，查询方案默认显示组件个数
  componentArray: any[] = [];//TODO:组件数组
  isCollapse: boolean = false;//TODO:展开、关闭标识
  queryArray: any = {};

  selections = [
    {value: 'jack', label: 'jackson'},
    {value: 'arm', label: 'armary'},
    {value: 'jojo', label: 'jojolist'},
  ];

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private http: HttpService,
  ) {
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    // 不传data，只传url
    if (this.columns.length < 1 && this.url) {
      //判断取数方式
      const ob = this.method == 'POST' ? this.http.post(this.url, this.urlHeader, this.urlBody) :
        this.http.get(this.url, this.urlHeader);
      //取数据源
      ob.subscribe(res => {
          const list = JSON.parse(JSON.stringify(res));
          if (list['columns']) {
            this.columns = list['columns'];
          }
        },
        error1 => {
          throw new Error(error1);
        }
      );
    }
  }

  //查询
  query(): void {
    this.queryArray = {};
    this.componentArray.forEach(c => {
      if (c.instance.item.content != '' && c.instance.item.content != null && c.instance.item.content != {}) {
        switch (c.instance.item.type) {
          case 'help':
            this.queryArray[c.instance.item.code] = c.instance.item.content.code;
            break;
          case 'select':
            if (c.instance.item.content) {
              this.queryArray[c.instance.item.code] = c.instance.item.content.value;
            }
            break;
          default:
            this.queryArray[c.instance.item.code] = c.instance.item.content;
            break;
        }
      }
    });
    this.onQuery.emit(this.queryArray);
  }

  //展开/关闭
  toggleCollapse(): void {
    this.isCollapse = !this.isCollapse;
    this.componentArray.forEach((c, index) => {
      c.instance.hidden = this.isCollapse && index >= this.showNumber;
    });
    this.onCollapseChange.emit(this.isCollapse);
  }

  //清空
  resetForm(): void {
    this.componentArray.forEach(c => {
      switch (c.instance.item.type) {
        case 'help':
          c.instance.item.content = {};
          break;
        case 'select':
          c.instance.item.content = null;
          break;
        default:
          c.instance.item.content = null;
          break;
      }
    });
    this.onReset.emit(true);
  }

  //动态创建查询
  createQuery() {
    this.componentHost.viewContainerRef.clear();
    this.componentArray = [];
    const inputTemplateComponent = this.componentFactoryResolver.resolveComponentFactory(InputTemplateComponent);
    const helpTemplateComponent = this.componentFactoryResolver.resolveComponentFactory(HelpTemplateComponent);
    const selectTemplateComponent = this.componentFactoryResolver.resolveComponentFactory(SelectTemplateComponent);
    const rangepickerTemplateComponent = this.componentFactoryResolver.resolveComponentFactory(RangepickerTemplateComponent);
    this.jsonData.forEach(j => {
      let componentRef;
      j['content'] = null;
      const i = this.jsonData.indexOf(j);
      switch (j.type) {
        case 'text':
          componentRef = this.componentHost.viewContainerRef.createComponent(inputTemplateComponent);
          componentRef.instance.componentRef = componentRef;
          componentRef.instance.item = j;
          componentRef.instance.hidden = this.isCollapse && i >= this.showNumber;
          break;
        case 'help':
          j['content'] = {};
          componentRef = this.componentHost.viewContainerRef.createComponent(helpTemplateComponent);
          componentRef.instance.componentRef = componentRef;
          componentRef.instance.item = j;
          componentRef.instance.hidden = this.isCollapse && i >= this.showNumber;
          componentRef.instance.url = 'HTTP://212.64.2.48:8899/grid';
          componentRef.instance.tree = true;
          componentRef.instance.parentId = 'null';//不存在此字段，用分级码计算树
          componentRef.instance.title = '帮助模板';
          break;
        case 'select':
          j['content'] = {};
          componentRef = this.componentHost.viewContainerRef.createComponent(selectTemplateComponent);
          componentRef.instance.componentRef = componentRef;
          componentRef.instance.item = j;
          componentRef.instance.hidden = this.isCollapse && i >= this.showNumber;
          componentRef.instance.data = this.selections;
          break;
        case 'range':
          componentRef = this.componentHost.viewContainerRef.createComponent(rangepickerTemplateComponent);
          componentRef.instance.componentRef = componentRef;
          componentRef.instance.item = j;
          componentRef.instance.hidden = this.isCollapse && i >= this.showNumber;
          break;
        default:
          componentRef = this.componentHost.viewContainerRef.createComponent(inputTemplateComponent);
          componentRef.instance.componentRef = componentRef;
          componentRef.instance.item = j;
          componentRef.instance.hidden = this.isCollapse && i >= this.showNumber;
          break;
      }
      this.componentArray.push(componentRef);
    });
  }

  //确定查询条件
  onOk() {
    this.jsonData = this.transfer.rightDataSource;
    this.showTransfer = false;
    this.createQuery();
  }

  inputType(item): string {
    let s = '';
    switch (item['type']) {
      case 'text':
        s = '文字类型';
        break;
      case 'help':
        s = '帮助类型';
        break;
      case 'select':
        s = '选择类型';
        break;
      case 'range':
        s = '时间范围';
        break;
      default:
        s = '文字类型';
        break;
    }
    return s;
  }
}
