import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMarkPage } from './edit-mark.page';

describe('EditMarkPage', () => {
  let component: EditMarkPage;
  let fixture: ComponentFixture<EditMarkPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMarkPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMarkPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
