import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FinalConstants} from './final-constants';
import {Observable} from 'rxjs';
import {User} from '../models/user';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User;

  constructor(private httpClient: HttpClient, private router: Router) {
  }

  login(username, password): Observable<any> {
    return this.httpClient.post(FinalConstants.API_URL + '/login', {
      username: username,
      password: password
    });
  }

  logout() {
    const user = this.getAndParseUserDataInLocalStorage();
    this.httpClient
      .get(FinalConstants.API_URL + '/logout?id=' + user.id)
      .subscribe(result => {
        if (result['result']) {
          this.router.navigateByUrl('/');
        }
      });
    localStorage.removeItem(FinalConstants.AUTHENTICATED_USER_LABEL);
  }

  getUserName(): string {
    if (this.isAuthenticated()) {
      return this.getAndParseUserDataInLocalStorage().username;
    }
  }

  isAuthenticated(): boolean {
    return Boolean(this.getAndParseUserDataInLocalStorage());
  }

  getAndParseUserDataInLocalStorage() {
    return JSON.parse(
      localStorage.getItem(FinalConstants.AUTHENTICATED_USER_LABEL)
    );
  }

  getUserDepartmentId() {
    return Number(this.getAndParseUserDataInLocalStorage().department_id);
  }
}
