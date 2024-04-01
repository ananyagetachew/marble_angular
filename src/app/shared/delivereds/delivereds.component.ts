import { Component, OnInit } from '@angular/core';
import { ProductionService } from 'src/app/services/production.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delivereds',
  templateUrl: './delivereds.component.html',
  styleUrls: ['./delivereds.component.css']
})
export class DeliveredsComponent implements OnInit {
  deliveredOrders: any[];
  currentPaginationIndex: number;
  lastPaginationIndex: number;

  constructor(
    private productionService: ProductionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProductions();
  }

  onPaginateNext() {
    this.paginateTo({ paginateTo: ++this.currentPaginationIndex });
  }

  onPaginatePrevious() {
    this.paginateTo({ paginateTo: --this.currentPaginationIndex });
  }

  paginateTo({ paginateTo }) {
    this.loadProductions({ page: paginateTo });
  }

  loadProductions(argumentsObj = {}) {
    this.productionService
      .getDeliveredOrders(argumentsObj)
      .subscribe(deliveredOrders => {
        this.deliveredOrders = deliveredOrders['data'];
        this.currentPaginationIndex = deliveredOrders['current_page'];
        this.lastPaginationIndex = deliveredOrders['last_page'];
      });
  }

  onOrderClick(orderId: number) {
    const department = this.router.url.toString().includes('factoryloader') ? 'factoryloader' : 'financemanager';
    this.router.navigateByUrl(`/${department}/delivered/${orderId}`);
  }
}
