import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { Router } from '@angular/router';
import { DeliveryOrderService } from 'src/app/services/delivery-order.service';
import { ProformaOrderService } from 'src/app/services/proforma-order.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-sales-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isLoading = false;
  shouldDisplayPreview = false;
  isImportDelivery = false;
  // user is either manully creating proforma or delivery
  manuallyCreating = null;

  public data: {}[];
  // for the purpose of displaying preview before sending to system
  order;
  packages;
  items;

  constructor(
    private message: NzMessageService,
    private router: Router,
    private deliveryOrderService: DeliveryOrderService,
    private proformaOrderService: ProformaOrderService
  ) {
  }

  ngOnInit() {
  }

  onImportDeliveryClick() {
    const realDeliveryImportBtn = document.getElementById('delivery-import');
    const event = new MouseEvent('click');
    realDeliveryImportBtn.dispatchEvent(event);
    this.isImportDelivery = true;
    this.shouldDisplayPreview = false;
  }

  onImportProformaClick() {
    const realProformaImportBtn = document.getElementById('proforma-import');
    const event = new MouseEvent('click');
    realProformaImportBtn.dispatchEvent(event);
    this.isImportDelivery = false;
    this.shouldDisplayPreview = false;
  }

  onFileChange(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>evt.target;
    if (target.files.length !== 1) {
      this.message.error('ከአንድ በላይ ፋይል import ማረግ አይቻልም።');
      throw new Error('Cannot use multiple files');
    }
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = XLSX.utils.sheet_to_json(ws, { header: 1 });

      let i = 0;
      const packages = [];
      let current_package_orders = [];
      let current_package;
      let note = '';
      for (i; i < this.data.length; i++) {
        if (typeof this.data[i][1] === 'string') {
          // start of a new package?
          // the writing of the word 'length' might differ depending on spelling errors and capitalization errors
          // so system should take that into account, from the collected data users have written 'Length' as 'Lengeth' multiple times
          const length = this.data[i][1].toUpperCase();
          if (length.search('LENGTH') > -1 || length.search('LENGETH') > -1) {
            if (current_package_orders.length > 0) {
              current_package.items = current_package_orders;
              packages.push(current_package);
            }
            /*
              product/package name could be misspelled or miswritten so a small script would compute type errors and
              fix the spelling errors. name should be in the following format 'Tread', 'Riser' or 'Door Sill|Treshold'
            */
            let product_name = this.data[i][0].toLowerCase();
            // is misspelled product name 'Window Sill'?
            if (product_name.includes('win')) {
              // yes, so correct to appropriate format
              product_name = 'Window Sill';
            } else if (
              product_name.includes('do') ||
              product_name.includes('tresh') ||
              product_name.includes('trash')
            ) {
              product_name = 'Door Sill|Treshold';
            } else if (
              product_name.includes('trea') ||
              product_name.includes('trae')
            ) {
              product_name = 'Tread';
            } else if (product_name.includes('ri')) {
              product_name = 'Riser';
            } else if (
              product_name.includes('til') ||
              product_name.includes('land')
            ) {
              product_name = 'Tiles|Landing';
            } else if (
              product_name.includes('sk') ||
              product_name.includes('zek')
            ) {
              product_name = 'Skirting|Zekolo';
            } else if (product_name.includes('cop')) {
              product_name = 'Coping';
            } else if (product_name.includes('bor')) {
              product_name = 'Border';
            } else if (product_name.includes('ch')) {
              product_name = 'Chips';
            } else if (product_name.includes('pow')) {
              product_name = 'Powder';
            } else if (product_name.includes('bl')) {
              product_name = 'Block';
            } else if (product_name.includes('cla')) {
              product_name = 'Cladding';
            }
            current_package = {
              id: Math.random(),
              name: product_name,
              items: current_package_orders,
              bullnose: 0,
              groove: 0,
              unit_price: 0
            };
            current_package_orders = [];
          } else {
            this.message.error(
              'Couldn\'t find \'Length\' column, please make sure there are no spelling errors!'
            );
            throw new Error(
              '\'Length\' couldn\'t be found, so we can\'t initiate a new package, there maybe a spelling error present'
            );
          }
        }
        if (typeof this.data[i][0] === 'string') {
          if (typeof this.data[i][7] === 'number') {
            if (
              this.data[i][0] === 'bullnose' ||
              this.data[i][0] === 'Bullnose'
            ) {
              current_package.bullnose = this.data[i][7];
            } else if (
              this.data[i][0] === 'Groove' ||
              this.data[i][0] === 'groove'
            ) {
              current_package.groove = this.data[i][7];
            } else if (this.data[i][0] === 'm2' || this.data[i][0] === 'M2') {
              current_package.unit_price = this.data[i][7];
            }
          } else if (
            typeof this.data[i][7] === 'undefined' &&
            typeof this.data[i][5] === 'undefined' &&
            typeof this.data[i][8] === 'undefined' &&
            i > 10
          ) {
            note += '\n' + this.data[i][0];
          }
        } else if (typeof this.data[i][0] === 'number') {
          const item = {
            id: this.data[i][0],
            package_id: current_package.id,
            length: this.data[i][1],
            width: this.data[i][2],
            thick: this.data[i][3],
            pcs: this.data[i][4],
            remark: this.data[i][9]
          };
          if (typeof item.remark === 'undefined') {
            item.remark = '';
          }
          current_package_orders.push(item);
        }
      }
      const order = {
        company_name: this.data[7][0],
        // on some excel files fsno is found on the 7th and on the 6th sometimes, so we should be ready for those scenarios
        fsno: this.data[7][6],
        note: note
      };

      current_package.items = current_package_orders;
      packages.push(current_package);
      // display preview
      const tempItems = [];
      packages.forEach(item => {
        item.items.forEach(element => {
          tempItems.push(element);
        });
      });

      this.order = order;
      this.packages = packages;
      this.items = tempItems;
      this.shouldDisplayPreview = true;
    };
    reader.readAsBinaryString(target.files[0]);
  }

  submitImportedProformaExcel(validity_date_count: number) {
    const fullObj = {};
    fullObj['packages'] = this.packages;
    fullObj['order'] = this.order;
    fullObj['order'].validity_date_count = validity_date_count;
    this.proformaOrderService
      .submitImportedExcel(fullObj)
      .subscribe(() =>
        this.router.navigateByUrl('/sales/proformas')
      );
  }

  submitImportedDeliveryExcel(delivery_date_count: number) {
    const fullObj = {};
    fullObj['packages'] = this.packages;
    fullObj['order'] = this.order;
    fullObj['order'].delivery_date_count = delivery_date_count;
    this.deliveryOrderService
      .submitImportedExcel(fullObj)
      .subscribe(() =>
        this.router.navigateByUrl('/sales/deliveries')
      );
  }

  submitManuallyCreatedOrder(fullObj) {
    if (this.manuallyCreating === 'delivery') {
      fullObj['delivery_date_count'] = fullObj['numberOfDays'];
      this.deliveryOrderService
        .submitManuallyCreatedDelivery(fullObj)
        .subscribe(() =>
          this.router.navigateByUrl('/sales/deliveries')
        );
    } else {
      fullObj['validity_date_count'] = fullObj['numberOfDays'];
      this.proformaOrderService
        .submitManuallyCreatedProforma(fullObj)
        .subscribe(() =>
          this.router.navigateByUrl('/sales/proformas')
        );
    }
  }
}
