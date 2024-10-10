import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { LoginService } from '../services/login.service';

export const validAccessGuard: CanActivateFn = () => {

  const login = inject(LoginService);
  const router = inject(Router);

  if(login.loggedIn()){
    return true;
  }
  router.navigate(['login']);
  return true;
  
};
