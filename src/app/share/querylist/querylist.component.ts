import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {InputTemplateComponent} from './template/inputtemplate/inputtemplate.component';
import {SelectTemplateComponent} from './template/selecttemplate/selecttemplate.component';
import {RangepickerTemplateComponent} from './template/rangepickertemplate/rangepickertemplate.component';
import {NzTransferComponent} from 'ng-zorro-antd';
import {HelpcenterComponent} from "../helpcenter/helpcenter.component";
import {DatetemplateComponent} from "./template/datetemplate/datetemplate.component";


@Component({
  selector: 'querylist',
  templateUrl: './querylist.component.html',
  styleUrls: ['./querylist.component.less']
})
export class QuerylistComponent implements OnInit {

  @ViewChild('template', {read: ViewContainerRef, static: true}) componentHost: ViewContainerRef;
  @ViewChild('transfer', {static: false}) transfer: NzTransferComponent;

  //查询回调
  @Output() onQuery: EventEmitter<any> = new EventEmitter<any>();
  //清空回调
  @Output() onReset: EventEmitter<boolean> = new EventEmitter<boolean>();
  //折叠改变回调
  @Output() onCollapseChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  //打开查询条件配置回调
  @Output() onOptionsOpen: EventEmitter<any> = new EventEmitter<any>();

  //查询块标题
  @Input() title: string = '筛选条件';
  //查询穿梭框标题
  @Input() modalTitle: string = '配置筛选条件';
  //穿梭框穿梭按钮文字, 注意 下上 顺序
  @Input() transferOptions: Array<string> = ['添加', '移除'];
  //穿梭框搜索框
  @Input() search: boolean = false;
  //穿梭框全选
  @Input() selectAll: boolean = false;
  //穿梭框宽度
  @Input() transferWidth: number = 200;
  //穿梭框高度
  @Input() transferHeight: number = 400;
  //背景颜色
  @Input() backgroundColor: string;
  //候选列
  @Input() columns: Array<any> = [];
  //左右选框辅助显示信息,左右
  @Input() titleOptions = ['未选', '已选'];

  //展示穿梭对话框
  showTransfer: boolean = false;

  jsonData: Array<any> = [];//存储动态查询条件
  showNumber: number = 0;//需通过后台系统配置获取，查询方案默认显示组件个数
  componentArray: any[] = [];//组件数组
  isCollapse: boolean = false;//展开、关闭标识
  queryArray: any = {};

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
  ) {
  }

  ngOnInit() {
    this.jsonData=this.columns.filter(c=>c.default);
    if (this.jsonData.length>0){
      this.jsonData.forEach(j=>{
        j.direction='right';
      });
      this.createQuery();
    }
  }

  //查询
  query(): void {
    this.queryArray = {};
    this.componentArray.forEach(c => {
      switch (c.instance.item.type) {
        case 'help':
          if (c.instance.content) {
            this.queryArray[c.instance.item.code] = c.instance.content;
          }
          break;
        case 'select':
          if (c.instance.item.content && c.instance.item.content.hasOwnProperty('value')) {
            this.queryArray[c.instance.item.code] = c.instance.item.content.value;
          }
          break;
        default:
          if (c.instance.item.content) {
            this.queryArray[c.instance.item.code] = c.instance.item.content;
          }
          break;
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
          c.instance.clear();
          break;
        case 'select':
          c.instance.item.content = undefined;
          break;
        default:
          c.instance.item.content = undefined;
          break;
      }
    });
    this.onReset.emit(true);
  }

  //确定查询条件
  onOk() {
    if(JSON.stringify(this.jsonData)!=JSON.stringify(this.transfer.rightDataSource)) {
      this.jsonData = JSON.parse(JSON.stringify(this.transfer.rightDataSource));
      this.createQuery();
    }
    this.showTransfer = false;
  }

  //动态创建查询
  createQuery() {
    this.componentHost.clear();
    this.componentArray = [];
    this.jsonData.forEach(j => {
      let ref;
      const i = this.jsonData.indexOf(j);
      switch (j.type) {
        case 'text':
          j['content'] = undefined;
          const inputTemplateComponent = this.componentFactoryResolver.resolveComponentFactory(InputTemplateComponent);
          ref = this.componentHost.createComponent(inputTemplateComponent);
          ref.instance.item = j;
          ref.instance.hidden = this.isCollapse && i >= this.showNumber;
          break;
        case 'help':
          const helpTemplateComponent = this.componentFactoryResolver.resolveComponentFactory(HelpcenterComponent);
          ref = this.componentHost.createComponent(helpTemplateComponent);
          ref.instance.query = true;
          ref.instance.item = j;
          ref.instance.hidden = this.isCollapse && i >= this.showNumber;
          ref.instance.helpId = j['helpid'];
          break;
        case 'select':
          j['content'] = undefined;
          const selectTemplateComponent = this.componentFactoryResolver.resolveComponentFactory(SelectTemplateComponent);
          ref = this.componentHost.createComponent(selectTemplateComponent);
          ref.instance.item = j;
          ref.instance.hidden = this.isCollapse && i >= this.showNumber;
          ref.instance.data = j['data'];
          break;
        case 'range':
          j['content'] = undefined;
          const rangepickerTemplateComponent = this.componentFactoryResolver.resolveComponentFactory(RangepickerTemplateComponent);
          ref = this.componentHost.createComponent(rangepickerTemplateComponent);
          ref.instance.item = j;
          ref.instance.hidden = this.isCollapse && i >= this.showNumber;
          break;
        case 'date':
          j['content'] = undefined;
          const datePicker = this.componentFactoryResolver.resolveComponentFactory(DatetemplateComponent);
          ref = this.componentHost.createComponent(datePicker);
          ref.instance.item = j;
          ref.instance.hidden = this.isCollapse && i >= this.showNumber;
          break;
        default:
          const defaultComponent = this.componentFactoryResolver.resolveComponentFactory(InputTemplateComponent);
          ref = this.componentHost.createComponent(defaultComponent);
          ref.instance.item = j;
          ref.instance.hidden = this.isCollapse && i >= this.showNumber;
          break;
      }
      this.componentArray.push(ref);
    });
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
