import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockAggregateComponent } from './stock-aggregate.component';

describe('StockReportComponent', () => {
  let component: StockAggregateComponent;
  let fixture: ComponentFixture<StockAggregateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockAggregateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockAggregateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
