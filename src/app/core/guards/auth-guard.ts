import { inject, isDevMode } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

/**
 * authGuard: Protege rutas que requieren autenticación.
 * Si el usuario no está logueado, lo redirige a la página de login.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  /**
   * El sistema verifica si la aplicación se encuentra en modo desarrollo.
   * Si es así, permite el acceso total para facilitar las pruebas de UI.
   */
  if (isDevMode()) {
    console.log('🔓 [AuthGuard] Bypass activado: Modo Desarrollo');
    return true;
  }

  // Consultamos el estado del usuario en nuestro servicio
  return authService.user$.pipe(
    // 1. take(1) es vital: toma el valor actual y completa el observable.
    // Los Guards deben completarse para que la navegación continúe.
    take(1),
    map(user => {
      // 2. Si existe el usuario, permitimos el acceso (true)
      if (user) {
        return true;
      }

      // 3. Si no existe, bloqueamos y redirigimos.
      // Pasamos 'returnUrl' como parámetro para saber a dónde quería ir el usuario originalmente.
      return router.createUrlTree(['/auth/login'], { 
        queryParams: { returnUrl: state.url } 
      });
    })
  );
};