import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Rewards2Component } from './rewards2.component';

describe('Rewards2Component', () => {
  let component: Rewards2Component;
  let fixture: ComponentFixture<Rewards2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Rewards2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Rewards2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
