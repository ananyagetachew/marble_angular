import {Component, OnInit} from '@angular/core';
import {DeliveryOrderService} from 'src/app/services/delivery-order.service';
import {DeliveryOrder} from 'src/app/models/delivery-order';
import {Router} from '@angular/router';

@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.css']
})
export class DeliveriesComponent implements OnInit {
  deliveries: DeliveryOrder[];
  currentPaginationIndex: number;
  lastPaginationIndex: number;
  searchQuery: String;
  isSearching = false;

  constructor(
    private deliveryOrderService: DeliveryOrderService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.loadDeliveries();
  }

  onSearchInput(value: string, searchQuery = value || null): void {
    if (!searchQuery) {
      return;
    }
    this.searchQuery = searchQuery;
    this.isSearching = true;
    this.loadDeliveries({searchQuery: this.searchQuery});
  }

  onPaginateNext() {
    this.paginateTo({paginateTo: ++this.currentPaginationIndex});
  }

  onPaginatePrevious() {
    this.paginateTo({paginateTo: --this.currentPaginationIndex});
  }

  paginateTo({paginateTo}) {
    this.loadDeliveries({page: paginateTo, searchQuery: this.searchQuery});
  }

  loadDeliveries(argumentsObj = {}) {
    const loadingFunction = this.isSearching
      ? this.deliveryOrderService.searchDeliveries(argumentsObj)
      : this.deliveryOrderService.getDeliveries(argumentsObj);

    loadingFunction.subscribe(deliveries => {
      this.deliveries = deliveries['data'];
      this.currentPaginationIndex = deliveries['current_page'];
      this.lastPaginationIndex = deliveries['last_page'];
    });
  }

  onOrderClick(orderId: number) {
    const department = this.router.url.toString().includes('sales') ? 'sales' : 'financemanager';
    this.router.navigateByUrl(`/${department}/delivery/${orderId}`);
  }
}
