import {
  AfterViewChecked,
  AfterViewInit, ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef, EventEmitter,
  Input,
  OnInit, Output,
  ViewChild, ViewContainerRef
} from '@angular/core';
import {AlphahelpComponent} from "./alphahelp/alphahelp.component";

@Component({
  selector: 'app-helpcenter',
  templateUrl: './helpcenter.component.html',
  styleUrls: ['./helpcenter.component.less']
})
export class HelpcenterComponent implements OnInit, AfterViewInit, AfterViewChecked {

  @ViewChild('help', {read: ViewContainerRef, static: false}) help: ViewContainerRef;

  //帮助结果回调,是所选整个条目
  @Output() result: EventEmitter<any> = new EventEmitter<any>();

  @Input() query: false;
  @Input() helpId: string;

  @Input() item: any;
  @Input() hidden: boolean;

  content;
  ref: ComponentRef<any>;

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
        this.ref = this.help.createComponent(help);
        break;

      default:
        help = this.componentFactoryResolver.resolveComponentFactory(AlphahelpComponent);
        this.ref = this.help.createComponent(help);
        break;
    }

  }

  ngAfterViewInit(): void {
    this.findHelpWithId();
    this.ref.instance.result.subscribe(res => {
      this.content = JSON.parse(JSON.stringify(this.ref.instance.item));
      this.result.emit(this.content);
    });
  }

  ngAfterViewChecked(): void {
    //动态加载,检查
    this.cdRef.detectChanges();
  }

  clear(){
    this.content=undefined;
    this.ref.instance.clear();
  }

}
