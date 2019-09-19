import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import j from 'src/assets/tables/material/material.json';
import {HttpService} from "./service/http.service";
import {TreeNodeInterface} from "../../smarthelp/smarthelp.component";

@Component({
  selector: 'materialhelp',
  templateUrl: './materialhelp.component.html',
  styleUrls: ['./materialhelp.component.less']
})
export class MaterialhelpComponent implements OnInit {

//当前选中项
  //仿制帮助时,务必保证该变量名为content  TODO:重要
  @Input() content: any;

  //弹出结果事件
  //仿制帮助时,务必保证该变量名为result   TODO:重要
  @Output() result: EventEmitter<any> = new EventEmitter<any>();

  //帮助数据源列名映射关系
  columns: Array<any> = j;

  //暂存选中行
  selected: any = null;

  //
  leftSelected: any = null;

  @Input() readOnly:boolean=false;

  //帮助标题
  @Input() title: string = '物料帮助';

  //显示弹窗
  @Input() visible: boolean = false;

  //服务器端分页
  @Input() servicePage: boolean = true;

  //取数url
  @Input() url: string;

  //取数方式
  @Input() method: string;

  //请求头
  @Input() urlHeader: any;

  //post请求体
  @Input() urlBody: any;

  //帮助数据源，最终显示的数据
  @Input() data: Array<any>;

  //树形数据
  treeData: Array<any>;

  //默认每页记录数
  @Input() pageSize: number = 10;

  //默认启动页
  @Input() pageIndex: number = 1;

  //显示快速跳转页码
  @Input() showJumper: boolean = false;


  //是否树形帮助
  @Input() tree: boolean = false;

  //多选
  // @Input() multiSelect: boolean = false;

  //分级码字段
  @Input() path: string = 'path';

  //层级字段
  @Input() layer: string = 'layer';

  //父级id
  @Input() parentId: string = 'parentid';

  //id字段
  @Input() id: string = 'id';

  //名称字段
  @Input() name: string = 'name';

  //分页条数候选
  @Input() pageOption: Array<number> = [5, 10, 20, 50, 100];//分页候选

  //输入框placeholder
  @Input() placeHolder: string = '物料帮助';

  //列表型数据，树帮助时存储全部展开的列表数据
  listData: Array<any>;

  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};

  loading: boolean = false;
  focus: boolean;
  tabs = ['物料分类', '物料类型'];
  categroy: any;
  demoData = [
    {
      code: '0001',
      name: '物料1'
    }, {
      code: '0002',
      name: '物料2'
    }, {
      code: '0003',
      name: '物料3'
    }, {
      code: '0004',
      name: '物料4'
    }, {
      code: '0005',
      name: '物料5'
    },
  ];

  rightData = [
    {
      code: "0001",
      name: '物料1',
      spec: '0909',
      model: '1938-gtx990',
      drnum: '01990'
    }, {
      code: "0001",
      name: '物料1',
      spec: '0909',
      model: '1938-gtx990',
      drnum: '01990'
    }, {
      code: "0001",
      name: '物料1',
      spec: '0909',
      model: '1938-gtx990',
      drnum: '01990'
    }, {
      code: "0001",
      name: '物料1',
      spec: '0909',
      model: '1938-gtx990',
      drnum: '01990'
    }, {
      code: "0001",
      name: '物料1',
      spec: '0909',
      model: '1938-gtx990',
      drnum: '01990'
    }, {
      code: "0001",
      name: '物料1',
      spec: '0909',
      model: '1938-gtx990',
      drnum: '01990'
    }, {
      code: "0001",
      name: '物料1',
      spec: '0909',
      model: '1938-gtx990',
      drnum: '01990'
    }, {
      code: "0001",
      name: '物料1',
      spec: '0909',
      model: '1938-gtx990',
      drnum: '01990'
    }, {
      code: "0001",
      name: '物料1',
      spec: '0909',
      model: '1938-gtx990',
      drnum: '01990'
    }, {
      code: "0001",
      name: '物料1',
      spec: '0909',
      model: '1938-gtx990',
      drnum: '01990'
    }, {
      code: "0001",
      name: '物料1',
      spec: '0909',
      model: '1938-gtx990',
      drnum: '01990'
    }, {
      code: "0001",
      name: '物料1',
      spec: '0909',
      model: '1938-gtx990',
      drnum: '01990'
    }, {
      code: "0001",
      name: '物料1',
      spec: '0909',
      model: '1938-gtx990',
      drnum: '01990'
    }, {
      code: "0001",
      name: '物料1',
      spec: '0909',
      model: '1938-gtx990',
      drnum: '01990'
    }, {
      code: "0001",
      name: '物料1',
      spec: '0909',
      model: '1938-gtx990',
      drnum: '01990'
    }, {
      code: "0001",
      name: '物料1',
      spec: '0909',
      model: '1938-gtx990',
      drnum: '01990'
    },
  ]

  constructor(
    public http: HttpService
  ) {
  }

  ngOnInit() {
    // this.loading = true;
    // this.getData();
    this.columns.forEach(c => {
      if (!c.hasOwnProperty('display')) {
        c.display = true;
      }
    })
  }

  //单选行，勾选框
  rowClick(row: any) {
    this.selected = row;
  }

  //取消按钮事件
  cancel() {
    this.visible = false;
  }

  //确认返回事件
  ok() {
    this.visible = false;
    if (this.selected) {
      this.content = this.selected;
      this.result.emit(this.selected);
    } else {
      // this.result.emit(false);
    }
  }

  //获取数据源并整理格式
  getData() {
    // 传url，服务器端分页
    this.loading = true;
    if (!this.data && this.url && this.servicePage) {
      this.http.postPage(this.url, this.pageIndex, this.pageSize,
        this.urlHeader, this.urlBody).subscribe(res => {
          const list = JSON.parse(JSON.stringify(res));
          if (list) {
            this.data = list;
            if (this.tree) {
              this.listToTree();
            }
          }
          this.loading = false;
        },
        error1 => {
          this.loading = false;
          throw new Error(error1);
        }
      );
    }
    //传url，前端分页
    else if (!this.data && this.url && !this.servicePage) {
      //判断取数方式
      const ob = this.method == 'POST' ? this.http.post(this.url,
        this.urlHeader, this.urlBody) :
        this.http.get(this.url, this.urlHeader);
      //取数据源
      ob.subscribe(res => {
          const list = JSON.parse(JSON.stringify(res));
          if (list) {
            this.data = list;
            //整理树类型数据源
            if (this.tree) {
              this.listToTree();
            }
          }
          this.loading = false;
        },
        error1 => {
          this.loading = false;
          throw new Error(error1);
        }
      );
    }

    // 传data优先data
    if (this.data && this.columns) {
      if (this.tree) {
        this.listToTree();
      }
      this.loading = false;
    }
    //不传columns自己循环一个 不分类型，不建议用
    else if (this.data && !this.columns) {
      this.loading = false;
    }
  }

  //展示列
  displayedCols(): Array<any> {
    try {
      return this.columns.filter(c => c.display || !c.hasOwnProperty('display'));
    } catch (e) {
    }
  }

  colWidth(): string {
    try {
      return this.displayedCols().length * 150 + 50 + 'px';
    } catch (e) {
    }
  }

  //勾选行
  checkRow(checked: boolean, a: any) {
    if (checked) {
      this.selected = a;
    } else {
      this.selected = null;
    }
  }

  //表头勾选
  thChecked(checked: boolean) {
    if (checked) {
    } else {
      this.selected = null;
    }
  }

  //列表转树
  listToTree() {
    if (!(this.parentId in this.data[0]) && this.path in this.data[0] && this.layer in this.data[0]) {
      this.data.sort((a, b) => a[this.layer] - b[this.layer]);
      this.listData = [...this.data];
      this.treeData = [...this.data];
      let min = this.treeData[0][this.layer];
      let max = this.treeData[this.treeData.length - 1][this.layer];
      for (let i = min; i < max; i++) {
        let parents = this.treeData.filter(l => l[this.layer] == i);
        parents.forEach(p => {
          let path = p[this.path];
          let children = this.treeData.filter(l => l[this.path].indexOf(path) == 0 && l[this.layer] == i + 1);
          if (children.length > 0) {
            p['children'] = children;
          }
        });
      }
      this.data = this.treeData.filter(l => l[this.layer] == min);
    } else if (this.parentId in this.data[0]) {
      this.listData = [...this.data];
      this.treeData = [...this.data];
      this.pushChildren(this.treeData);
      this.data = this.treeData.filter(l => !l[this.parentId]);
    }

    this.data.forEach(item => {
      this.mapOfExpandedData[item[this.path]] = this.convertTreeToList(item);
    });
  }

  //循环查找子集
  pushChildren(data: Array<any>) {
    data.forEach(d => {
      let children = this.treeData.filter(f => f[this.parentId] == d[this.id]);
      if (children.length > 0) {
        this.pushChildren(children);
        d['children'] = children;
      }
    });
  }

  visitNode(node: TreeNodeInterface, hashMap: { [key: string]: any },
            array: TreeNodeInterface[]): void {
    if (!hashMap[node[this.path]]) {
      hashMap[node[this.path]] = true;
      array.push(node);
    }
  }

  //树列表折行
  collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {
    if ($event === false) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a[this.path] == d[this.path])!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  //树转换为列表
  convertTreeToList(root: object): TreeNodeInterface[] {
    const stack: any[] = [];
    const array: any[] = [];
    const hashMap = {};
    stack.push({...root, level: 0, expand: false});

    while (stack.length !== 0) {
      const node = stack.pop();
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({...node.children[i], level: node.level + 1, expand: false, parent: node});
        }
      }
    }
    return array;
  }

  openHelp() {
    this.visible = true;
    if (this.content) {
      this.selected = this.content;
    } else {
      this.selected = null;
    }
  }

  query(data: any) {

  }

  clear() {
    this.content = undefined;
  }

  clearContent() {
    let v = this.content;
    this.content = undefined;
    this.result.emit({
      "clear": true,
      "data": v
    });
  }
}
