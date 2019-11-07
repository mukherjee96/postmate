import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakePostPage } from './make-post.page';

describe('MakePostPage', () => {
  let component: MakePostPage;
  let fixture: ComponentFixture<MakePostPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakePostPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakePostPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
