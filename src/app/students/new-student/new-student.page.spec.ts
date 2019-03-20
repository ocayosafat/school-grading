import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewStudentPage } from './new-student.page';

describe('NewStudentPage', () => {
  let component: NewStudentPage;
  let fixture: ComponentFixture<NewStudentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewStudentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewStudentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
