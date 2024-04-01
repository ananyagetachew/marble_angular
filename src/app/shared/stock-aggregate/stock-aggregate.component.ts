import {Component, Input, OnInit} from '@angular/core';
import {StockService} from '../../services/stock.service';

@Component({
  selector: 'app-stock-aggregate',
  templateUrl: './stock-aggregate.component.html',
  styleUrls: ['./stock-aggregate.component.css']
})
export class StockAggregateComponent implements OnInit {

  // for aggregate status of all stocks in database
  stockAggregateData;
  totalPrice = 0;

  isLoading = true;

  @Input() mode;

  constructor(
    private stockService: StockService
  ) {
  }

  ngOnInit() {
    this.stockService
      .getAggregateStockStatus()
      .subscribe(aggregatedStockStatus => {
        this.stockAggregateData = aggregatedStockStatus;
        this.totalPrice = Object.values(aggregatedStockStatus).reduce((total, {price}) => {
          this.isLoading = false;
          return total + price;
        }, 0);
      });
  }


}
