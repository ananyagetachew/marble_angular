import {Component, OnInit} from '@angular/core';
import {AuthService} from 'src/app/services/auth.service';
import {Router} from '@angular/router';
import {FinalConstants} from 'src/app/services/final-constants';
import {User} from 'src/app/models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username;
  password;

  message;
  isLoading = false;
  user: User;

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.user = JSON.parse(
        localStorage.getItem(FinalConstants.AUTHENTICATED_USER_LABEL)
      );
      this.redirectToRespectiveDepartment();
    }
  }

  OnSubmit() {
    if (!this.username) {
      this.message = 'Please Enter Your Credentials!';
      return;
    } else if (!this.password) {
      this.message = 'Please Enter Your Password!';
      return;
    }
    this.isLoading = true;
    this.authService.login(this.username, this.password)
      .subscribe(
        result => {
          this.isLoading = false;
          if (result['error_message']) {
            this.message = result['error_message'];
          } else {
            this.user = result;
            // save the logged in user into html localstorage
            localStorage.setItem('authenticatedUser', JSON.stringify(this.user));
            // then redirect the user to its department module
            this.redirectToRespectiveDepartment();
          }
        },

        error => {
          this.isLoading = false;
          this.message = 'Server Error! Please Try Again Later';
        }
      )
    ;
  }

  redirectToRespectiveDepartment() {
    // if user belongs to sales department
    if (this.user && Number(this.user.department_id) === FinalConstants.DEPARTMENT_ID_SALES) {
      this.router.navigateByUrl('/sales');
    } else if (this.user && Number(this.user.department_id) === FinalConstants.DEPARTMENT_ID_ADMIN) {
      this.router.navigateByUrl('/admin');
    } else if (this.user && Number(this.user.department_id) === FinalConstants.DEPARTMENT_ID_FACTORY_LOADER) {
      this.router.navigateByUrl('/factoryloader');
    } else if (this.user && Number(this.user.department_id) === FinalConstants.DEPARTMENT_ID_STOCK_MANAGER) {
      this.router.navigateByUrl('/stockmanager');
    } else if (this.user && Number(this.user.department_id) === FinalConstants.DEPARTMENT_ID_PRODUCTION_MANAGER) {
      this.router.navigateByUrl('/productionmanager');
    } else if (this.user && Number(this.user.department_id) === FinalConstants.DEPARTMENT_ID_FINANCE_MANAGER) {
      this.router.navigateByUrl('/financemanager');
    }
  }
}
