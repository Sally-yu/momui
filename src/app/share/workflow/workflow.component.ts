import {AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import * as JQuery from 'jquery';
import * as joint from 'node_modules/jointjs/dist/joint.js';
import {ResizeSensor} from 'css-element-queries';

@Component({
  selector: 'workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.less']
})
export class WorkflowComponent implements OnInit, AfterViewInit, OnChanges {

  @ViewChild('jointdiv', {static: false}) joint: ElementRef;

  @Input() Width: number | string; // 宽度
  @Input() Height: number | string; // 高度
  @Input() DataSource: Array<any>;// 默认数据源
  @Input() BodyColor: string; //块背景颜色
  @Input() TextColor: string; // 文字颜色
  @Input() StrokeColor: string; //边框颜色
  @Input() LineColor: string;//连线颜色
  @Input() LineWidth: number;//连线宽度

  @Input() col: number; //列数，默认自动计算
  @Input() distance: number;//列最小间距，默认50

  model;
  paper;
  rects = [];


  constructor() {
    this.Width = this.Width ? this.Width : '100%';
    this.Height = this.Height ? this.Height : '100%';
    this.BodyColor = this.BodyColor ? this.BodyColor : '#f2f2f2';
    this.TextColor = this.TextColor ? this.TextColor : '#444444';
    this.StrokeColor = this.StrokeColor ? this.StrokeColor : this.TextColor;
    this.distance = this.distance ? this.distance : 50;
    this.DataSource = this.DataSource ? this.DataSource : [];
    this.LineColor=this.LineColor?this.LineColor:this.TextColor;
    this.LineWidth=this.LineWidth?this.LineWidth:2;
  }

  ngOnInit() {
    this.model = new joint.dia.Graph;
    this.paper = new joint.dia.Paper({
      el: JQuery('#jointdiv'),
      model: this.model,
      width: this.Width,
      height: this.Height,
      gridSize: 1
    });
  }

  //页面展示后
  ngAfterViewInit() {
    new ResizeSensor(this.joint.nativeElement, () => {
      this.pushNodes();
    });
  }

  //传入值改变，重新渲染
  ngOnChanges(changes: SimpleChanges) {
    if (changes && !Object.values((changes))[0].firstChange) {
      this.pushNodes();
    }
  }

  //推演流程图
  pushNodes() {
    this.model.clear();
    this.rects = [];
    let width = this.joint.nativeElement.offsetWidth;
    let height = this.joint.nativeElement.offsetHeight;
    let col = this.col ? this.col : Math.floor(width / (50 + this.distance) / 2);
    let len = this.DataSource.length;
    let row = Math.ceil(len / col);//总行数
    let distanceX = width / (2 * col);//横向距离
    let distanceY = height / (2 * row);//纵向行间距
    let left = distanceX;
    let top = distanceY;
    let fromLeft = true;

    for (let i = 0; i < this.DataSource.length; i++) {
      if (i == 0) {
        //首块不换行，单倍间距起
      } else {
        if (i % col == 0) { //已换行块，x不动，y下移
          top += 2 * distanceY;
          fromLeft = !fromLeft;
        } else { //同行块，按方向判断增减
          if (fromLeft) {
            left += 2 * distanceX;
          } else {
            left -= 2 * distanceX;
          }
        }
      }
      this.DataSource[i]['x'] = left - 50;
      this.DataSource[i]['y'] = top - 20;

      const rect = new joint.shapes.standard.Rectangle();
      rect.position(this.DataSource[i]['x'], this.DataSource[i]['y']);
      rect.resize(100, 40);
      rect.attr({
        body: {
          fill: this.BodyColor,
          stroke: this.StrokeColor
        },
        label: {
          text: this.DataSource[i].text,
          fill: this.TextColor
        }
      });
      rect.addTo(this.model);
      this.rects.push(rect);
    }
    this.link();
  }

  //添加连接线
  link() {
    for (let i = 0; i < this.rects.length - 1; i++) {
      const link = new joint.shapes.standard.Link();
      link.attr({
        line: {
          stroke: this.LineColor,
          strokeWidth: this.LineWidth,
        }
      });
      link.source(this.rects[i]);
      link.target(this.rects[i + 1]);
      link.addTo(this.model);
    }
  }


}
