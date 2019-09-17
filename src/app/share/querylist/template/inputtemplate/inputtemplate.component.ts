import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-inputtemplate',
  templateUrl: './inputtemplate.component.html',
  styleUrls: ['./inputtemplate.component.less']
})
export class InputTemplateComponent implements OnInit {

  constructor() { }
  @Input() public item: any;
  @Input() public hidden: boolean;
  @Input() span:number=6;

  ngOnInit() {

  }
}
