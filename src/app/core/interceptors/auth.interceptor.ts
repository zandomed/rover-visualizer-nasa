import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    request = this.addAPIKey(request);
    return next.handle(request);
  }

  private addAPIKey(request: HttpRequest<any>) {
    const token = environment.NASA_API_KEY;
    console.log(token, 'token');
    if (token) {
      request = request.clone({
        setParams: {
          api_key: token,
        },
      });
      return request;
    }
    return request;
  }
}
