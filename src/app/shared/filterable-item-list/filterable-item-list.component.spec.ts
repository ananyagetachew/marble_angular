import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterableItemListComponent } from './filterable-item-list.component';

describe('FilterableItemListComponent', () => {
  let component: FilterableItemListComponent;
  let fixture: ComponentFixture<FilterableItemListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterableItemListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterableItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
