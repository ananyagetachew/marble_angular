import {Component, OnInit} from '@angular/core';
import {StockService} from 'src/app/services/stock.service';
import {ExcelService} from '../../services/excel.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {

  stocks: any[];
  stockPrices: any[];
  currentPaginationIndex: number;
  lastPaginationIndex: number;
  dateRange = [];
  deliveryNos: any;
  products: any;

  // util
  currentDate = new Date();
  isLoading = true;

  filterObject = {
    company_name: '', delivery_no: '', name: '', length: '', width: '', thick: ''
  };

  // sort and filter variables
  sortName = null;
  sortValue = null;

  productsDropDown = '';
  deliveryNosDropDown = '';

  constructor(private stockService: StockService, private excelService: ExcelService) {
  }

  ngOnInit() {
    this.loadStocks();
    this.stockService
      .getProducts()
      .subscribe(products => this.products = products);
    this.stockService
      .getDeliveryNos()
      .subscribe(deliveryNos => {
        this.deliveryNos = deliveryNos;
        this.isLoading = false;
      });
  }

  onPaginateNext() {
    this.paginateTo({paginateTo: ++this.currentPaginationIndex});
  }

  onPaginatePrevious() {
    this.paginateTo({paginateTo: --this.currentPaginationIndex});
  }

  paginateTo({paginateTo}) {
    this.loadStocks({page: paginateTo});
  }

  loadStocks(argumentsObj = {}) {
    this.stockService.getStocks(argumentsObj).subscribe(stocks => {
      this.stocks = stocks['data'];
      this.currentPaginationIndex = stocks['current_page'];
      this.lastPaginationIndex = stocks['last_page'];
      // request stock prices
      this.stockService.getStockPrices(this.stocks.map(stockItem => stockItem.id)).subscribe(stockPrices => {
        this.stockPrices = stockPrices;
      });
    });
  }

  onFilter() {
    this.isLoading = true;
    // append date-range properties to the going request object for date filtering
    // Note: couldn't do it inside html since its reformatting it.
    this.stockService.filter({
      ...this.filterObject,
      from: this.dateRange[0],
      to: this.dateRange[1]
    }).subscribe(stocks => {
      this.stocks = stocks['data'];
      this.currentPaginationIndex = stocks['current_page'];
      this.lastPaginationIndex = stocks['last_page'];
      // request stock prices
      this.stockService.getStockPrices(this.stocks.map(stockItem => stockItem.id)).subscribe(stockPrices => {
        this.stockPrices = stockPrices;
      });
      this.isLoading = false;
    });
  }


  exportAsXLSX(exportData = []): void {
    exportData.forEach(data => {
      delete data['id'];
      delete data['delivery_no'];
      delete data['active'];
    });

    const order = this.deliveryNos.filter(order => order.id == this.filterObject.delivery_no)[0] || '';

    const headerInfo = [{
      Date: new Date().toLocaleDateString(),
      'Data Type': 'Stocks Data',
      'Filter Date From': `from ${this.dateRange[0] || '-'}`,
      'Filter Date To': `to ${this.dateRange[1] || '-'}`,
      'Filter Customer Name': this.filterObject.company_name,
      'Filter Delivery No': order['order_no'],
      'Filter Product': this.filterObject.name || '',
      'Filter Length': this.filterObject.length,
      'Filter Width': this.filterObject.width,
      'Filter Thickness': this.filterObject.thick,
      // add a filler prop for proper spacing
      ' ': ' '
    }];

    this.excelService.exportAsExcelFile(exportData, 'stocks', headerInfo);
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
      this.stocks.sort((a, b) =>
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
