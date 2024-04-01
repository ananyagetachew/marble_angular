import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-delivery-detail',
  templateUrl: './delivery-detail.component.html',
  styleUrls: ['./delivery-detail.component.css']
})
export class DeliveryDetailComponent implements OnInit {
  order: any;
  packages: any;
  items: any;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.loadOrderDetailData(this.route.snapshot.data['order']);
  }

  loadOrderDetailData(fullObj: any) {
    this.order = fullObj['order'];
    this.packages = fullObj['packages'];
    this.items = fullObj['items'];
  }

}
