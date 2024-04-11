import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CsrfInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const csrfToken = this.getCookie('csrftoken');
    const csrfReq = req.clone({
      headers: req.headers.set('X-CSRFToken', csrfToken)
    });
    return next.handle(csrfReq);
  }

  private getCookie(name: string): string {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
          const part = parts.pop();
          if (part !== undefined) {
              return part.split(';').shift() || '';
          }
      }
      return '';
  }

}
