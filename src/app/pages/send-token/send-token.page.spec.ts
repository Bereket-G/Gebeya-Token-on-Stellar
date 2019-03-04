import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendTokenPage } from './send-token.page';

describe('SendTokenPage', () => {
  let component: SendTokenPage;
  let fixture: ComponentFixture<SendTokenPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendTokenPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendTokenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
