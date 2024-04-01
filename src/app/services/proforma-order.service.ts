import { Injectable } from '@angular/core';
import { FinalConstants } from './final-constants';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ProformaOrder } from '../models/proforma-order';

@Injectable({
  providedIn: 'root'
})
export class ProformaOrderService {
  constructor(private httpClient: HttpClient) { }

  submitImportedExcel(fullObj: any): Observable<any> {
    return this.httpClient
      .post<any>(FinalConstants.API_URL + '/sales/proforma', fullObj)
      .pipe(catchError(this.handleError<any>('error in excel data')));
  }

  submitManuallyCreatedProforma(fullObj: any): Observable<any> {
    return this.httpClient.post<any>(
      FinalConstants.API_URL + '/sales/proforma/manual',
      fullObj
    );
  }

  getProformas({ page = '' }): Observable<ProformaOrder[]> {
    return this.httpClient.get<ProformaOrder[]>(
      `${FinalConstants.API_URL}/sales/proformas?page=${page}`
    );
  }

  getProformaOrderDetail(id: number): Observable<Object> {
    return this.httpClient.get<Object>(
      FinalConstants.API_URL + '/sales/proforma/detail/' + id
    );
  }

  persistEditedData(id: number, fullObj: any): Observable<any> {
    return this.httpClient
      .patch<any>(
        FinalConstants.API_URL + '/sales/proforma/persist/' + id,
        fullObj
      )
      .pipe(catchError(this.handleError('persisting', [])));
  }

  addNewPackage(order_id, product_id, bullnose, groove, unit_price): Observable<any> {
    const newPackage = {
      product_id: product_id,
      bullnose: bullnose,
      groove: groove,
      unit_price: unit_price
    };
    return this.httpClient.post<any>(
      FinalConstants.API_URL + '/sales/proforma/package/' + order_id,
      newPackage
    );
  }

  addNewItems(newItems: any): Observable<any> {
    return this.httpClient
      .post<any>(FinalConstants.API_URL + '/sales/proforma/items', { newItems })
      .pipe(tap(_ => console.log('DB: items added')));
  }

  convertToDeliveryOrder(
    id: number,
    delivery_date_count: number
  ): Observable<any> {
    return this.httpClient.get<any>(
      FinalConstants.API_URL +
      '/sales/proforma/to-delivery/' +
      id +
      '?delivery_date_count=' +
      delivery_date_count
    );
  }

  searchProformas({ searchQuery = '', page = '' }): Observable<any> {
    return this.httpClient
      .get<any>(
        `${FinalConstants.API_URL}/proforma/search/${searchQuery}?page=${page}`
      )
      .pipe(catchError(this.handleError<any>('searching')));
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation: string, result?: T) {
    return (error: any): Observable<T> => {
      alert('System Error!');
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
