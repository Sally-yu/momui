import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-selecttemplate',
  templateUrl: './selecttemplate.component.html',
  styleUrls: ['./selecttemplate.component.less']
})
export class SelectTemplateComponent implements OnInit {

  @Input() public item: any;
  @Input() public hidden: boolean;
  @Input() public data: Array<{ value: string, label: string }>;

  constructor() {
  }

  ngOnInit() {
  }
}
