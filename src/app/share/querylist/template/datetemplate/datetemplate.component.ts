import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-datetemplate',
  templateUrl: './datetemplate.component.html',
  styleUrls: ['./datetemplate.component.less']
})
export class DatetemplateComponent implements OnInit {

  constructor() { }
  @Input() public item: any;
  @Input() public hidden: boolean;
  ngOnInit() {
  }

}
