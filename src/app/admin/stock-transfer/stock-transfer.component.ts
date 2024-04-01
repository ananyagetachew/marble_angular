import {Component, OnInit} from '@angular/core';
import {StockService} from '../../services/stock.service';
import {NzMessageService} from 'ng-zorro-antd';
import {ExcelService} from '../../services/excel.service';


@Component({
  selector: 'app-stock-transfer',
  templateUrl: './stock-transfer.component.html',
  styleUrls: ['./stock-transfer.component.css']
})
export class StockTransferComponent implements OnInit {
  stocks: any[];
  currentPaginationIndex: number;
  lastPaginationIndex: number;
  deliveryNos;

  searchQuery: string;
  private isSearching: boolean;
  debounceTime = null;

  constructor(private stockService: StockService, private message: NzMessageService, private excelService: ExcelService) {
  }

  ngOnInit() {
    this.loadStocks();
    this.stockService
      .getDeliveryNos()
      .subscribe(deliveryNos => (this.deliveryNos = deliveryNos));
  }

  notifySuccess(id) {
    this.message.remove(id);
    this.message.create('success', 'Stock Transfer complete!');
  }

  onPaginateNext() {
    this.paginateTo({paginateTo: ++this.currentPaginationIndex, searchQuery: this.searchQuery});
  }

  onPaginatePrevious() {
    this.paginateTo({paginateTo: --this.currentPaginationIndex, searchQuery: this.searchQuery});
  }

  paginateTo({paginateTo, searchQuery}) {
    this.loadStocks({page: paginateTo, searchQuery: searchQuery});
  }

  loadStocks(argumentsObj = {}) {
    const loadingFunction = this.isSearching
      ? this.stockService.searchStocks(argumentsObj)
      : this.stockService.getStocks(argumentsObj);

    loadingFunction.subscribe(stocks => {
      this.stocks = stocks['data'];
      this.currentPaginationIndex = stocks['current_page'];
      this.lastPaginationIndex = stocks['last_page'];
    });
  }

  fetchCompanies(deliveryNo, stockItem) {
    // transferToAnotherStock
    this.stockService.transferToAnotherStock(deliveryNo, stockItem.id).subscribe(id => {
      if (id) {
        this.notifySuccess(id);
        window.location.reload();
      }
    });
  }

  onSearchInput(value: string, searchQuery = value || null): void {
    if (!searchQuery) {
      return;
    }
    this.searchQuery = searchQuery;
    this.isSearching = true;
    // throttle requests for half a second to avoid
    // to many(unnecessary) requests to server
    clearTimeout(this.debounceTime);
    this.debounceTime = setTimeout(() => {
      this.loadStocks({searchQuery: this.searchQuery});
    }, 300);
  }

  exportAsXLSX(stocksData): void {
    const exportData = stocksData.data;
    exportData.forEach(data => {
      delete data['updated_at'];
      delete data['id'];
      delete data['delivery_no'];
      delete data['active'];
    });

    const headerInfo = [{
      Date: new Date().toLocaleDateString(),
      'Data Type': 'Stock',
      // add a filler prop for proper spacing
      '': '',
      ' ': '',
      '  ': '',
      '   ': '',
      '    ': '',
      '     ': '',
      '      ': '',
    }];


    this.excelService.exportAsExcelFile(exportData, 'in-stock-items', headerInfo);
  }

}
