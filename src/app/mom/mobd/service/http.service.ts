import {Injectable} from '@angular/core';
import {catchError, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {UrlService} from '../../../core/service/url.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient,
    private url: UrlService
  ) {
  }

  //js回调方式
  // grid() {
  //   return new Promise(((resolve, reject) => this.http.get(this.url.gridUrl).toPromise().then(res => {
  //     resolve(res);
  //   }, error => {
  //     reject(false)
  //   })));
  // }

  //rxjs回调方式
  grid() {
    return this.http.get(this.url.gridUrl).pipe(
      tap(res => {
        console.log(res);
      }),
      catchError((err) => {
        throw  new Error(err.message);
      })
    );
  }

}
