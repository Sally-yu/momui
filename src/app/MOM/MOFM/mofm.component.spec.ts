import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MOFMComponent } from './mofm.component';

describe('MOFMComponent', () => {
  let component: MOFMComponent;
  let fixture: ComponentFixture<MOFMComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MOFMComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MOFMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
