import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { SessionService } from './services/session';
export const authGuard: CanActivateFn = () => {
  const session = inject(SessionService);
  const router = inject(Router);

  const isLoggedIn = session.isLoggedIn();
  console.log('🧠 AuthGuard check - isLoggedIn:', isLoggedIn);

  if (!isLoggedIn) {
    const tree = router.createUrlTree(['/login']);
    console.log('🔀 Redirecting to /login');
    return tree;
  }

  return true;
};


