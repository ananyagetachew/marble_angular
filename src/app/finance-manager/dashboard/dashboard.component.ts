import { Component, OnInit } from '@angular/core';
import { DeliveryOrderService } from '../../services/delivery-order.service';
import { ProductionService } from '../../services/production.service';
import { ExcelService } from '../../services/excel.service';
import { Router } from '@angular/router';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  reportTypes = ['delivered_orders', 'delivery_orders', 'production_orders', 'stocks'];
  reportTypesProperName = ['Delivered Orders', 'Delivery Orders', 'Production Orders', 'Stocks'];
  currentReportType = this.reportTypes[0];
  dateRange = [];

  // for aggregate status of all stocks in database
  aggregatedOrderData;
  totalPrice = 0;

  deliveryNosDropDown = '';
  deliveryNos: any;

  isLoading = true;
  currentDate = new Date();

  constructor(
    private deliveryService: DeliveryOrderService,
    private productionService: ProductionService,
    private excelService: ExcelService,
    private stockService: StockService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.updateOrderData();
    this.stockService
      .getDeliveryNos()
      .subscribe(deliveryNos => {
        this.deliveryNos = deliveryNos;
        this.isLoading = false;
      });
  }

  updateOrderData(company_name = null) {
    // clear old data
    this.aggregatedOrderData = null;
    this.isLoading = true;
    let loadingFunction;

    const dataFilter = {
      company_name,
      delivery_no: this.deliveryNosDropDown,
      from: this.dateRange[0],
      to: this.dateRange[1]
    }

    if (this.currentReportType === 'delivery_orders') {
      loadingFunction = this.deliveryService.getAggregateDeliveryStatus(dataFilter);
    } else if (this.currentReportType === 'production_orders') {
      loadingFunction = this.productionService.getAggregateProductionStatus(dataFilter);
    } else if (this.currentReportType === 'delivered_orders') {
      loadingFunction = this.productionService.getAggregateDeliveredStatus(dataFilter);
    }

    if (!loadingFunction) {
      return;
    }

    loadingFunction.subscribe(aggregatedOrderData => {
      this.aggregatedOrderData = aggregatedOrderData;
      this.isLoading = false;
      this.totalPrice = Object.values(aggregatedOrderData).reduce((total, { price }) => {
        return total + price;
      }, 0);
    });
  }

  exportAsXLSX(exportData = []): void {
    const exportableData = [];
    // convert object into an exportable format(a.k.a array)
    Object.keys(exportData).forEach(key => {
      exportableData.push({
        delivery_no: key,
        total_price: exportData[key].price
      });
    });

    const headerInfo = [{
      Date: new Date().toLocaleDateString(),
      'Data Type': `${this.reportTypesProperName[this.reportTypes.indexOf(this.currentReportType)]} Data`,
      'Filter Date From': `from ${this.dateRange[0] || '-'}`,
      'Filter Date To': `to ${this.dateRange[1] || '-'}`,
      // add a filler prop for proper spacing
      ' ': ' '
    }];

    this.excelService.exportAsExcelFile(exportableData, 'financial-report', headerInfo);
  }

  onRowClick(orderId) {
    switch (this.currentReportType) {
      case this.reportTypes[0]:
        this.router.navigateByUrl(`/financemanager/delivered/${orderId}`);
        break;
      case this.reportTypes[1]:
        this.router.navigateByUrl(`/financemanager/delivery/${orderId}`);
        break;
      default:
        return;
    }
  }
}
