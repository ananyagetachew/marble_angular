import { TestBed } from '@angular/core/testing';

import { ProformaOrderService } from './proforma-order.service';

describe('ProformaOrderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProformaOrderService = TestBed.get(ProformaOrderService);
    expect(service).toBeTruthy();
  });
});
