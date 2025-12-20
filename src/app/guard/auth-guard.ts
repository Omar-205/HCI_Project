import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const loggedData = localStorage.getItem("token")
  if (loggedData != null) {
    return true;
  }
  else {
    router.navigate(['sign-in']);
    return false; // todo: restore

  }
};
