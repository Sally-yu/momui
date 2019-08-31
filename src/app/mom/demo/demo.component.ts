import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpService} from './service/http.service';
import {NzMessageService} from 'ng-zorro-antd';
import {SmarthelpComponent} from '../../share/smarthelp/smarthelp.component';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.less']
})
export class DemoComponent implements OnInit {
  visible:boolean;

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
    this.visible=false;
    this.message.success(JSON.stringify(data));
    console.log(data)
  }

  query(data: any) {
    console.log(data)
  }
}
