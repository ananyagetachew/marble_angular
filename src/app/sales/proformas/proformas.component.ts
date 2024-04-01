import { Component, OnInit } from '@angular/core';
import { ProformaOrderService } from 'src/app/services/proforma-order.service';
import { ProformaOrder } from 'src/app/models/proforma-order';
import { Router } from '@angular/router';

@Component({
  selector: 'app-proformas',
  templateUrl: './proformas.component.html',
  styleUrls: ['./proformas.component.css']
})
export class ProformasComponent implements OnInit {
  proformas: ProformaOrder[];
  currentPaginationIndex: number;
  lastPaginationIndex: number;
  searchQuery: String;
  isSearching = false;

  constructor(
    private proformaOrderService: ProformaOrderService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProformas();
  }

  onSearchInput(value: string, searchQuery = value || null): void {
    if (!searchQuery) { return; }
    this.searchQuery = searchQuery;
    this.isSearching = true;
    this.loadProformas({ searchQuery: this.searchQuery });
  }

  onPaginateNext() {
    this.paginateTo({ paginateTo: ++this.currentPaginationIndex });
  }

  onPaginatePrevious() {
    this.paginateTo({ paginateTo: --this.currentPaginationIndex });
  }

  paginateTo({ paginateTo }) {
    this.loadProformas({ page: paginateTo, searchQuery: this.searchQuery });
  }

  loadProformas(argumentsObj = {}) {
    const loadingFunction = this.isSearching
      ? this.proformaOrderService.searchProformas(argumentsObj)
      : this.proformaOrderService.getProformas(argumentsObj);

    loadingFunction.subscribe(proformas => {
      this.proformas = proformas['data'];
      this.currentPaginationIndex = proformas['current_page'];
      this.lastPaginationIndex = proformas['last_page'];
    });
  }

  onOrderClick(orderId: number) {
    this.router.navigateByUrl(`/sales/proforma/${orderId}`);
  }
}
