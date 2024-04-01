import { TestBed } from '@angular/core/testing';

import { DeliveryOrderService } from './delivery-order.service';

describe('DeliveryOrderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeliveryOrderService = TestBed.get(DeliveryOrderService);
    expect(service).toBeTruthy();
  });
});
