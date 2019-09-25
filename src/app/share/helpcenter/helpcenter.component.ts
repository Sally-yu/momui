import {
  AfterViewChecked,
  AfterViewInit, ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef, EventEmitter,
  Input, OnChanges,
  OnInit, Output, SimpleChanges,
  ViewChild, ViewContainerRef
} from '@angular/core';
import {AlphahelpComponent} from "./alphahelp/alphahelp.component";
import {MaterialhelpComponent} from "./materialhelp/materialhelp.component";

@Component({
  selector: 'helpcenter',
  templateUrl: './helpcenter.component.html',
  styleUrls: ['./helpcenter.component.less']
})
export class HelpcenterComponent implements OnInit, AfterViewInit, AfterViewChecked, OnChanges {

  @ViewChild('help', {read: ViewContainerRef, static: false}) help: ViewContainerRef;

  //帮助结果回调,是所选整个条目
  @Output() result: EventEmitter<any> = new EventEmitter<any>();

  @Input() readOnly: boolean = false;

  //表示在动态查询条件中使用,渲染成form内标签加输入框
  @Input() query:boolean;
  @Input() helpId: string;

  //接收动态配置参数
  @Input() item: any;
  @Input() hidden: boolean;

  @Input() content;
  ref: ComponentRef<any>;
  @Input() span: number = 6;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private cdRef: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
  }

  //添加新的帮助后,如果查询使用,在此代码中注册一遍
  findHelpWithId() {
    this.help.clear();
    let help;
    //helpId应对应json配置文件中的helpid字段,通过helpid动态生成对应的帮助组件
    switch (this.helpId) {
      case "alpha":
        help = this.componentFactoryResolver.resolveComponentFactory(AlphahelpComponent);
        break;
      case "material":
        help = this.componentFactoryResolver.resolveComponentFactory(MaterialhelpComponent);
        break;

      //TODO:追加需要的case,使用不同的id对应不同的帮助组件
      // case "myhelp":
      //   help = this.componentFactoryResolver.resolveComponentFactory(MyhelpComponent);
      //   break;

      default:
        help = this.componentFactoryResolver.resolveComponentFactory(AlphahelpComponent);
        break;
    }


    //统一处理
    this.ref = this.help.createComponent(help);
    this.ref.instance.readOnly = this.readOnly;

  }

  ngAfterViewInit(): void {
    this.findHelpWithId();
    this.ref.instance.content = this.content;
    this.ref.instance.result.subscribe(res => {
      this.content = JSON.parse(JSON.stringify(res));
      this.result.emit(this.content);
    });
  }

  ngAfterViewChecked(): void {
    //动态加载,检查
    this.cdRef.detectChanges();
  }

  clear() {
    this.content = undefined;
    this.ref.instance.clear();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('helpId') && !changes['helpId'].firstChange) {
      this.findHelpWithId();
    }
    if (changes.hasOwnProperty('readOnly') && !changes['readOnly'].firstChange) {
      this.ref.instance.readOnly = this.readOnly;
    }
  }

}
