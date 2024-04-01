import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-production',
  templateUrl: './production.component.html',
  styleUrls: ['./production.component.css']
})
export class ProductionComponent implements OnInit {

  orders = [];
  packages = [];
  items = [];

  constructor(
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.orders = this.route.snapshot.data['production']['orders'];
    this.packages = this.route.snapshot.data['production']['packages'];
    this.items = this.route.snapshot.data['production']['items'];
  }

  filterPackagesWithOrderId(order_id: number) {
    return this.packages.filter(value => Number(value.order_id) === Number(order_id));
  }

}
