import {Component, OnInit} from '@angular/core';
import {DeliveryOrderService} from 'src/app/services/delivery-order.service';
import {Router} from '@angular/router';
import {ExcelService} from '../../services/excel.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  reportTable = 'delivery_orders';
  dateRange = [];
  orders: any;
  companyName: string;

  isLoading = false;

  // sort and filter variables
  sortName = null;
  sortValue = null;

  constructor(
    private deliveryService: DeliveryOrderService,
    private router: Router,
    private excelService: ExcelService
  ) {
  }

  ngOnInit() {
  }

  onSearchClick() {
    this.isLoading = true;
    this.deliveryService.getDeliveriesReport({
      report_table: this.reportTable,
      company_name: this.companyName,
      from: this.dateRange[0],
      to: this.dateRange[1]
    }).subscribe(deliveries => {
      this.isLoading = false;
      this.orders = deliveries;
    });
  }

  onOrderClick(orderId) {
    if (this.reportTable === 'delivered_orders') {
      return;
    }
    this.router.navigateByUrl(`/sales/delivery/${orderId}`);
  }

  exportAsXLSX(exportData = []): void {
    exportData.forEach(data => {
      delete data['updated_at'];
      delete data['sent_to_production'];
      delete data['order_id'];
      delete data['proforma_no'];
      delete data['original_production_order_id'];
      delete data['id'];
      delete data['active'];
    });

    const headerInfo = [{
      Date: new Date().toLocaleDateString(),
      'Data Type': this.reportTable === 'delivery_orders' ? 'From Delivery' : 'From Delivered',
      'Report for Customer Name': this.companyName || '',
      'Filter Date From': `from ${this.dateRange[0] || '-'}`,
      'Filter Date To': `to ${this.dateRange[1] || '-'}`,
      // add a filler prop for proper spacing
      ' ': ' ',
      '  ': ' ',
      '   ': ' '
    }];

    this.excelService.exportAsExcelFile(exportData, 'orders-report', headerInfo);
  }

  /*
    sorting and filtering feature
  */
  sort(sort: { key: string; value: string }): void {
    this.sortName = sort.key;
    this.sortValue = sort.value;
    this.search();
  }

  search(): void {
    /** sort data **/
    if (this.sortName && this.sortValue) {
      this.orders.sort((a, b) =>
        this.sortValue === 'ascend'
          ? a[this.sortName] > b[this.sortName]
          ? 1
          : -1
          : b[this.sortName] > a[this.sortName]
          ? 1
          : -1
      );
    }
  }
}
