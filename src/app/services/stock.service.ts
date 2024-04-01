import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FinalConstants } from './final-constants';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  constructor(private httpClient: HttpClient) {
  }

  getStocks({ page = '' }): Observable<any> {
    return this.httpClient.get<any>(
      `${FinalConstants.API_URL}/stockmanager/stocks?page=${page}`
    );
  }

  searchStocks({ searchQuery = '', page = '' }): Observable<any> {
    return this.httpClient
      .get<any>(
        `${FinalConstants.API_URL}/stockmanager/search/${searchQuery}?page=${page}`
      );
  }

  getStockPrices(stockIds): Observable<any> {
    return this.httpClient
      .post<any>(
        `${FinalConstants.API_URL}/financemanager/stock-prices`,
        { stockIds: stockIds }
      );
  }

  getProducts(): Observable<any> {
    return this.httpClient.get<any>(
      FinalConstants.API_URL + '/stockmanager/products'
    );
  }

  getAggregateStockStatus(): Observable<any> {
    return this.httpClient.get<any>(
      FinalConstants.API_URL + '/financemanager/aggregate-stocks'
    );
  }

  getDeliveryNos(): Observable<any> {
    return this.httpClient.get<any>(
      FinalConstants.API_URL + '/stockmanager/delivery-numbers'
    );
  }

  transferToAnotherStock(deliveryNo, sid): Observable<any> {
    return this.httpClient.post<any>(
      FinalConstants.API_URL + `/stockmanager/transfer/`,
      {
        delivery_no: deliveryNo,
        s_id: sid
      }
    );
  }

  addStock(deliveryNo, productID, length, width, thick, pcs): Observable<any> {
    return this.httpClient.post<any>(
      FinalConstants.API_URL + '/stockmanager/product',
      {
        delivery_no: deliveryNo,
        product_id: productID,
        length: length,
        width: width,
        thick: thick,
        pcs: pcs
      }
    );
  }

  filter(filterObject): Observable<any> {
    const serializedFilterObject = Object.entries(filterObject).map(([key, val]) => `${key}=${val}`).join('&');
    return this.httpClient.get<any>(
      `${FinalConstants.API_URL}/stockmanager/filter?${serializedFilterObject}`
    );
  }

}
