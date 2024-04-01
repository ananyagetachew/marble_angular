import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FinalConstants } from './final-constants';

@Injectable({
  providedIn: 'root'
})
export class ProductionService {
  constructor(private httpClient: HttpClient) {
  }

  getProductions({ page = '' }): Observable<any> {
    return this.httpClient.get<any>(
      `${FinalConstants.API_URL}/sales/productions?page=${page}`
    );
  }

  filter(filterObject, filterable_table): Observable<any> {
    const serializedFilterObject = Object.entries(filterObject).map(([key, val]) => `${key}=${val}`).join('&');
    return this.httpClient.get<any>(
      `${FinalConstants.API_URL}/filter/${filterable_table}?${serializedFilterObject}`
    );
  }

  getDeliveredOrders({ page = '' }): Observable<any> {
    return this.httpClient.get<any>(
      `${FinalConstants.API_URL}/factoryloader/delivered-orders?page=${page}`
    );
  }

  getProduction(id: number): Observable<any> {
    return this.httpClient.get<any>(
      FinalConstants.API_URL + '/sales/production/' + id
    );
  }

  getProductionsForFactoryLoader(): Observable<any> {
    return this.httpClient.get<any>(
      FinalConstants.API_URL + '/factoryloader/productions'
    );
  }

  getProductionForFactoryLoader(id: number): Observable<any> {
    return this.httpClient.get<any>(
      FinalConstants.API_URL + '/factoryloader/production/' + id
    );
  }

  getDeliveredDetail(id: number): Observable<any> {
    return this.httpClient.get<any>(
      FinalConstants.API_URL + '/factoryloader/delivered/' + id
    );
  }

  getAggregateProductionStatus({ company_name, delivery_no, from, to }): Observable<any> {
    return this.prepareAggregateRequest(`/financemanager/aggregate/production_orders?company_name=${company_name}&delivery_no=${delivery_no}&from=${from}&to=${to}`);
  }

  getAggregateDeliveredStatus({ company_name, delivery_no, from, to }): Observable<any> {
    return this.prepareAggregateRequest(`/financemanager/aggregate/delivered_orders?company_name=${company_name}&delivery_no=${delivery_no}&from=${from}&to=${to}`);
  }

  prepareAggregateRequest(endpoint: string): Observable<any> {
    return this.httpClient.get<any>(
      FinalConstants.API_URL + endpoint
    );
  }

}
