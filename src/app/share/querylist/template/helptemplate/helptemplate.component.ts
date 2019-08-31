import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-helptemplate',
  templateUrl: './helptemplate.component.html',
  styleUrls: ['./helptemplate.component.less']
})

export class HelpTemplateComponent implements OnInit {

  @Input() public item: any;
  @Input() public hidden: boolean;


  //帮助标题
  @Input() title: string;

  //显示弹窗
  visible: boolean;

  //取数url
  @Input() url: string;

  //取数方式
  @Input() method: string;

  //请求头
  @Input() urlHeader: any;

  //post请求体
  @Input() urlBody: any ;

  //帮助数据源，最终显示的数据
  @Input() data: Array<any>;

  //默认每页记录数
  @Input() pageSize: number;

  //显示快速跳转页码
  @Input() showJumper: boolean =true;

  //显示每页条数选项
  @Input() showPageSelection: boolean =false;

  //帮助数据源列名映射关系
  @Input() columns: Array<any>;

  //是否树形帮助
  @Input() tree: boolean;

  //多选
  // @Input() multiSelect: boolean = false;

  //分级码字段
  @Input() path: string;

  //层级字段
  @Input() layer: string;

  @Input() parentId: string;

  @Input() id: string;

  constructor(
  ) {
  }

  ngOnInit() {

  }

  afterHelp(data: any) {
    this.visible = false;
    this.item.content=data;
  }

  openHelp() {
    this.visible = true;
  }

}
