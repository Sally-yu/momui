import {Component, OnInit} from '@angular/core';
import {HttpService} from './service/http.service';

@Component({
  selector: 'app-mobd',
  templateUrl: './mobd.component.html',
  styleUrls: ['./mobd.component.less']
})
export class MOBDComponent implements OnInit {

  visible: boolean;

  data = [];
  column = [
    {code: 'number', name: '序号'},
    {code: 'code', name: '编号'},
    {code: 'name', name: '名称'},
  ];
  text: string;

  constructor(
    private http: HttpService,
  ) {

  }

  //生命周期 初始化
  ngOnInit() {
    this.http.grid().subscribe(res => {
      this.data = JSON.parse(JSON.stringify(res));
    }, err => {

    });
  }


  afterHelp(data : any) {
    this.visible=false;
    this.text=data['name']
  }
}
