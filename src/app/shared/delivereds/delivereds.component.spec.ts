import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveredsComponent } from './delivereds.component';

describe('DeliveredsComponent', () => {
  let component: DeliveredsComponent;
  let fixture: ComponentFixture<DeliveredsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveredsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveredsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
