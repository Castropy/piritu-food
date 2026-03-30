import { 
  ApplicationConfig, 
  // 1. Cambiamos provideZoneChangeDetection por este:
  provideZonelessChangeDetection 
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

// Firebase core
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

import { routes } from './app.routes';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    // 2. Sustituimos provideZoneChangeDetection
    provideZonelessChangeDetection(), 
    
    provideRouter(routes),
    provideClientHydration(withEventReplay()),

    // --- Configuración de Firebase ---
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ]
};