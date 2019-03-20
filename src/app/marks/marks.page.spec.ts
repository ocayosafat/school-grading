import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarksPage } from './marks.page';

describe('MarksPage', () => {
  let component: MarksPage;
  let fixture: ComponentFixture<MarksPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarksPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
