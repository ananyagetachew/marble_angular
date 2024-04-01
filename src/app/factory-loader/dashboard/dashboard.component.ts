import { Component, OnInit } from '@angular/core';
import { ProductionService } from 'src/app/services/production.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  orders: any[];
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
    this.productionService.getProductions(argumentsObj).subscribe(orders => {
      this.orders = orders['data'];
      this.currentPaginationIndex = orders['current_page'];
      this.lastPaginationIndex = orders['last_page'];
    });
  }

  onOrderClick(orderId: number) {
    this.router.navigateByUrl(`/factoryloader/production/${orderId}`);
  }
}
