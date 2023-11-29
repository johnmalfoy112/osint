import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const authGuard: CanActivateFn = (route, state) => {

  let islogin = localStorage.getItem('islogin');

  if ( islogin == 'true' ) {
    return true;
  } else {
    const router = inject(Router);
    return router.navigate(['login']);
  }
};
