import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoryOrderDetailComponent } from './factory-order-detail.component';

describe('FactoryOrderDetailComponent', () => {
  let component: FactoryOrderDetailComponent;
  let fixture: ComponentFixture<FactoryOrderDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FactoryOrderDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FactoryOrderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
