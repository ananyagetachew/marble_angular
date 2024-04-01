import {Component, OnInit} from '@angular/core';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  loadingRouteConfig = false;
  title = 'Firdows';

  constructor(private router: Router) {
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loadingRouteConfig = true;
      } else if (event instanceof NavigationEnd) {
        this.loadingRouteConfig = false;
      }
    });
  }

  ngOnInit(): void {
  }

}
