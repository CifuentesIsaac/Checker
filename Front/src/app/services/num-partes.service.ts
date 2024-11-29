import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { numParte, Server } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class NumPartesService {

  // url = 'http://localhost:4000/api/';
  url = 'https://checker-back-814c03dc40b3.herokuapp.com/api/'

  constructor(private http: HttpClient) { }

  getNumParte(): Observable<any> {
    return this.http.get<any>(this.url + 'num-parts');
  }

  getNumParteID(id: any): Observable<any> {
    return this.http.get<any>(this.url + 'get-num-part/' + id)
  }

  getNumParteDisable(): Observable<any> {
    return this.http.get<any>(this.url + 'get-disabled-num-parts')
  }

  saveNumPart(numPart: numParte): Observable<any> {
    return this.http.post<any>(this.url + 'new-num', numPart)
  }

  editNumpart(id: string, nupart: numParte): Observable<Server> {
    return this.http.put<Server>(this.url + 'edit-num-part/' + id, nupart)
  }

  disableNumPart(id: string): Observable<any> {
    return this.http.put<any>(this.url + 'disable-num-part/' + id, id)
  }

  enableNumPart(id: string): Observable<any> {
    return this.http.put<any>(this.url + 'enable-num-part/' + id, id)
  }
}
