import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-rangepickertemplate',
  templateUrl: './rangepickertemplate.component.html',
  styleUrls: ['./rangepickertemplate.component.less']
})
export class RangepickerTemplateComponent implements OnInit {

  constructor() { }
  @Input() public item: any;
  @Input() public hidden: boolean;
  @Input() span:number=6;
  ngOnInit() {
  }

}
