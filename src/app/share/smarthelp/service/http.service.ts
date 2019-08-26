import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient
  ) {
  }


  get(url: string, headers?: HttpHeaders) {
    const obj = headers ? this.http.get(url, {headers: headers}) : this.http.get(url);
    return obj.pipe(
      tap(res => {

      }, catchError(err => {
        throw new Error(err);
      }))
    );
  }

  post(url: string, headers?: HttpHeaders, body?: any) {
    const obj = headers ? this.http.post(url, body ? body : null, {headers: headers}) : this.http.post(url, body ? body : null);
    return obj.pipe(
      tap(res => {

      }, catchError(err => {
        throw new Error(err);
      }))
    );
  }

}
