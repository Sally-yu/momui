import {Component, OnInit} from '@angular/core';
import {HttpService} from './service/http.service';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.less']
})
export class DemoComponent implements OnInit {
  visible: boolean;


  // data = [{text: '1'},
  //   {text: '2'},
  //   {text: '3'},
  //   {text: '4'},
  //   {text: '5'},
  //   {text: '6'},
  //   {text: '7'},
  //   {text: '8'},
  //   {text: '9'},
  //   {text: '10'},
  //   {text: '11'},
  //   {text: '12'},
  //   {text: '13'},
  //   {text: '14'},
  //   {text: '15'},
  //   {text: '16'},
  //   {text: '17'},
  //   {text: '18'},
  //   {text: '18'},
  //   {text: '18'},
  //   {text: '18'},
  //   {text: '18'},
  //   {text: '18'},
  //   {text: '18'},
  //   {text: '18'},];


  tree = {
    text: '零部件测量', pre:1,children: [
      {
        text: '零部件测量',pre:2,
      },  {
        text: '零部件测量', children: [
          {
            text: '零部件测量',pre:4
          }, {
            text: '零部件测量'
          }, {
            text: '零部件测量', children: [
              {
                text: '零部件测量',pre:9
              }, {
                text: '零部件测量',pre:10, children: [
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
      },{
        text: '零部件测量'
      },{
        text: '零部件测量'
      },{
        text: '零部件测量',children:[
          {
            text: '零部件测量'
          },{
            text: '零部件测量'
          },{
            text: '零部件测量'
          },
        ]
      },
    ]
  };

  data = [
    {text:'零部件测量',pre:1},
    {text:'零部件测量',pre:2},
    {text:'零部件测量',pre:3},
    {text:'零部件测量',pre:4},
    {text:'零部件测量',pre:5},
    {text:'零部件测量',pre:6},
    {text:'零部件测量',pre:7},
    {text:'零部件测量',pre:8},
    {text:'零部件测量',pre:9},
  ];

  constructor(
    private http: HttpService,
    private message: NzMessageService
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

  afterHelp(data: any) {
    this.visible = false;
    this.message.success(JSON.stringify(data));
    console.log(data);
  }

  query(data: any) {
    console.log(data);
  }

  showNode(data: any) {
    this.message.success(JSON.stringify(data));
    console.log(data)
  }
}
