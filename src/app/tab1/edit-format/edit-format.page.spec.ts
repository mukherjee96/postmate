import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFormatPage } from './edit-format.page';

describe('EditFormatPage', () => {
  let component: EditFormatPage;
  let fixture: ComponentFixture<EditFormatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFormatPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFormatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
