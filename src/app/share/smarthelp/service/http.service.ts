import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    public http: HttpClient
  ) {
  }


  get(url: string, headers?: HttpHeaders) {
    const obj = headers ? this.http.get(url, {headers: headers}) : this.http.get(url);
    return obj.pipe(
      tap(res => {
        console.log(res);
      }, catchError(err => {
        throw new Error(err);
      }))
    );
  }

  post(url: string, headers?: HttpHeaders, body?: any) {
    const obj = headers ? this.http.post(url, body ? body : null, {headers: headers}) :
      this.http.post(url, body ? body : null);
    return obj.pipe(
      tap(res => {

      }, catchError(err => {
        throw new Error(err);
      }))
    );
  }


  postPage(url: string, index: number, pagesize: number, headers?: HttpHeaders, body?: any) {
    index = index ? index : 0;
    pagesize = pagesize ? pagesize : 10;
    if (body) {
      if (!body.hasOwnProperty('index')) {
        body['index'] = index;
      }
      if (!body.hasOwnProperty('pagesize')) {
        body['pagesize'] = pagesize;
      }
    } else {
      body = {
        index: index,
        pagesize: pagesize,
      };
    }
    const obj = headers ? this.http.post(url, body, {headers: headers}) :
      this.http.post(url, body);
    return obj.pipe(
      tap(res => {

      }, catchError(err => {
        throw new Error(err);
      }))
    );
  }

}
