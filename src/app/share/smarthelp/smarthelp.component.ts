import {
  AfterViewChecked, AfterViewInit,
  ChangeDetectorRef,
  Component, ElementRef,
  EventEmitter,
  Input, OnInit,
  Output, ViewChild,
} from '@angular/core';
import {HttpService} from './service/http.service';
import {del} from "selenium-webdriver/http";

export interface TreeNodeInterface {
  key: number;
  name: string;
  age: number;
  level: number;
  expand: boolean;
  address: string;
  children?: TreeNodeInterface[];
}

@Component({
  selector: 'smarthelp',
  templateUrl: './smarthelp.component.html',
  styleUrls: ['./smarthelp.component.less']
})
export class SmarthelpComponent implements AfterViewChecked ,AfterViewInit{

  @ViewChild('searchInput', {static: true}) input: any;

  //当前选中项
  //仿制帮助时,务必保证该变量名为item  重要
  content: any;

  json: JSON = new class implements JSON {
    readonly [Symbol.toStringTag]: string;

    parse(text: string, reviver?: (this: any, key: string, value: any) => any): any {
    }

    stringify(value: any, replacer?: (this: any, key: string, value: any) => any, space?: string | number): string;
    stringify(value: any, replacer?: (number | string)[] | null, space?: string | number): string;
    stringify(value: any, replacer?: ((this: any, key: string, value: any) => any) | (number | string)[] | null, space?: string | number): string {
      return "";
    }
  };

  //弹出结果事件
  //仿制帮助时,务必保证该变量名为result   重要
  @Output() result: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('muiltInput', {static: false}) muiltInput: ElementRef;

  //暂存选中行
  selected: any;

  selectedList: Array<any> = new Array<any>();

  //帮助标题
  @Input() title: string = '快捷帮助';

  //显示弹窗
  @Input() visible: boolean = false;

  //服务器端分页
  @Input() servicePage: boolean = false;

  //取数url
  @Input() url: string;

  //取数方式
  @Input() method: string;

  //请求头
  @Input() urlHeader: any;

  //post请求体
  @Input() urlBody: any;

  //帮助数据源，最终显示的数据
  displayData: Array<any>;

  @Input() data: Array<any>;

  //树形数据
  treeData: Array<any>;

  //默认每页记录数
  @Input() pageSize: number = 10;

  //默认启动页
  @Input() pageIndex: number = 1;

  //显示快速跳转页码
  @Input() showJumper: boolean = false;

  //帮助数据源列名映射关系
  @Input() columns: Array<any>;

  //是否树形帮助
  @Input() tree: boolean = false;

  //多选
  @Input() multiSelect: boolean = false;

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
  @Input() placeHolder: string = '';

  //列表型数据，全部列表数据
  listData: Array<any>;

  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};

  searchValue: string = null; // 简单搜索值
  loading: boolean = false;
  focus: boolean;
  @Input() readOnly: boolean = false;

  constructor(
    public http: HttpService,
    private cdRef: ChangeDetectorRef
  ) {
  }

  //表头勾选
  thChecked(checked: boolean) {
    if (this.tree) {
      if (this.selectedList.length < this.treeData.length) {
        Object.values(this.mapOfExpandedData).forEach(e => {
          e.forEach(d => {
            this.addToSelectec(d);
          })
        });
      } else {
        this.selectedList = [];
      }
    } else {
      if (this.selectedList.length < this.displayData.length) {
        this.selectedList = JSON.parse(JSON.stringify(this.displayData))
      } else {
        this.selectedList = [];
      }
    }
  }

  addToSelectec(d) {
    if (JSON.stringify(this.selectedList).indexOf(JSON.stringify(d)) < 0) {
      this.selectedList = [...this.selectedList, d];
    }
    if (d.hasOwnProperty('children') && d.children.length > 0) {
      d.children.forEach(e => {
        this.addToSelectec(e);
      })
    }
  }

  //行勾选
  checkRow(checked: boolean, row: any) {
    this.rowClick(row);
  }

  //行点击
  rowClick(row: any) {
    let a = JSON.stringify(row);
    if (this.multiSelect) {
      if (JSON.stringify(this.selectedList).includes(a)) {
        this.selectedList = this.selectedList.filter(s => JSON.stringify(s) != a);
      } else {
        this.selectedList = [...this.selectedList, JSON.parse(a)];
      }
    } else {
      this.selected = row;
    }
  }

  //取消按钮事件
  cancel() {
    this.visible = false;
    this.searchValue = undefined;
    this.displayData = undefined;
    this.selected = undefined;
    this.selectedList = [];
  }

  //确认返回事件
  ok() {
    if (!this.multiSelect) {
      this.content = this.selected;
      this.result.emit(this.content);
    }
    if (this.multiSelect) {
      this.content = this.selectedList;
      this.muiltInput.nativeElement.value = this.muiltTitle();
      this.result.emit(this.content);
    }
    this.cancel();
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
            this.displayData = list;
            this.listData = [...this.displayData];
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
            this.displayData = list;
            this.listData = [...this.displayData];
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
    else if (this.data && this.columns) {
      this.displayData = [...this.data];
      this.listData = [...this.displayData];
      if (this.tree) {
        this.listToTree();
      }
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

  //列表转树
  listToTree() {
    //分级码树
    if (this.displayData[0] && this.path in this.displayData[0] && this.layer in this.displayData[0]) {
      this.displayData.sort((a, b) => a[this.layer] - b[this.layer]);
      this.treeData = [...this.displayData];
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
      this.displayData = this.treeData.filter(l => l[this.layer] == min);
    }
    //parentid树
    else if (this.displayData[0] && this.parentId in this.displayData[0]) {
      this.treeData = [...this.displayData];
      this.pushChildren(this.treeData);
      this.displayData = this.treeData.filter(l => !l[this.parentId]);
    }
    this.displayData.forEach(item => {
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
    if (this.readOnly) {
      return;
    }
    this.visible = true;
    this.getData();
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
    if (this.multiSelect){
      this.muiltInput.nativeElement.value = this.muiltTitle();
    }
  }

  clearContent() {
    if (this.readOnly) {
      return;
    }
    // let v = this.content;
    this.content = undefined;
    // this.result.emit({
    //   "clear": true,
    //   "data": v
    // });
  }

  search() {
    if (this.searchValue && this.searchValue.length > 0) {
      this.displayData = JSON.parse(JSON.stringify(this.listData)).filter(d => {
        let i = 0;
        this.displayedCols().forEach(c => {
          if (d.hasOwnProperty(c.code) && d[c.code].toString().indexOf(this.searchValue) >= 0) {
            i += 1;
          }
        });
        return i > 0;
      });
    } else {
      this.displayData = JSON.parse(JSON.stringify(this.listData));
    }

    if (this.tree) {
      this.listToTree();
    }
  }

  isSelected(row) {
    if (this.tree) {
      return this.selectedList.filter(s => {
        return this.treeNodeComapre(s, row);
      }).length > 0;
    } else {
      return this.selectedList.filter(s => JSON.stringify(s) == JSON.stringify(row)).length > 0;
    }
  }

  muiltTitle() {
    let title = '';
    try {
      this.content.forEach(e => {
        title = title + ';' + e[this.name];
      });
    } catch (e) {
    }
    return title.slice(1);
  }

  treeNodeComapre(node1, node2) {
    let n1 = JSON.parse(JSON.stringify(node1));
    let n2 = JSON.parse(JSON.stringify(node2));
    delete n1.expand;
    delete n2.expand;
    return JSON.stringify(n1) === JSON.stringify(n2);
  }

  ngAfterViewInit(): void {

  }
}
