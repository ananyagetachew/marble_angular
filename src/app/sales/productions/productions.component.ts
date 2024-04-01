import { Component, OnInit } from '@angular/core';
import { ProductionService } from 'src/app/services/production.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-productions',
  templateUrl: './productions.component.html',
  styleUrls: ['./productions.component.css']
})
export class ProductionsComponent implements OnInit {
  productions: any[];
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
      .getProductions(argumentsObj)
      .subscribe(productions => {
        this.productions = productions['data'];
        this.currentPaginationIndex = productions['current_page'];
        this.lastPaginationIndex = productions['last_page'];
      });
  }

  onOrderClick(orderId: number) {
    this.router.navigateByUrl(`/sales/production/${orderId}`);
  }
}
