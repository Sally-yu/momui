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
import {ResizeSensor} from 'css-element-queries';

declare var joint: any;
declare var $: any;
declare var g: any;

@Component({
  selector: 'flowchart',
  templateUrl: './flowchart.component.html',
  styleUrls: ['./flowchart.component.less']
})

export class FlowchartComponent implements OnInit, AfterViewInit, OnChanges {

  @ViewChild('jointdiv', {static: false}) joint: ElementRef;

  @Output() blockClick: EventEmitter<any> = new EventEmitter<any>();//点选弹出事件
  @Output() selected: any;//选中节点

  @Input() Width: number | string = '100%'; // 宽度
  @Input() Height: number | string = '100%'; // 高度
  @Input() DataSource: Array<any> = [];// 默认数据源
  @Input() TreeData: any;//树形数据源
  @Input() BackgroundColor: string;//整体背景颜色
  @Input() BackgroundImg: string;//背景图
  @Input() BodyColor: string = 'rgb(227,245,254)'; //块背景颜色
  @Input() TextColor: string = 'rgba(0,0,0,.85)'; // 文字颜色
  @Input() HighLightColor: string = 'rgb(250,158,59)';//高亮块
  @Input() HighLightTextColor: string = '#ffffff';//高亮块
  @Input() StrokeColor: string="rgb(108,186,255)"; //边框颜色
  @Input() LineColor: string = 'rgb(188,205,206)';//连线颜色
  @Input() LineWidth: number = 1;//连线宽度
  @Input() children: string = 'children';//子级标识字段

  @Input() col: number = 0; //列数，默认自动计算
  @Input() distance: number = 40;//列最小间距，

  @Input() boxWidth: number = 120;
  @Input() boxHeight: number = 40;
  @Input() radius: number = 20;

  @Input() text: string = 'text';//标签绑定的字段名
  @Input() highLightKey: string = 'selected'; //选中标记符，字段值boolean
  @Input() markSize: number = 2;//连线箭头大小

  scale: number = 1;//整体缩放
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
      el: $('#jointdiv'),
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
    this.paper.on('blank:pointerdown', function(evt, x, y) {
      let elements = self.paper.model.getElements();
      elements.forEach(e => {
        //内部节点不变色
          e.attr('body/fill', self.BodyColor);
          e.attr('body/stroke', self.StrokeColor);
          e.attr('label/fill', self.TextColor);
      });
      if (self.DataSource.length > 0) {
        self.DataSource.forEach(d => {
          d[self.highLightKey] = false;
        });
      } else if (self.TreeData) {
        f(self.TreeData);
      }

      function f(data) {
        data[self.highLightKey] = false;
        if (data.hasOwnProperty(self.children) && data[self.children].length > 0) {
          f(data[self.children]);
        }
      }
    });
    this.paper.on('cell:pointerclick', function(elementView) {
      let currentElement = elementView.model;
      if (currentElement.attributes.type=="standard.Link"){
        return;
      }
      let elements = self.paper.model.getElements();
      elements.forEach(e => {
        //内部节点不变色
        // if (e.attributes.attrs.body.class != 'sub') {
          e.attr('body/fill', self.BodyColor);
          e.attr('body/stroke', self.StrokeColor);
          e.attr('label/fill', self.TextColor);
        // } else {
        //   e.attr('label/fill', '#101010');
        // }
      });
      //内部圆圈点击 父块响应
      // if (currentElement.attributes.parent) {
      //   currentElement.attr('label/fill', self.HighLightColor);
      //   let id = currentElement.attributes.parent;
      //   currentElement = elements.filter(e => e.id == id)[0];
      // }
      //父块点击 子块也响应
      // else if (currentElement.attributes.embeds[0]) {
      //   let id = currentElement.attributes.embeds[0];
      //   elements.filter(e => e.id == id)[0].attr('label/fill', self.HighLightColor);
      // }

      let x = currentElement.attributes.position.x;
      let y = currentElement.attributes.position.y;

      if (self.DataSource.length > 0) {
        self.selected = self.DataSource.filter(d => d['x'] == x && d['y'] == y)[0];
        self.DataSource.forEach(d => {
          d[self.highLightKey] = d == self.selected;
        });
      } else if (self.TreeData) {
        self.searchTreeNode(self.TreeData, x, y);
      }
      currentElement.attr('body/fill', self.HighLightColor);
      currentElement.attr('body/stroke', self.HighLightColor);
      currentElement.attr('label/fill', self.HighLightTextColor);
      self.blockClick.emit(self.selected);
    });
  }

  //点选事件遍历树子节点
  searchTreeNode(data, x, y) {
    if (data['x'] == x && data['y'] == y) {
      this.selected = data;
      data[this.highLightKey] = true;
      return;
    } else {
      data[this.highLightKey] = false;
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
    //FIXME:重新设置高度，工具栏高40 常会引起初始滚动位置偏移
    this.avaHeight = this.joint.nativeElement.offsetHeight - 40;
    this.paper.setDimensions(this.Width, this.avaHeight);
    if (this.DataSource.length > 0) {
      let col = this.col ? this.col : Math.floor(width / (0.5 * this.boxWidth + this.distance) / 2);
      let len = this.DataSource.length;
      let row: number;

      //总行数
      row = Math.ceil(len / col);
      //纵向行间距
      this.disY = this.avaHeight / (2 * row);
      //横向距离
      this.disX = (width - 2 * this.disY) / (2 * col);

      let left = this.disX + this.disY;
      let top = this.disY;
      let fromLeft = true;
      let link;
      for (let i = 0; i < this.DataSource.length; i++) {
        let edge = false;
        if (i == 0) {
          //首块不换行，单倍间距起
        } else {
          //已换行块，x不动，y下移
          if (i % col == 0) {
            top += 2 * this.disY;
            fromLeft = !fromLeft;
            edge = true;
          }
          //同行块，按方向判断增减
          else {
            if (fromLeft) {
              left += 2 * this.disX;
            } else {
              left -= 2 * this.disX;
            }
          }
        }
        //块坐标点是左上角
        this.DataSource[i]['x'] = left - 0.5 * this.boxWidth;
        this.DataSource[i]['y'] = top - 0.5 * this.boxHeight;

        const rect = new joint.shapes.standard.Rectangle();
        rect.position(this.DataSource[i]['x'], this.DataSource[i]['y']);
        rect.resize(this.boxWidth, this.boxHeight);
        rect.attr({
          body: {
            cursor: 'pointer',
            fill: this.DataSource[i][this.highLightKey] ? this.HighLightColor : this.BodyColor,
            stroke: this.DataSource[i][this.highLightKey] ? this.HighLightTextColor : this.StrokeColor,
            // rx: 2,
            // ry: 2,
            strokeWidth: 1
          },
          label: {
            cursor: 'pointer',
            text: 'OP'+(this.DataSource[i]['pre']?this.DataSource[i]['pre']:i.toString())+':'+this.DataSource[i][this.text],
            fill: this.DataSource[i][this.highLightKey] ? this.HighLightTextColor : this.TextColor,
            // 'ref-x': (this.boxHeight) / 3
          }
        });

        //圆圈子块
        // let subRect = new joint.shapes.standard.Rectangle();
        // subRect.position(this.DataSource[i]['x'] + 4, this.DataSource[i]['y'] + 4);
        // subRect.resize(this.boxHeight - 8, this.boxHeight - 8);
        // subRect.attr({
        //   body: {
        //     cursor: 'pointer',
        //     fill: '#ffffff00',
        //     // rx: this.radius - 4,
        //     // ry: this.radius - 4,
        //     strokeWidth: 0,
        //     class: 'sub'
        //   },
        //   label: {
        //     cursor: 'pointer',
        //     text: this.DataSource[i]['pre'] ? this.DataSource[i]['pre'] : i.toString(),
        //     fill: this.DataSource[i][this.highLightKey] ? this.HighLightColor : '#101010'
        //   },
        // });
        //
        this.model.addCells([rect]);
        // // 作为子块
        // rect.embed(subRect);
        // 循环连接
        link = this.link(rect, link, edge, fromLeft);
      }
    }
    //树结构标识符
    else if (this.TreeData) {
      this.col = 0;//缩放时初始化
      this.row = 0;
      this.xs = [];
      this.ys = [];

      // this.checkChildren(this.TreeData);
      this.forTree(this.TreeData, 0, 0);
      this.col = [...new Set(this.xs)].length;
      this.row = [...new Set(this.ys)].length + 2;

      this.disX = width / (this.col + 1);//横向距离
      this.disY = this.avaHeight / (this.row + 1);//纵向行间距
      this.completeTree(this.TreeData, null, this.disX, 0);
    }
  }

  //顺序结构连线
  //顺序相连，添加连接线
  link(rect: any, link: any, edge: boolean, fromLeft: boolean): any {
    if (link) {
      link.target(rect, {
        connectionPoint: {
          //连接点边距
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
          //FIXME:硬核圆弧连接线
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
          //FIXME:硬核圆弧连接线
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
        //连线中箭头形label
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
            //三点坐标
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
        //连接线结束端箭头隐藏
        targetMarker: {
          type: 'path',
          d: 'M 0 0 0 0 0 0 Z',
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


  //树结构排布，连线
  //检索广度深度，存全局变量，先排布引导树
  checkChildren(data: any) {
    if (data.hasOwnProperty(this.children) && data[this.children].length > 0) {
      this.col += 1;
      data[this.children].forEach(d => {
        this.checkChildren(d);
      });
      // FIXME:偶数子节点情况，行数计算
      // if (displayData[this.children].length % 2 == 0) {
      //   this.row -= 1;
      // }
      if (data[this.children].length > 1) {
        this.row += 2 * data[this.children].length - 2;
      }
    } else if (!data.hasOwnProperty(this.children)) {
      this.row += 1;
    }
  }

  //循环计算引导树节点位置，用于获取准确的行列数
  forTree(data: any, x: number, y: number) {
    if (data.hasOwnProperty(this.children) && data[this.children].length > 0) {
      let len = data[this.children].length;
      if (len > 1) {
        if (y < 0) {
          y -= (len - 1) * 5;
        } else if (y > 0) {
          y += (len - 1) * 5;
        }
      }
    }
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
          top = y - Math.ceil(middle - i) * 5;
        } else if (i == middle) {
          top = y;
        } else if (i > middle) {
          top = Math.ceil(i - middle) * 5 + y;
        }
        this.forTree(data[this.children][i], x + 5, top);
      }
    }
  }

  //最终排列树
  completeTree(data: any, link: any, x: number, y: number) {
    if (data.hasOwnProperty(this.children) && data[this.children].length > 0) {
      let len = data[this.children].length;
      if (len > 2) {
        if (y < 0) {
          y -= (len - 1) * (this.disY + 0.5 * this.boxHeight);
        } else if (y > 0) {
          y += (len - 1) * (this.disY + 0.5 * this.boxHeight);
        }
      }
    }
    data['x'] = x - 0.5 * this.boxWidth;
    data['y'] = y - 0.5 * this.boxHeight;
    data['y'] -= this.minTop / 5 * this.disY - this.boxHeight - this.disY;//整体偏移至顶节点位置合适

    //根据data绘制方块
    const rect = new joint.shapes.standard.Rectangle();
    rect.position(data['x'], data['y']);
    rect.resize(this.boxWidth, this.boxHeight);
    rect.attr({
      body: {
        cursor: 'pointer',
        fill: data[this.highLightKey] ? this.HighLightColor : this.BodyColor,
        stroke: data[this.highLightKey] ? this.HighLightColor : this.StrokeColor,
        // rx: 2,
        // ry: 2,
        strokeWidth: 1
      },
      label: {
        cursor: 'pointer',
        text: (data['pre']?'OP'+data['pre']+':':'')+data[this.text],
        fill: data[this.highLightKey] ? this.HighLightTextColor : this.TextColor,
        // 'ref-x': this.boxHeight / 3
      },
    });

    // let subRect = new joint.shapes.standard.Rectangle();
    // subRect.position(displayData['x'] + 4, displayData['y'] + 4);
    // subRect.resize(this.boxHeight - 8, this.boxHeight - 8);
    // subRect.attr({
    //   body: {
    //     cursor: 'pointer',
    //     fill: '#ffffff',
    //     rx: this.radius - 4,  // 默认椭圆格子
    //     ry: this.radius - 4,
    //     strokeWidth: 0,
    //     class: 'sub'
    //   },
    //   label: {
    //     cursor: 'pointer',
    //     text: displayData['pre'] ? displayData['pre'] : '',
    //     fill: displayData[this.highLightKey] ? this.HighLightColor : '#101010'
    //   },
    // });

    // rect.addTo(this.model);
    this.model.addCells([rect]);
    // rect.embed(subRect);
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
      // link.appendLabel({
      //   markup: [
      //     {
      //       tagName: 'path',
      //       selector: 'body'
      //     }
      //     , {
      //       tagName: 'text',
      //       selector: 'label'
      //     }
      //   ],
      //   attrs: {
      //     label: {
      //       text: ' ',
      //     },
      //     body: {
      //       ref: 'label',
      //       fill: this.BodyColor,
      //       stroke: this.LineColor,
      //       strokeWidth: this.LineWidth,
      //       refR: 2,
      //       refCx: 0,
      //       refCy: 0,
      //     },
      //   },
      //   position: {
      //     distance: 1
      //   }
      // });
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
            //连接线箭头隐藏
            targetMarker: {
              type: 'path',
              d: 'M 0 0 0 0 0 0 Z'
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
        // 指定左近右出，不必指定路径点
        // linkToNext.vertices([
        //   new g.Point(displayData['x'] + this.boxWidth + this.LineWidth * 2, displayData['y'] + 0.5 * this.boxHeight),
        //   new g.Point(displayData['x'] + this.disX - 10, top + 0.5 * this.avaHeight + this.minTop)
        // ]);
        linkToNext.connector('rounded');//圆润
        this.completeTree(data[this.children][i], linkToNext, x + this.disX, top);
      }
    }
  }

  zoomIn() {
    this.scale += 0.2;
    this.paper.scale(this.scale, this.scale);
  }

  zoomOut() {
    this.scale -= 0.2;
    this.paper.scale(this.scale, this.scale);
  }

  scaleToFit() {
    this.paper.scaleContentToFit({
      padding: this.disY
    });
  }

  isNumber(x): boolean {
    return typeof x == 'number';
  }
}

