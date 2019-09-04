import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-demohelp',
  templateUrl: './demohelp.component.html',
  styleUrls: ['./demohelp.component.less']
})
export class DemohelpComponent implements OnInit {
  visible: boolean;
  item: any;

  @Output() result: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit() {
  }

  //帮助返回，推出返回值
  afterHelp(data: any) {
    this.item = data;
    this.visible = false;
    if (this.item){
      this.result.emit(this.result);
    } else{
      this.result.emit(false);
    }
  }

  openHelp() {
    this.visible = true;
  }
}
