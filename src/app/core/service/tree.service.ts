/*
TODO：列表转树形列表支持分级码和parentid，转成方便ant列表组件识别的树形数据，json嵌套格式，子集字段为children
*/

import {Injectable} from '@angular/core';
import {from} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TreeService {

  //默认的parent字段
  parentId = 'parentid';
  //默认parentid指向的id字段
  id = 'id';

  //默认的path分级码字段
  path = 'path';
  //默认的layer层级字段
  layer = 'layer';

  //列表数据源
  data: Array<any>;
  //树列表结果
  treeData: Array<any>;

  url:string;

  constructor(
    private http:HttpClient
  ) {
  }

  //列表转树
  listToTree() {
    //TODO:使用分级码
    if (!(this.parentId in this.data[0]) && this.path in this.data[0] && this.layer in this.data[0]) {
      //TODO:排序，取层级最大最小值
      this.data.sort((a, b) => a[this.layer] - b[this.layer]);
      this.treeData = [...this.data];
      let min = this.treeData[0][this.layer];
      let max = this.treeData[this.treeData.length - 1][this.layer];
      //TODO:按层级循环
      for (let i = min; i < max; i++) {
        let parents = this.treeData.filter(l => l[this.layer] == i);
        parents.forEach(p => {
          //TODO:追加children
          let path = p[this.path];
          let children = this.treeData.filter(l => l[this.path].indexOf(path) == 0 && l[this.layer] == i + 1);
          if (children.length > 0) {
            p['children'] = children;
          }
        });
      }
      this.treeData = this.treeData.filter(l => l[this.layer] == min);
    }
    //TODO:使用parentid
    else if (this.parentId in this.data[0]) {
      this.treeData = [...this.data];
      this.pushChildren(this.treeData);
      this.treeData = this.treeData.filter(l => !l[this.parentId]);
    }
    return this.treeData;
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

  //TODO:异步转换树列表，数据量大时使用，subscribe订阅
  rxTree() {
    return from(this.listToTree()).pipe(
      tap(res => {
        console.log(res);
      }),
      catchError((err) => {
        throw new Error(err);
      }));
  }

}
