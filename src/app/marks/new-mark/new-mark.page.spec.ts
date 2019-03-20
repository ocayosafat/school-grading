import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMarkPage } from './new-mark.page';

describe('NewMarkPage', () => {
  let component: NewMarkPage;
  let fixture: ComponentFixture<NewMarkPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewMarkPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewMarkPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
