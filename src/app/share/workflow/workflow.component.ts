import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import * as jQuery from 'jquery';
import * as joint from 'node_modules/jointjs/dist/joint.js';
import {ResizeSensor} from 'css-element-queries';
import {g} from 'node_modules/jointjs/dist/joint';

@Component({
  selector: 'workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.less']
})

export class WorkflowComponent implements OnInit, AfterViewInit, OnChanges {

  @ViewChild('jointdiv', {static: false}) joint: ElementRef;

  @Output() blockClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() selected: any;//选中节点

  @Input() Width: number | string = '100%'; // 宽度
  @Input() Height: number | string = '100%'; // 高度
  @Input() DataSource: Array<any> = [];// 默认数据源
  @Input() TreeData: any;//树形数据源
  @Input() BackgroundColor: string;//整体背景颜色
  @Input() BackgroundImg: string;//背景图
  @Input() BodyColor: string = 'rgb(27,134,215)'; //块背景颜色
  @Input() TextColor: string = '#ffffff'; // 文字颜色
  @Input() HighLightColor: string = 'rgb(250,158,59)';//高亮块
  @Input() HighLightTextColor: string = '#ffffff';//高亮块
  @Input() StrokeColor: string; //边框颜色
  @Input() LineColor: string = 'rgb(158,185,206)';//连线颜色
  @Input() LineWidth: number = 4;//连线宽度
  @Input() children: string = 'children';//子级标识字段

  @Input() col: number = 0; //列数，默认自动计算
  @Input() distance: number = 50;//列最小间距，

  @Input() boxWidth: number = 160;
  @Input() boxHeight: number = 80;
  @Input() radius: number = 40;

  @Input() text: string = 'text';//标签绑定的字段名
  @Input() highLightKey: string = 'selected'; //选中标记符，字段值boolean
  @Input() markSize: number = 6;//连线箭头大小

  model;
  paper;
  rects = [];
  row: number = 0;
  private disX: number;
  private disY: number;
  private ys: Array<number> = [];
  private xs: Array<number> = [];
  private avaHeight: number;
  private minTop: number = 999999;


  constructor() {
    this.StrokeColor = this.StrokeColor ? this.StrokeColor : this.TextColor;
    this.LineColor = this.LineColor ? this.LineColor : this.TextColor;
  }

  ngOnInit() {
    // this.loading=true;
    this.model = new joint.dia.Graph;
    this.paper = new joint.dia.Paper({
      el: jQuery('#jointdiv'),
      model: this.model,
      width: this.Width,
      height: this.Height,
      gridSize: 1,
      interactive: false,
      background: {
        color: this.BackgroundColor,
        image: this.BackgroundImg
      },
    });
    let self = this;
    this.paper.on('element:pointerclick', function(elementView) {
      console.log(self.paper)
      let elements = self.paper.model.getElements();
      elements.forEach(e => {
        //内部节点不变色
        if (e.attributes.attrs.body.class != 'sub') {
          e.attr('body/fill', self.BodyColor);
          e.attr('label/fill', self.TextColor);
        }
      });
      let currentElement = elementView.model;
      let x = currentElement.attributes.position.x;
      let y = currentElement.attributes.position.y;
      if (self.DataSource.length > 0) {
        self.selected = self.DataSource.filter(d => d['x'] == x && d['y'] == y)[0];
      } else if (self.TreeData) {
        self.searchTreeNode(self.TreeData, x, y);
      }
      if (currentElement.attributes.attrs.body.class != 'sub') {
        currentElement.attr('body/fill', self.HighLightColor);
        currentElement.attr('label/fill', self.HighLightTextColor);
        self.blockClick.emit(self.selected);
      }
    });

  }

  //点选事件遍历子节点
  searchTreeNode(data, x, y) {
    if (data['x'] == x && data['y'] == y) {
      this.selected = data;
      return;
    } else {
      if (data.hasOwnProperty(this.children) && data[this.children].length > 0) {
        data[this.children].forEach(d => {
          this.searchTreeNode(d, x, y);
        });
      }
    }
  }

  //页面展示后
  ngAfterViewInit() {
    this.avaHeight = this.joint.nativeElement.offsetHeight - 40;
    this.paper.setDimensions(this.Width, this.avaHeight);
    //监听窗口大小变化，自动缩放
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
    this.avaHeight = this.joint.nativeElement.offsetHeight - 40;//重新设置高度
    this.paper.setDimensions(this.Width, this.avaHeight);
    if (this.DataSource.length > 0) {
      let col = this.col ? this.col : Math.floor(width / (0.5 * this.boxWidth + this.distance) / 2);
      let len = this.DataSource.length;
      let row: number;
      row = Math.ceil(len / col);//总行数
      this.disY = this.avaHeight / (2 * row);//纵向行间距
      this.disX = (width - 2 * this.disY) / (2 * col);//横向距离

      let left = this.disX + this.disY;
      let top = this.disY;
      let fromLeft = true;
      let link;
      for (let i = 0; i < this.DataSource.length; i++) {
        let edge = false;
        if (i == 0) {
          //首块不换行，单倍间距起
        } else {
          if (i % col == 0) { //已换行块，x不动，y下移
            top += 2 * this.disY;
            fromLeft = !fromLeft;
            edge = true;
          } else { //同行块，按方向判断增减
            if (fromLeft) {
              left += 2 * this.disX;
            } else {
              left -= 2 * this.disX;
            }
          }
        }
        this.DataSource[i]['x'] = left - 0.5 * this.boxWidth;
        this.DataSource[i]['y'] = top - 0.5 * this.boxHeight;
        const rect = new joint.shapes.standard.Rectangle();
        rect.position(this.DataSource[i]['x'], this.DataSource[i]['y']);
        rect.resize(this.boxWidth, this.boxHeight);
        rect.attr({
          body: {
            cursor: 'pointer',
            fill: this.DataSource[this.highLightKey] ? this.HighLightColor : this.BodyColor,
            stroke: this.DataSource[this.highLightKey] ? this.HighLightTextColor : this.StrokeColor,
            rx: this.radius,  // 默认椭圆格子
            ry: this.radius,
            strokeWidth: 0
          },
          label: {
            cursor: 'pointer',
            text: this.DataSource[i][this.text],
            fill: this.TextColor,
            'ref-x':(this.boxHeight)/3
          }
        });
        rect.addTo(this.model);
        //阴影
        rect.attr('rect/filter', {
          name: 'dropShadow',
          args: {
            // dx: 2,
            // dy: 2,
            // blur: 4,
            opacity: .6,
          }
        });
        let subRect = new joint.shapes.standard.Rectangle();
        subRect.position(this.DataSource[i]['x'] + 4, this.DataSource[i]['y'] + 4);
        subRect.resize(this.boxHeight - 8, this.boxHeight - 8);
        subRect.attr({
          body: {
            cursor: 'pointer',
            fill: '#ffffff',
            rx: this.radius - 4,  // 默认椭圆格子
            ry: this.radius - 4,
            strokeWidth: 0,
            class: 'sub'
          },
          label: {
            cursor: 'pointer',
            text: 'OP'+(this.DataSource[i]['pre']?this.DataSource[i]['pre']:''),
            fill: '#101010'
          },
        });

        // rect.addTo(this.model);
        this.model.addCells([rect, subRect]);
        rect.embed(subRect);

        // subRect.addTo(this.model);
        link = this.link(rect, link, edge, fromLeft);
      }
    }
    //树结构标识符
    else if (this.TreeData) {
      this.col = 0;//缩放时初始化
      this.row = 0;
      this.xs = [];
      this.ys = [];
      this.checkChildren(this.TreeData);
      this.forTree(this.TreeData, 10, 0);
      this.col = [...new Set(this.xs)].length;
      this.row = [...new Set(this.ys)].length;
      console.log(this.col);
      console.log(this.row);
      this.disX = width / (this.col + 1);//横向距离
      this.disY = this.avaHeight / (this.row + 1);//纵向行间距
      this.completeTree(this.TreeData, null, this.disX, 0);
    }

  }

  /*
  * TODO:顺序结构连线
  * */

  //顺序相连，添加连接线
  link(rect: any, link: any, edge: boolean, fromLeft: boolean): any {
    if (link) {
      link.target(rect, {
        connectionPoint: {
          name: 'boundary',
          args: {
            offset: 4
          }
        }
      });
      if (edge) {
        let y = rect.attributes.position['y'] + 0.5 * this.boxHeight;
        if (!fromLeft) {
          let x = rect.attributes.position['x'] + this.boxWidth;
          link.vertices([
            new g.Point(x + 0.05 * this.disY, y - (1 + Math.sqrt(1 - 0.0025)) * this.disY),
            new g.Point(x + 0.1 * this.disY, y - (1 + Math.sqrt(1 - 0.01)) * this.disY),
            new g.Point(x + 0.15 * this.disY, y - (1 + Math.sqrt(1 - 0.0225)) * this.disY),
            new g.Point(x + 0.2 * this.disY, y - (1 + Math.sqrt(1 - 0.04)) * this.disY),
            new g.Point(x + 0.25 * this.disY, y - (1 + Math.sqrt(1 - 0.0625)) * this.disY),
            new g.Point(x + 0.3 * this.disY, y - (1 + Math.sqrt(1 - 0.09)) * this.disY),
            new g.Point(x + 0.35 * this.disY, y - (1 + Math.sqrt(1 - 0.1225)) * this.disY),
            new g.Point(x + 0.4 * this.disY, y - (1 + Math.sqrt(1 - 0.16)) * this.disY),
            new g.Point(x + 0.45 * this.disY, y - (1 + Math.sqrt(1 - 0.2025)) * this.disY),
            new g.Point(x + 0.5 * this.disY, y - (1 + Math.sqrt(1 - 0.25)) * this.disY),
            new g.Point(x + 0.55 * this.disY, y - (1 + Math.sqrt(1 - 0.3025)) * this.disY),
            new g.Point(x + 0.6 * this.disY, y - (1 + Math.sqrt(1 - 0.36)) * this.disY),
            new g.Point(x + 0.65 * this.disY, y - (1 + Math.sqrt(1 - 0.4225)) * this.disY),
            new g.Point(x + 0.7 * this.disY, y - (1 + Math.sqrt(1 - 0.49)) * this.disY),
            new g.Point(x + 0.75 * this.disY, y - (1 + Math.sqrt(1 - 0.5625)) * this.disY),
            new g.Point(x + 0.8 * this.disY, y - (1 + Math.sqrt(1 - 0.64)) * this.disY),
            new g.Point(x + 0.85 * this.disY, y - (1 + Math.sqrt(1 - 0.7225)) * this.disY),
            new g.Point(x + 0.9 * this.disY, y - (1 + Math.sqrt(1 - 0.81)) * this.disY),
            new g.Point(x + 0.95 * this.disY, y - (1 + Math.sqrt(1 - 0.9025)) * this.disY),
            new g.Point(x + this.disY, y - this.disY),
            new g.Point(x + 0.95 * this.disY, y - (1 - Math.sqrt(1 - 0.9025)) * this.disY),
            new g.Point(x + 0.9 * this.disY, y - (1 - Math.sqrt(1 - 0.81)) * this.disY),
            new g.Point(x + 0.85 * this.disY, y - (1 - Math.sqrt(1 - 0.7225)) * this.disY),
            new g.Point(x + 0.8 * this.disY, y - (1 - Math.sqrt(1 - 0.64)) * this.disY),
            new g.Point(x + 0.75 * this.disY, y - (1 - Math.sqrt(1 - 0.5625)) * this.disY),
            new g.Point(x + 0.7 * this.disY, y - (1 - Math.sqrt(1 - 0.49)) * this.disY),
            new g.Point(x + 0.65 * this.disY, y - (1 - Math.sqrt(1 - 0.4225)) * this.disY),
            new g.Point(x + 0.6 * this.disY, y - (1 - Math.sqrt(1 - 0.36)) * this.disY),
            new g.Point(x + 0.55 * this.disY, y - (1 - Math.sqrt(1 - 0.3025)) * this.disY),
            new g.Point(x + 0.5 * this.disY, y - (1 - Math.sqrt(1 - 0.25)) * this.disY),
            new g.Point(x + 0.45 * this.disY, y - (1 - Math.sqrt(1 - 0.2025)) * this.disY),
            new g.Point(x + 0.4 * this.disY, y - (1 - Math.sqrt(1 - 0.16)) * this.disY),
            new g.Point(x + 0.35 * this.disY, y - (1 - Math.sqrt(1 - 0.1225)) * this.disY),
            new g.Point(x + 0.3 * this.disY, y - (1 - Math.sqrt(1 - 0.09)) * this.disY),
            new g.Point(x + 0.25 * this.disY, y - (1 - Math.sqrt(1 - 0.0625)) * this.disY),
            new g.Point(x + 0.2 * this.disY, y - (1 - Math.sqrt(1 - 0.04)) * this.disY),
            new g.Point(x + 0.15 * this.disY, y - (1 - Math.sqrt(1 - 0.0225)) * this.disY),
            new g.Point(x + 0.1 * this.disY, y - (1 - Math.sqrt(1 - 0.01)) * this.disY),
            new g.Point(x + 0.05 * this.disY, y - (1 - Math.sqrt(1 - 0.0025)) * this.disY),
          ]);
        } else if (fromLeft) {
          let x = rect.attributes.position['x'];
          link.vertices([
            new g.Point(x - 0.05 * this.disY, y - (1 + Math.sqrt(1 - 0.0025)) * this.disY),
            new g.Point(x - 0.1 * this.disY, y - (1 + Math.sqrt(1 - 0.01)) * this.disY),
            new g.Point(x - 0.15 * this.disY, y - (1 + Math.sqrt(1 - 0.0225)) * this.disY),
            new g.Point(x - 0.2 * this.disY, y - (1 + Math.sqrt(1 - 0.04)) * this.disY),
            new g.Point(x - 0.25 * this.disY, y - (1 + Math.sqrt(1 - 0.0625)) * this.disY),
            new g.Point(x - 0.3 * this.disY, y - (1 + Math.sqrt(1 - 0.09)) * this.disY),
            new g.Point(x - 0.35 * this.disY, y - (1 + Math.sqrt(1 - 0.1225)) * this.disY),
            new g.Point(x - 0.4 * this.disY, y - (1 + Math.sqrt(1 - 0.16)) * this.disY),
            new g.Point(x - 0.45 * this.disY, y - (1 + Math.sqrt(1 - 0.2025)) * this.disY),
            new g.Point(x - 0.5 * this.disY, y - (1 + Math.sqrt(1 - 0.25)) * this.disY),
            new g.Point(x - 0.55 * this.disY, y - (1 + Math.sqrt(1 - 0.3025)) * this.disY),
            new g.Point(x - 0.6 * this.disY, y - (1 + Math.sqrt(1 - 0.36)) * this.disY),
            new g.Point(x - 0.65 * this.disY, y - (1 + Math.sqrt(1 - 0.4225)) * this.disY),
            new g.Point(x - 0.7 * this.disY, y - (1 + Math.sqrt(1 - 0.49)) * this.disY),
            new g.Point(x - 0.75 * this.disY, y - (1 + Math.sqrt(1 - 0.5625)) * this.disY),
            new g.Point(x - 0.8 * this.disY, y - (1 + Math.sqrt(1 - 0.64)) * this.disY),
            new g.Point(x - 0.85 * this.disY, y - (1 + Math.sqrt(1 - 0.7225)) * this.disY),
            new g.Point(x - 0.9 * this.disY, y - (1 + Math.sqrt(1 - 0.81)) * this.disY),
            new g.Point(x - 0.95 * this.disY, y - (1 + Math.sqrt(1 - 0.9025)) * this.disY),
            new g.Point(x - this.disY, y - this.disY),
            new g.Point(x - 0.95 * this.disY, y - (1 - Math.sqrt(1 - 0.9025)) * this.disY),
            new g.Point(x - 0.9 * this.disY, y - (1 - Math.sqrt(1 - 0.81)) * this.disY),
            new g.Point(x - 0.85 * this.disY, y - (1 - Math.sqrt(1 - 0.7225)) * this.disY),
            new g.Point(x - 0.8 * this.disY, y - (1 - Math.sqrt(1 - 0.64)) * this.disY),
            new g.Point(x - 0.75 * this.disY, y - (1 - Math.sqrt(1 - 0.5625)) * this.disY),
            new g.Point(x - 0.7 * this.disY, y - (1 - Math.sqrt(1 - 0.49)) * this.disY),
            new g.Point(x - 0.65 * this.disY, y - (1 - Math.sqrt(1 - 0.4225)) * this.disY),
            new g.Point(x - 0.6 * this.disY, y - (1 - Math.sqrt(1 - 0.36)) * this.disY),
            new g.Point(x - 0.55 * this.disY, y - (1 - Math.sqrt(1 - 0.3025)) * this.disY),
            new g.Point(x - 0.5 * this.disY, y - (1 - Math.sqrt(1 - 0.25)) * this.disY),
            new g.Point(x - 0.45 * this.disY, y - (1 - Math.sqrt(1 - 0.2025)) * this.disY),
            new g.Point(x - 0.4 * this.disY, y - (1 - Math.sqrt(1 - 0.16)) * this.disY),
            new g.Point(x - 0.35 * this.disY, y - (1 - Math.sqrt(1 - 0.1225)) * this.disY),
            new g.Point(x - 0.3 * this.disY, y - (1 - Math.sqrt(1 - 0.09)) * this.disY),
            new g.Point(x - 0.25 * this.disY, y - (1 - Math.sqrt(1 - 0.0625)) * this.disY),
            new g.Point(x - 0.2 * this.disY, y - (1 - Math.sqrt(1 - 0.04)) * this.disY),
            new g.Point(x - 0.15 * this.disY, y - (1 - Math.sqrt(1 - 0.0225)) * this.disY),
            new g.Point(x - 0.1 * this.disY, y - (1 - Math.sqrt(1 - 0.01)) * this.disY),
            new g.Point(x - 0.05 * this.disY, y - (1 - Math.sqrt(1 - 0.0025)) * this.disY),
          ]);
        }
      }
      let m = this.markSize.toString();
      link.appendLabel({
        markup: [
          {
            tagName: 'path',
            selector: 'body'
          }
          , {
            tagName: 'text',
            selector: 'label'
          }
        ],
        attrs: {
          label: {
            text: ' ',
          },
          body: {
            rotate: true,
            ref: 'label',
            fill: this.LineColor,
            stroke: this.LineColor,
            strokeWidth: this.LineWidth,


            // 'stroke': 'black',
            // 'fill': 'yellow',
            d: edge ? 'M 0 0 0 0 0 0 Z' : (fromLeft ? `M -${m} ${m} ${m} 0 -${m} -${m} Z` : `M ${m} ${m} -${m} 0 ${m} -${m} Z`),//六点三坐标，三点围成三角箭头
          },
        },
        position: {
          distance: 0.5
        }
      });
      link.addTo(this.model);
    }
    const toNextLink = new joint.shapes.standard.Link();
    toNextLink.attr({
      line: {
        stroke: this.LineColor,
        strokeWidth: this.LineWidth,
        targetMarker: { //连接线默认无箭头
          'type': 'path',
          // 'stroke': 'black',
          // 'fill': 'yellow',
          'd': 'M 0 0 0 0 0 0 Z',//六点三坐标，三点围成三角箭头
        }
      }
    });
    toNextLink.source(rect, {
      connectionPoint: {
        name: 'boundary',
        args: {
          offset: 4
        }
      }
    });
    toNextLink.connector('smooth',);//圆润
    return toNextLink;
  }


  /*
  * TODO:树结构排布，连线
  * */

  //检索广度深度，存全局变量，先排布引导树
  checkChildren(data: any) {
    if (data.hasOwnProperty(this.children) && data[this.children].length > 0) {
      this.col += 1;
      data[this.children].forEach(d => {
        this.checkChildren(d);
      });
      // if (data[this.children].length % 2 == 0) {
      //   this.row -= 1;
      // }
    } else if (!data.hasOwnProperty(this.children)) {
      this.row += 1;
    }
  }

  //循环计算引导树节点位置，用于获取准确的行列数
  forTree(data: any, x: number, y: number) {
    data['x'] = x;
    data['y'] = y;
    this.minTop = Math.min(this.minTop, y);//取最顶位置块高度
    this.ys.push(y);
    this.xs.push(x);
    //计算子节点高度偏移
    if (data.hasOwnProperty(this.children) && data[this.children].length > 0) {
      let len = data[this.children].length;
      let middle = (len - 1) / 2;
      for (let i = 0; i < len; i++) {
        let top;
        if (i < middle) {
          top = y - Math.ceil(middle - i) * 10;
        } else if (i == middle) {
          top = y;
        } else if (i > middle) {
          top = Math.ceil(i - middle) * 10 + y;
        }
        this.forTree(data[this.children][i], x + 10, top);
      }
    }
  }

  //最终排列树
  completeTree(data: any, link: any, x: number, y: number) {
    data['x'] = x - 0.5 * this.boxWidth;
    data['y'] = y - 0.5 * this.boxHeight;
    data['y'] += 0.5 * this.avaHeight + this.minTop;//整体偏移至顶节点位置合适
    //根据data绘制方块
    const rect = new joint.shapes.standard.Rectangle();
    rect.position(data['x'], data['y']);
    rect.resize(this.boxWidth, this.boxHeight);
    rect.attr({
      body: {
        cursor: 'pointer',
        fill: this.TreeData[this.highLightKey] ? this.HighLightColor : this.BodyColor,
        stroke: this.TreeData[this.highLightKey] ? this.HighLightTextColor : this.StrokeColor,
        rx: this.radius,  //树形图 默认椭圆格子
        ry: this.radius,
        strokeWidth: 0
      },
      label: {
        cursor: 'pointer',
        text: data[this.text],
        fill: this.TextColor,
        'ref-x':this.boxHeight/3
      },
    });
    //阴影
    rect.attr('rect/filter', {
      name: 'dropShadow',
      args: {
        // dx: 2,
        // dy: 2,
        // blur: 8,
        opacity: 0.6,
      }
    });
    let subRect = new joint.shapes.standard.Rectangle();
    subRect.position(data['x'] + 4, data['y'] + 4);
    subRect.resize(this.boxHeight - 8, this.boxHeight - 8);
    subRect.attr({
      body: {
        cursor: 'pointer',
        fill: '#ffffff',
        rx: this.radius - 4,  // 默认椭圆格子
        ry: this.radius - 4,
        strokeWidth: 0,
        class: 'sub'
      },
      label: {
        cursor: 'pointer',
        text: 'OP'+(data['pre']?data['pre']:''),
        fill: '#101010'
      },
    });

    // rect.addTo(this.model);
    this.model.addCells([rect, subRect]);
    rect.embed(subRect);
    //传入连线的目标点
    if (link) {
      link.target(rect, {
        anchor: {
          name: 'left',
          rotate: true

        },
        connectionPoint: {
          name: 'boundary',
          args: {
            offset: 4
          }
        }
      });
      link.appendLabel({
        markup: [
          {
            tagName: 'path',
            selector: 'body'
          }
          , {
            tagName: 'text',
            selector: 'label'
          }
        ],
        attrs: {
          label: {
            text: ' ',
          },
          body: {
            ref: 'label',
            fill: this.BodyColor,
            stroke: this.LineColor,
            strokeWidth: this.LineWidth,
            refR: 2,
            refCx: 0,
            refCy: 0,

          },
        },
        position: {
          distance: 1
        }
      });
      link.addTo(this.model);
    }
    //计算子节点偏移位置，传入连线
    if (data.hasOwnProperty(this.children) && data[this.children].length > 0) {
      let len = data[this.children].length;
      let middle = (len - 1) / 2;
      for (let i = 0; i < len; i++) {
        let top;
        if (i < middle) {
          top = y - (middle - i) * this.disY;
        } else if (i == middle) {
          top = y;
        } else if (i > middle) {
          top = (i - middle) * this.disY + y;
        }
        let linkToNext = new joint.shapes.standard.Link();
        linkToNext.attr({
          line: {
            stroke: this.LineColor,
            strokeWidth: this.LineWidth,
            targetMarker: { //连接线默认无箭头
              'type': 'path',
              // 'stroke': 'black',
              // 'fill': 'yellow',
              'd': 'M 0 0 0 0 0 0 Z',//六点三坐标，三点围成三角箭头
            }
          }
        });
        linkToNext.source(rect, {
          anchor: {
            name: 'right',
            rotate: true

          },
          connectionPoint: {
            name: 'boundary',
            args: {
              offset: 4
            }
          }

        });
        linkToNext.vertices([
          // new g.Point(data['x']+this.boxWidth,data['y']+0.5*this.boxHeight),
          //连线标签顶到头，有bug，左移一个px
          new g.Point(data['x'] + this.boxWidth + this.LineWidth * 2, data['y'] + 0.5 * this.boxHeight),//+1防止尾差计算错位
          new g.Point(data['x'] + this.disX - 10, top + 0.5 * this.avaHeight + this.minTop)
        ]);
        linkToNext.connector('rounded');//圆润
        this.completeTree(data[this.children][i], linkToNext, x + this.disX, top);
      }
    }
  }


}

