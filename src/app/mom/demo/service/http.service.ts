import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UrlService} from '../../../core/service/url.service';
import {catchError, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    public url: UrlService,
    private http: HttpClient,
  ) {
  }

  //get方法
  get() {
    return this.http.get(this.url.gridUrl).pipe(
      tap(res => {
          //TODO 成功返回的回调
        },
        catchError(err => {
          //TODO 返回出错的回调
          throw new Error(err);
        })
      ),
    );
  }

  //post方法
  post() {
    return this.http.post(this.url.loginUrl, null).pipe(
      tap(res => {
          //TODO 成功返回的回调
        },
        catchError(err => {
          //TODO 返回出错的回调
          throw new Error(err);
        })
      ),
    );
  }


}
