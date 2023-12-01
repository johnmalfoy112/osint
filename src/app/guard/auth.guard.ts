import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
    if (authService.isAuthenticated()) {
    return true;
  } else {
    const router = inject(Router);
    return router.navigate(['login']);
  }
  
};
