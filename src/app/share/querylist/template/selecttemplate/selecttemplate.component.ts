import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-selecttemplate',
  templateUrl: './selecttemplate.component.html',
  styleUrls: ['./selecttemplate.component.less']
})
export class SelectTemplateComponent implements OnInit {

  constructor() { }
  @Input() public item: any;
  @Input() public hidden: boolean;
  ngOnInit() {
  }
}
