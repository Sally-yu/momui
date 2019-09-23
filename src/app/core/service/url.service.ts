import {Injectable} from '@angular/core';
import j from 'src/assets/config/webconfig.json';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  //配置文件ip(或域名)
  public hostip = j['ORIGIN'];
  //配置文件端口
  public hostport = j['PORT'];
  //如配置了hostname(注册的域名),则使用域名
  public hostname = j['HOSTNAME'] ? j['HOSTNAME'] : this.hostip + this.hostport;


  //FIXME:样例两个,业务中不要调
  public gridUrl = this.hostname + '/grid';
  public loginUrl = this.hostname + '/login';


  /**********************************************************************/
  //TODO:请求后台api的url统一写到该服务下
  /**********************************************************************/







  constructor() {
  }


}
