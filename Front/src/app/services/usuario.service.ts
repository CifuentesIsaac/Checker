import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Server, user } from '../interfaces/interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  // url: string = 'http://localhost:4000/api/'
  url: string = 'https://checker-back-814c03dc40b3.herokuapp.com/api/'

  constructor(private http: HttpClient) { }

  obtenerUsuarios(): Observable<any> {
    return this.http.get<any>(this.url + 'get-users');
  }

  crearUsuario(user: user): Observable<Server> {
    return this.http.post<Server>(this.url + 'new-user', user);
  }

  editarUsuario(id: string, user: user): Observable<Server> {
    return this.http.put<Server>(this.url + 'edit-user/' + id, user);
  }

  eliminarUsuario(id: any): Observable<Server> {
    return this.http.delete<Server>(this.url + 'delete-user/' + id);
  }

  obtenerUsuarioID(id: string): Observable<any> {
    return this.http.get<any>(this.url + 'get-user-id/' + id);
  }
}
