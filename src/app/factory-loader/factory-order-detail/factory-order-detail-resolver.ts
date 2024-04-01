import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { ProductionService } from 'src/app/services/production.service';

@Injectable()
export class FactoryLoaderDetailResolver implements Resolve<Observable<any>> {

    constructor(
        private productionService: ProductionService
    ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        return this.productionService.getProductionForFactoryLoader(Number(route.paramMap.get('id')));
    }
}
