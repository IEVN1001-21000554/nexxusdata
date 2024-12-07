import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('token');
    const isAuthRoute = state.url.startsWith('/auth');

    if (token) {
      if (isAuthRoute) {
        this.router.navigate(['/dashboard']); // Redirige al Dashboard si intenta acceder a /auth
        return false;
      }
      return true; // Permite acceso a rutas protegidas
    }

    if (!isAuthRoute) {
      this.router.navigate(['/auth/login']); // Redirige al login si no está autenticado
    }

    return !token; // Permite acceso a las rutas de autenticación si no hay token
  }
}
