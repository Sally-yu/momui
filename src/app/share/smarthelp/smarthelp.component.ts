import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {HttpService} from './service/http.service';

declare type METHOD = 'POST' | 'GET' | null; //取数方式

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
export class SmarthelpComponent implements OnInit, OnDestroy {

  //确定按钮弹出事件
  @Output() onOk: EventEmitter<any> = new EventEmitter<any>();

  //取消关闭等弹出事件
  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();

  //帮助标题
  @Input() title: string = '快捷帮助';

  //显示弹窗
  @Input() visible: boolean = false;

  //取数url
  @Input() url: string = null;

  //取数方式
  @Input() method: METHOD = null;

  //请求头
  @Input() urlHeader: any = null;

  //post请求体
  @Input() urlBody: any = null;

  //帮助数据源，最终显示的数据
  @Input() data: Array<any> = null;

  //树形数据
  @Input() treeData: Array<any> = null;

  //默认每页记录数
  @Input() pageSize: number = 10;

  //显示快速跳转页码
  @Input() showJumper: boolean = true;

  //显示每页条数选项
  @Input() showPageSelection: boolean = false;

  //帮助数据源列名映射关系
  @Input() columns: Array<any> = null;

  //是否树形帮助
  @Input() tree: boolean = false;

  //多选
  // @Input() multiSelect: boolean = false;

  //分级码字段
  @Input() path: string = 'path';

  //层级字段
  @Input() layer: string = 'layer';

  //列表型数据，树帮助时存储全部展开的列表数据
  listData: Array<any> = null;

  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};

  searchValue: string = null; // 简单搜索值
  loading: boolean = false; // 加载中

  selected: any = null;  // 暂时标记选中值

  pageOption = [5, 10, 20, 50, 100];

  constructor(
    private http: HttpService
  ) {

  }

  ngOnInit() {
    this.loading = true;
    this.getData();
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

  //获取数据源并整理格式
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
            console.log(this.data);
            //整理树类型数据源
            if (this.tree) {
              this.listToTree();
            }
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
      if (this.tree) {
        this.listToTree();
      }
      this.loading = false;
    }
    //不传columns自己循环一个 不分类型，不建议用
    else if (this.data && !this.columns) {
      for (var key in this.data) {
        this.columns = [...this.columns, {code: key, name: key}];
      }
      if (this.tree) {
        this.listToTree();
      }
      this.loading = false;
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
    console.log(this.data);
    this.data.forEach(item => {
      this.mapOfExpandedData[item[this.path]] = this.convertTreeToList(item);
    });
  }


  visitNode(node: TreeNodeInterface, hashMap: { [key: string]: any }, array: TreeNodeInterface[]): void {
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


  ngOnDestroy(): void {
    console.log('destory');
  }


}
