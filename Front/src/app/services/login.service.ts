import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { LoginResponse } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  url: string = 'http://localhost:4000/api/'

  constructor(private http: HttpClient, private router: Router) { }

  login(Employe_ID: number, Password: String): Observable<LoginResponse>{
    return this.http.post<LoginResponse>(this.url + 'login', {Employee_ID: Employe_ID, Password: Password});
  }

  loggedIn(){
    return !!sessionStorage.getItem('jwt');
  }

  logOut(){
    sessionStorage.clear();
    this.router.navigate(['login']);
  }
}
