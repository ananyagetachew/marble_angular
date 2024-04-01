import {Component, Input, OnInit} from '@angular/core';
import {DeliveryOrderService} from 'src/app/services/delivery-order.service';
import {Router} from '@angular/router';
import {ProformaOrderService} from 'src/app/services/proforma-order.service';
import {NzMessageService} from 'ng-zorro-antd';
import {StockService} from 'src/app/services/stock.service';

@Component({
  selector: 'app-order-detail-table',
  templateUrl: './order-detail-table.component.html',
  styleUrls: ['./order-detail-table.component.css']
})
export class OrderDetailTableComponent implements OnInit {
  static vatPercentage = 15.0;
  currentDate = new Date();

  // used only on preview mode ( just before the user submits the excel to system) - for verification only
  @Input() mode;
  /* so when displaying order detail for factory loaders we must hide any price information, editing and issued date
  but allow for selection and editing of pieces selected (loaders may load smaller pieces at a time than all at once).
  inorder to do that submode input is created so it can inherit all behaviours of mode="'delivery'" but also hide some
  info that should not be displayed to factory loaders
  */
  @Input() submode;
  @Input() editable;
  @Input() hidePricing;
  @Input() hideIssuedDate;
  @Input() inputOrder;
  @Input() inputPackages;
  @Input() inputItems;

  order;
  packages;
  items = [];

  products = [];

  ml_total;
  m2_total; // holds all packages m2 total value: two dimenstional array having by package >> m2 totals
  sub_totals;
  total;
  VAT;
  totalWithVAT;

  // sort and filter variables
  sortName = null;
  sortValue = null;

  /*

    Delivery No Specific Code

  */
  prepared_toproduction_ml_total;
  prepared_toproduction_m2_total;
  prepared_toproduction_sub_totals;
  prepared_toproduction_total;
  prepared_toproduction_VAT;
  prepared_toproduction_totalWithVAT;

  prepared_toproduction_packages = [];
  prepared_toproduction_items = [];

  // selected items with thier selected piece number: two dimensional array having by item >> package_id and item_id
  selected_items = [];
  // selected items data stat: like how many risers or doors has been selected and about to be sent
  selectedPackageNItemcountDisplayData = [];

  /*
    display the selected items with thier selected pieces in a tree
   */

  selectedItemNPieceCache = {};

  // multiple selection variables
  allChecked = false;
  indeterminate = false;

  // edit variables
  editCache = {};
  editCacheForPackageProperties = {};

  /*
   * instead of sending every single item insertion to server
   * we store it locally and send it all at once
   * based on user input
   */
  newlyAddedItems = [];

  constructor(
    private message: NzMessageService,
    private deliveryOrderService: DeliveryOrderService,
    private proformaOrderService: ProformaOrderService,
    private stockService: StockService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.loadOrderDetailData();
    this.stockService
      .getProducts()
      .subscribe(products => (this.products = products));
  }

  loadOrderDetailData() {
    this.order = this.inputOrder;
    this.packages = this.inputPackages;
    this.items = this.inputItems;
    this.reCalculate();
  }

  reCalculate() {
    this.calculatePackageProperties();
    this.updateEditCache();
    this.updateEditCacheForPackageProperties();
    this.initializeInputPiecesCache();
  }

  // we are sending the very same data that we recieved but with the change applied
  onPersistEditedData() {
    const fullObj = {};
    fullObj['order'] = this.order;
    fullObj['packages'] = this.packages;
    fullObj['items'] = this.items.filter(item => item.id != null);

    const id = this.message.loading('Saving Changes to System...', {
      nzDuration: 0
    }).messageId;
    if (this.mode === 'delivery') {
      this.deliveryOrderService
        .persistEditedData(this.order.id, fullObj)
        .subscribe(() => {
          this.loadOrderDetailData();
          this.notifySuccess(id);
          this.router.navigateByUrl('/sales/delivery/' + this.order.id);
        });
    } else {
      this.proformaOrderService
        .persistEditedData(this.order.id, fullObj)
        .subscribe(() => {
          this.loadOrderDetailData();
          this.notifySuccess(id);
          this.router.navigateByUrl('/sales/proforma/' + this.order.id);
        });
    }
    // are there any newly added items?
    if (this.newlyAddedItems.length > 0) {
      // yes, so send them to server
      this.sendNewlyAddedItems();
    }
  }

  // send locally stored new items to server
  sendNewlyAddedItems() {
    const id = this.message.loading('Adding New Items to System...', {
      nzDuration: 0
    }).messageId;

    if (this.mode === 'delivery') {
      this.deliveryOrderService
        .addNewItems(this.newlyAddedItems)
        .subscribe(() => {
          this.router
            .navigateByUrl('/sales/deliveries', {skipLocationChange: true})
            .then(() => {
              this.router.navigate(['/sales/delivery/' + this.order.id]);
              this.notifySuccess(id);
            });
        });
    } else {
      this.proformaOrderService
        .addNewItems(this.newlyAddedItems)
        .subscribe(() => {
          this.router
            .navigateByUrl('/sales/proformas', {skipLocationChange: true})
            .then(() => {
              this.router.navigate(['/sales/proforma/' + this.order.id]);
              this.notifySuccess(id);
            });
        });
    }
  }

  notifySuccess(id) {
    this.message.remove(id);
    this.message.create('success', 'System Updated Successfully!');
  }

  /*
   * adds new item belonging to a package with the specified
   * package_id.
   *
   */
  addNewItem(package_id, length, width, thick, pcs, remark) {
    const newItem = {
      package_id: package_id,
      length: length,
      width: width,
      thick: thick,
      pcs: pcs,
      remark: remark
    };

    // add new item locally
    this.newlyAddedItems.push(newItem);
    // also add it to rendered items so it can
    // update the ui for the newly added items
    this.items.push(newItem);
    // show notification for the newly added item
    this.message.info('New Item Added!', {
      nzDuration: 800
    });
    // invoke a refresh
    this.refreshStatus();
  }

  addNewPackage(product_id: any, bullnose: any, groove: any, unit_price: any) {
    const id = this.message.loading('Adding New Good to System...', {
      nzDuration: 0
    }).messageId;

    if (this.mode === 'delivery') {
      this.deliveryOrderService
        .addNewPackage(this.order.id, product_id, bullnose, groove, unit_price)
        .subscribe(newPackage => {
          this.packages.push(newPackage);
          this.notifySuccess(id);
        });
    } else {
      this.proformaOrderService
        .addNewPackage(this.order.id, product_id, bullnose, groove, unit_price)
        .subscribe(newPackage => {
          this.packages.push(newPackage);
          this.notifySuccess(id);
        });
    }
  }

  convertToDeliveryOrder(delivery_date_count: number) {
    this.proformaOrderService
      .convertToDeliveryOrder(this.order.id, delivery_date_count)
      .subscribe(() => this.router.navigateByUrl('/sales/deliveries'));
  }

  onSendAllToProduction() {
    this.deliveryOrderService
      .sendAllToProduction(this.order.id)
      .subscribe(() => this.router.navigateByUrl('/sales/productions'));
  }

  onConfirmDeliveryOnSelected(
    issuedBy: any,
    approvedBy: any,
    recievedBy: any,
    plateNo: any,
    idNo: any,
    fullname: string
  ) {
    const fullObj = {};
    fullObj['items'] = this.prepared_toproduction_items;
    fullObj['packages'] = this.prepared_toproduction_packages;
    fullObj['order'] = this.order;
    fullObj['issued_by'] = issuedBy;
    fullObj['approved_by'] = approvedBy;
    fullObj['recieved_by'] = recievedBy;
    fullObj['driver_plate_no'] = plateNo;
    fullObj['driver_id_no'] = idNo;
    fullObj['driver_name'] = fullname;
    this.deliveryOrderService
      .confirmSelectedDelivered(fullObj)
      .subscribe(() => this.router.navigateByUrl('/factoryloader/delivereds'));
  }

  onSendSelectedToProduction(dataCount: number) {
    const fullObj = {};
    fullObj['items'] = this.prepared_toproduction_items;
    fullObj['packages'] = this.prepared_toproduction_packages;
    fullObj['order'] = this.order;
    fullObj['order'].delivery_date_count = dataCount;
    this.deliveryOrderService
      .sendSelectedToProduction(fullObj)
      .subscribe(() => this.router.navigateByUrl('/sales/productions'));
  }

  /*
    calculate package properties ml and m2
  */
  calculatePackageProperties(isForPreparedToProduction = false) {
    if (isForPreparedToProduction) {
      this.prepared_toproduction_ml_total = [];
      this.prepared_toproduction_m2_total = [];
      this.prepared_toproduction_packages.forEach(pck => {
        const tempMLArray = [];
        const tempM2Array = [];
        this.prepared_toproduction_items
          .filter(item => item.package_id === pck.id)
          .forEach(value => {
            let tempML =
              value.length * this.selectedItemNPieceCache[value.id].pcs; // ml = length * pcs
            tempMLArray.push(tempML);
            tempML *= value.width; // ml times width gives m2
            tempM2Array.push(tempML);
          });
        this.prepared_toproduction_ml_total.push(tempMLArray);
        this.prepared_toproduction_m2_total.push(tempM2Array);
      });

      this.calculateSubTotalPrice(true);
    }

    this.ml_total = [];
    this.m2_total = [];
    this.packages.forEach((item: { id: number }) => {
      const tempMLArray = [];
      const tempM2Array = [];
      this.filterProformaItemsWithPackageId(item.id).forEach(value => {
        let tempML = value.length * value.pcs;
        tempMLArray.push(tempML);

        tempML *= value.width; // ml x width = m2
        tempM2Array.push(tempML);
      });
      this.ml_total.push(tempMLArray);
      this.m2_total.push(tempM2Array);
    });

    this.calculateSubTotalPrice();
  }

  /*
    called after calculatePackageProperties() function to calculate subtotal,total and total with vat
  */
  calculateSubTotalPrice(isForPreparedToProduction = false) {
    if (isForPreparedToProduction) {
      this.prepared_toproduction_sub_totals = [];
      const preparedmlSubTotals = [];
      const preparedm2SubTotals = [];

      // calculate sub totals with only ml
      this.prepared_toproduction_ml_total.forEach(
        (
          item: { forEach: (arg0: (element: any) => void) => void },
          index: string | number
        ) => {
          let tempMLTotal = 0;
          item.forEach((element: number) => {
            tempMLTotal += element;
          });

          const bullnose_price =
            tempMLTotal * this.prepared_toproduction_packages[index].bullnose;
          const groove_price =
            tempMLTotal * this.prepared_toproduction_packages[index].groove;
          preparedmlSubTotals.push(bullnose_price + groove_price);
        }
      );

      // calcualte sub totals including m2 which finalized the total price
      this.prepared_toproduction_m2_total.forEach(
        (
          item: { forEach: (arg0: (element: any) => void) => void },
          index: string | number
        ) => {
          let tempM2Total = 0;
          item.forEach((element: number) => {
            tempM2Total += element;
          });

          const total_price =
            tempM2Total * this.prepared_toproduction_packages[index].unit_price;
          preparedm2SubTotals.push(total_price);
        }
      );

      // calculate the overall sub totals including both m1 totals and m2 totals
      preparedmlSubTotals.forEach((item, index) => {
        this.prepared_toproduction_sub_totals.push(
          item + preparedm2SubTotals[index]
        );
      });

      this.prepared_toproduction_total = 0;
      this.prepared_toproduction_sub_totals.forEach(
        (sub_total: string | number) => {
          this.prepared_toproduction_total += sub_total;
        }
      );
      this.prepared_toproduction_VAT =
        (this.prepared_toproduction_total *
          OrderDetailTableComponent.vatPercentage) /
        100;
      this.prepared_toproduction_totalWithVAT =
        this.prepared_toproduction_total + this.prepared_toproduction_VAT;
    }

    this.sub_totals = [];
    const mlSubTotals = [];
    const m2SubTotals = [];

    // calculate sub totals with only ml
    this.ml_total.forEach(
      (
        item: { forEach: (arg0: (element: any) => void) => void },
        index: string | number
      ) => {
        let tempMLTotal = 0;
        item.forEach((element: number) => {
          tempMLTotal += element;
        });

        const bullnose_price = tempMLTotal * this.packages[index].bullnose;
        const groove_price = tempMLTotal * this.packages[index].groove;
        mlSubTotals.push(bullnose_price + groove_price);
      }
    );

    // calcualte sub totals including m2 which finalized the total price
    this.m2_total.forEach(
      (
        item: { forEach: (arg0: (element: any) => void) => void },
        index: string | number
      ) => {
        let tempM2Total = 0;
        item.forEach((element: number) => {
          tempM2Total += element;
        });

        const total_price = tempM2Total * this.packages[index].unit_price;
        m2SubTotals.push(total_price);
      }
    );

    // calculate the overall sub totals including both m1 totals and m2 totals
    mlSubTotals.forEach((item, index) => {
      this.sub_totals.push(item + m2SubTotals[index]);
    });

    this.total = 0;
    this.sub_totals.forEach((sub_total: string | number) => {
      this.total += sub_total;
    });
    this.VAT = (this.total * OrderDetailTableComponent.vatPercentage) / 100;
    this.totalWithVAT = this.total + this.VAT;
  }

  calculateSummationOfArray(input_array: {
    forEach: (arg0: (element: any) => void) => void;
  }) {
    if (input_array) {
      let summation = 0;
      input_array.forEach((element: number) => {
        summation += element;
      });
      return summation;
    }
  }

  filterProformaItemsWithPackageId(
    package_id: number,
    item_source = this.items
  ) {
    return item_source.filter(
      value => Number(value.package_id) === Number(package_id)
    );
  }

  getPackageNameFromPackageId(package_id: number) {
    return this.packages.find(
      (pack: { id: any }) => Number(pack.id) === Number(package_id)
    ).name;
  }

  /*
    before sending the selected packages and items we need to display the amount of items
    price, sub total and vat of what is he/she about to send to production
  */
  prepareSelectedPackagesForProduction() {
    this.prepared_toproduction_packages = [];
    this.packages.forEach((pack: { id: any }) => {
      for (const selected_item of this.selected_items) {
        if (pack.id === selected_item[0]) {
          this.prepared_toproduction_packages.push(pack);
          break;
        }
      }
    });
    this.calculatePackageProperties(true);
  }

  prepareSelectedItemsForProduction() {
    this.prepared_toproduction_items = [];
    this.items
      .filter(item => item.sent_to_production === true)
      .forEach(proforma_item => {
        this.prepared_toproduction_items.push(Object.assign({}, proforma_item));
      });
    this.prepareSelectedPackagesForProduction();
    this.prepared_toproduction_items.forEach(element => {
      element.pcs = this.selectedItemNPieceCache[element.id].pcs;
    });
  }

  /*
    for the sake of saving some resources don't loop over all
    of the items when called for the second time, but on
    initial call have to do it since property not found
    will be thrown
  */
  initializeInputPiecesCache() {
    this.items.forEach(item => {
      this.selectedItemNPieceCache[item.id] = {
        pcs:
          item.in_stock_pcs > item.pcs - item.previously_processed_pcs
            ? item.pcs - item.previously_processed_pcs
            : item.in_stock_pcs
            ? item.in_stock_pcs
            : item.pcs - item.previously_processed_pcs
      };
    });
  }

  // return an array with package name of item and number of pieces selected
  packageNameAndNumberOfPieces() {
    // selected_item shall have [package_id, item_id]
    const displayArray = [];
    this.selected_items.forEach(selected_item => {
      displayArray.push(
        this.selectedItemNPieceCache[selected_item[1]].pcs +
        ' Pieces of ' +
        this.getPackageNameFromPackageId(selected_item[0])
      );
    });
    return displayArray;
  }

  /*

    selection feature

  */
  refreshStatus(): void {
    const allChecked = this.items.every(
      value => value.sent_to_production === true
    );
    const allUnChecked = this.items.every(
      value => value.sent_to_production === false
    );
    this.allChecked = allChecked;
    this.indeterminate = !allChecked && !allUnChecked;
    this.updateEditCache();
    this.packageNameAndNumberOfPieces();
    /*
    calculate selected items to be sent to server everytime the user makes a change to selection
    because we need to display data of how much is going to send
     */
    this.selected_items = [];
    this.items
      .filter(value => value.sent_to_production === true)
      .forEach(item => {
        const singleSelectedItem = [];
        singleSelectedItem.push(item.package_id);
        singleSelectedItem.push(item.id);
        this.selected_items.push(singleSelectedItem);
      });

    /*
      selected items and packages need to be displayed like
    */
    this.selectedPackageNItemcountDisplayData = [];
    this.packages.forEach((proforma_package: { name: any; id: any }) => {
      const packageName = proforma_package.name;
      let itemCount = 0;
      this.selected_items.forEach((proforma, index) => {
        if (proforma_package.id === proforma[0]) {
          ++itemCount;
        }
        // if no more items match package id then add it to the display array
        if (index === this.selected_items.length - 1 && itemCount > 0) {
          this.selectedPackageNItemcountDisplayData.push([
            packageName,
            itemCount
          ]);
        }
      });
    });
    this.prepareSelectedItemsForProduction();
  }

  checkAll(value: boolean): void {
    this.items.forEach(data => {
      if (
        data.pcs - data.previously_processed_pcs <= 0 ||
        ((this.submode === 'factory-loader-detail' && !data.in_stock_pcs) ||
          data.in_stock_pcs <= 0)
      ) {
        return;
      }
      data.sent_to_production = value;
    });
    this.refreshStatus();
  }

  /*
    edit each proforma item and
    package properties feature
  */
  startEdit(id: number): void {
    this.editCache[id].edit = true;
  }

  cancelEdit(id: number): void {
    this.editCache[id].edit = false;
  }

  saveEdit(id: number): void {
    const index = this.items.findIndex(item => item.id === id);
    Object.assign(this.items[index], this.editCache[id].data);
    this.editCache[id].edit = false;
    this.calculatePackageProperties();
    this.calculatePackageProperties(true);
  }

  updateEditCache(): void {
    if (this.editCache !== {}) {
      this.editCache = {};
    }
    this.items.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: {...item}
      };
    });
  }

  // edit for package properties
  startEditForPackageProperties(id: number): void {
    this.editCacheForPackageProperties[id].edit = true;
  }

  cancelEditForPackageProperties(id: number): void {
    this.editCacheForPackageProperties[id].edit = false;
  }

  saveEditForPackageProperties(id: number): void {
    const index = this.packages.findIndex(
      (item: { id: number }) => item.id === id
    );
    Object.assign(
      this.packages[index],
      this.editCacheForPackageProperties[id].data
    );
    this.editCacheForPackageProperties[id].edit = false;
    this.calculatePackageProperties();
    this.calculatePackageProperties(true);
  }

  updateEditCacheForPackageProperties(): void {
    if (this.editCacheForPackageProperties !== {}) {
      this.editCacheForPackageProperties = {};
    }
    this.packages.forEach((item: { id: string | number }) => {
      this.editCacheForPackageProperties[item.id] = {
        edit: false,
        data: {...item}
      };
    });
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
