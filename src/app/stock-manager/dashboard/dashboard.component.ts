import { Component, OnInit } from '@angular/core';
import { StockService } from 'src/app/services/stock.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  products;
  deliveryNos;

  // for aggregate status of all stocks in database
  aggregatedStockStatus;

  constructor(
    private stockService: StockService,
    private message: NzMessageService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.stockService
      .getProducts()
      .subscribe(products => (this.products = products));
    this.stockService
      .getDeliveryNos()
      .subscribe(deliveryNos => (this.deliveryNos = deliveryNos));
    this.stockService
      .getAggregateStockStatus()
      .subscribe(aggregatedStockStatus => (this.aggregatedStockStatus = aggregatedStockStatus));
  }

  notifySuccess(id) {
    this.message.remove(id);
    this.message.create('success', 'Stock Updated!');
  }

  addProductToStock(deliveryNo, productID, length, width, thick, pcs) {
    this.stockService
      .addStock(deliveryNo, productID, length, width, thick, pcs)
      .subscribe(id => {
        if (id) {
          this.notifySuccess(id);
          this.router.navigateByUrl('/stockmanager/stock');
        }
      });
  }
}
