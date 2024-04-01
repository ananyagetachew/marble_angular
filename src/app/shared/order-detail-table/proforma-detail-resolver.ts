import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ProformaOrderService } from 'src/app/services/proforma-order.service';

@Injectable()
export class ProformaDetailResolver {

    constructor(
        private proformaService: ProformaOrderService
    ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        return this.proformaService.getProformaOrderDetail(Number(route.paramMap.get('id')));
    }

}
