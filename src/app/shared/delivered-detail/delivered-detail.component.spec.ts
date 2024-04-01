import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveredDetailComponent } from './delivered-detail.component';

describe('DeliveredDetailComponent', () => {
  let component: DeliveredDetailComponent;
  let fixture: ComponentFixture<DeliveredDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveredDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveredDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
