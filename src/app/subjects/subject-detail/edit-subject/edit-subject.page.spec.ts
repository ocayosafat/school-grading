import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSubjectPage } from './edit-subject.page';

describe('EditSubjectPage', () => {
  let component: EditSubjectPage;
  let fixture: ComponentFixture<EditSubjectPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSubjectPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSubjectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
