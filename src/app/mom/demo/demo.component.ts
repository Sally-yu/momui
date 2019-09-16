import {AfterViewInit, Component, OnInit} from '@angular/core';
import {HttpService} from './service/http.service';
import {NzMessageService} from 'ng-zorro-antd';
import j from 'src/assets/tables/meta/meta.json';

declare var $: any;

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.less']
})
export class DemoComponent implements OnInit, AfterViewInit {
  visible: boolean;

  tree = {
    text: '零部件测量', pre: 1, children: [
      {
        text: '零部件测量', pre: 2,
        children: [
          {
            text: '零部件测量', pre: 4
          },
          {
            text: '零部件测量', pre: 4
          }]
      }, {
        text: '零部件测量', children: [
          {
            text: '零部件测量', pre: 4
          }, {
            text: '零部件测量', pre: 4
          }, {
            text: '零部件测量',
            selected: true,
          }, {
            text: '零部件测量', children: [
              {
                text: '零部件测量', pre: 9
              }, {
                text: '零部件测量', pre: 10, children: [
                  {
                    text: '零部件测量'
                  }, {
                    text: '零部件测量',
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        text: '零部件测量',
      }, {
        text: '零部件测量', children: [
          {
            text: '零部件测量'
          }, {
            text: '零部件测量'
          }
        ]
      },
    ]
  };

  data = [
    {text: '零部件测量', pre: 1},
    {text: '零部件测量', pre: 2, selected: true},
    {text: '零部件测量', pre: 3},
    {text: '零部件测量', pre: 4},
    {text: '零部件测量', pre: 5},
    {text: '零部件测量', pre: 6},
    {text: '零部件测量', pre: 7},
    {text: '零部件测量', pre: 8},
    {text: '零部件测量', pre: 9},
  ];

  columns = j;

  constructor(
    public http: HttpService,
    private message: NzMessageService,
  ) {
  }

  ngOnInit() {
  }

  get() {
    this.http.get().subscribe(res => {
      this.message.success('get方法成功', res);
    }, err => {
      this.message.error('get方法失败，原因：', err);
    });
  }

  post() {
    this.http.post().subscribe(res => {
      this.message.success('post方法成功', res);
    }, err => {
      this.message.error('post方法失败，原因：', err);
    });
  }

  query(data: any) {
    console.log(data);
  }

  showNode(data: any) {
    this.message.success(JSON.stringify(data));
    console.log(data);
  }

  afterHelp(data: any) {
    this.message.success(JSON.stringify(data));
  }

  ngAfterViewInit(): void {

  }
}
