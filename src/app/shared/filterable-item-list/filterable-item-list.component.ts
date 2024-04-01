import { Component, OnInit } from '@angular/core';
import { ProductionService } from 'src/app/services/production.service';
import { StockService } from 'src/app/services/stock.service';
import { AuthService } from '../../services/auth.service';
import { FinalConstants } from '../../services/final-constants';
import { ExcelService } from '../../services/excel.service';

@Component({
  selector: 'app-filterable-item-list',
  templateUrl: './filterable-item-list.component.html',
  styleUrls: ['./filterable-item-list.component.css']
})
export class FilterableItemListComponent implements OnInit {

  shouldOnlyShowProductionOrderFilter = true;
  isFilterTypeOnProductionOrders = true;
  dateRange = [];
  isLoading: Boolean;
  items = [];
  products: any;
  deliveryNos: any;
  m2TotalForQeri: any;

  // sort and filter variables
  sortName = null;
  sortValue = null;

  productsDropDown = '';
  deliveryNosDropDown = '';

  // util
  currentDate = new Date();

  filterObject: any;

  constructor(
    private authService: AuthService,
    private productionOrderService: ProductionService,
    private stockService: StockService,
    private excelService: ExcelService
  ) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.stockService
      .getProducts()
      .subscribe(products => this.products = products);
    this.stockService
      .getDeliveryNos()
      .subscribe(deliveryNos => {
        this.deliveryNos = deliveryNos;
        this.isLoading = false;
      });
    this.shouldOnlyShowProductionOrderFilter = this.authService.getUserDepartmentId() !== FinalConstants.DEPARTMENT_ID_SALES;
  }

  onFilterTypeChange(filterType) {
    this.isFilterTypeOnProductionOrders = filterType === 'production_items';
    this.items = [];
    this.m2TotalForQeri = 0;
  }

  onFilter(filterObject) {
    this.filterObject = filterObject;
    this.isLoading = true;
    // append date-range properties to the going request object for date filtering
    // Note: couldn't do it inside html since its reformatting it.
    Object.assign(filterObject, { from: this.dateRange[0], to: this.dateRange[1] });
    const filterableTable = this.isFilterTypeOnProductionOrders ? 'production_items' : 'delivery_items';
    this.productionOrderService.filter(filterObject, filterableTable).subscribe(items => {
      this.items = items;
      this.isLoading = false;
      this.m2TotalForQeri = this.items.reduce((totalValue, data) => totalValue + (data.length * (data.in_stock_pcs - data.pcs) * data.width), 0);
    });
  }

  exportAsXLSX(exportData = []): void {
    exportData.forEach(data => {
      delete data['updated_at'];
      delete data['order_id'];
      delete data['package_id'];
      delete data['product_id'];
      delete data['id'];
      delete data['delivery_no'];
      delete data['active'];
    });

    const filteredProduct = this.products.filter(product => product.id == this.filterObject.product_id)[0] || '';

    const headerInfo = [{
      Date: new Date().toLocaleDateString(),
      'Data Type': this.isFilterTypeOnProductionOrders ? 'From Production' : 'From Delivery',
      'Filter Date From': `from ${this.dateRange[0] || '-'}`,
      'Filter Date To': `to ${this.dateRange[1] || '-'}`,
      'Filter Customer Name': this.filterObject.company_name,
      'Filter Delivery No': this.filterObject.delivery_no,
      'Filter Product': filteredProduct['name'],
      'Filter Length': this.filterObject.length,
      'Filter Width': this.filterObject.width,
      'Filter Thickness': this.filterObject.thick,
      // add a filler prop for proper spacing
      ' ': ' '
    }];

    this.excelService.exportAsExcelFile(exportData, 'filtered-items', headerInfo);
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
      this.items.sort((a, b) =>
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
