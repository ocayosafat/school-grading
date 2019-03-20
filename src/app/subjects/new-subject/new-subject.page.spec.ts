import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSubjectPage } from './new-subject.page';

describe('NewSubjectPage', () => {
  let component: NewSubjectPage;
  let fixture: ComponentFixture<NewSubjectPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSubjectPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSubjectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
