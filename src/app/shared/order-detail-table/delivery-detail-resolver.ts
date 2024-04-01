import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { DeliveryOrderService } from 'src/app/services/delivery-order.service';
import { Injectable } from '@angular/core';

@Injectable()
export class DeliveryDetailResolver implements Resolve<Observable<any>> {

    constructor(
        private deliveryService: DeliveryOrderService
    ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        return this.deliveryService.getDeliveryOrderDetail(Number(route.paramMap.get('id')));
    }

}
