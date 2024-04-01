import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JWTInterceptor {

    constructor(private authenticationService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        const user = JSON.parse(localStorage.getItem('authenticatedUser'));
        if (user && user.api_token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `${user.api_token}`
                }
            });
        }

        return next.handle(request);
    }
}
