import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const childauthGuard: CanActivateFn = (route, state) => {
 
  let islogin = localStorage.getItem('islogin');

  if ( islogin == 'true' ) {
    return true;
  } else {
    const router = inject(Router);
    return router.navigate(['login']);
  }
  
};
