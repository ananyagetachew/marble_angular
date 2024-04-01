import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { DeliveryOrder } from '../models/delivery-order';
import { FinalConstants } from './final-constants';

@Injectable({
  providedIn: 'root'
})
export class DeliveryOrderService {
  constructor(private httpClient: HttpClient) {
  }

  submitImportedExcel(fullObj: any): Observable<any> {
    return this.httpClient.post<any>(
      FinalConstants.API_URL + '/sales/delivery',
      fullObj
    );
  }

  submitManuallyCreatedDelivery(fullObj: any): Observable<any> {
    return this.httpClient.post<any>(
      FinalConstants.API_URL + '/sales/delivery/manual',
      fullObj
    );
  }

  getDeliveryOrderDetail(id: number): Observable<Object> {
    return this.httpClient.get<Object>(
      FinalConstants.API_URL + '/sales/delivery/detail/' + id
    );
  }

  getDeliveries({ page = '' }): Observable<DeliveryOrder[]> {
    return this.httpClient.get<DeliveryOrder[]>(
      `${FinalConstants.API_URL}/sales/deliveries?page=${page || ''}`
    );
  }

  persistEditedData(id: number, fullObj: any): Observable<any> {
    return this.httpClient.patch<any>(
      FinalConstants.API_URL + '/sales/delivery/persist/' + id,
      fullObj
    );
  }

  addNewPackage(order_id, product_id, bullnose, groove, unit_price): Observable<any> {
    const newPackage = {
      product_id: product_id,
      bullnose: bullnose,
      groove: groove,
      unit_price: unit_price
    };
    return this.httpClient.post<any>(
      FinalConstants.API_URL + '/sales/delivery/package/' + order_id,
      newPackage
    );
  }

  addNewItems(newItems: any): Observable<any> {
    return this.httpClient
      .post<any>(FinalConstants.API_URL + '/sales/delivery/items', { newItems })
      .pipe(tap(_ => console.log('DB: items added')));
  }

  sendSelectedToProduction(fullObj: any): Observable<any> {
    return this.httpClient
      .post<any>(
        FinalConstants.API_URL + '/sales/delivery/send-selected-to-production',
        fullObj
      )
      .pipe(catchError(this.handleError<any>('selected to production')));
  }

  confirmSelectedDelivered(fullObj: any): Observable<any> {
    return this.httpClient
      .post<any>(
        FinalConstants.API_URL +
        '/factoryloader/delivered/confirm-selected-delivered',
        fullObj
      )
      .pipe(catchError(this.handleError<any>('selected to production')));
  }

  sendAllToProduction(id: number): Observable<any> {
    return this.httpClient
      .post<any>(
        FinalConstants.API_URL + '/sales/delivery/send-to-production/' + id,
        null
      )
      .pipe(catchError(this.handleError<any>('sendToProduction')));
  }

  searchDeliveries({ searchQuery = '', page = '' }): Observable<any> {
    return this.httpClient
      .get<any>(
        `${FinalConstants.API_URL}/delivery/search/${searchQuery}?page=${page}`
      )
      .pipe(catchError(this.handleError<any>('searching')));
  }

  getDeliveriesReport({ report_table, company_name, from, to }) {
    return this.httpClient.get<Object>(
      `${FinalConstants.API_URL}/report/${report_table}?company_name=${company_name}&from=${from}&to=${to}`
    );
  }

  getAggregateDeliveryStatus({ company_name, delivery_no, from, to }): Observable<any> {
    return this.httpClient.get<any>(
      `${FinalConstants.API_URL}/financemanager/aggregate/delivery_orders?company_name=${company_name}&delivery_no=${delivery_no}&from=${from}&to=${to}`
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation: string, result?: T) {
    return (error: any): Observable<T> => {
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
