import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  public hostip='http://212.64.2.48';
  public hostport=':8899';
  public hostname=this.hostip+this.hostport;

  public gridUrl=this.hostname+'/grid';
  public loginUrl=this.hostname+'/login';
  public interUrl=this.hostname+'/inter';
  public demoUrl=this.hostname+'/demo3';

  constructor() { }


}
