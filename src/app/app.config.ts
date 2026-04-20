import { 
  ApplicationConfig, 
  provideZonelessChangeDetection 
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// Firebase core
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

import { routes } from './app.routes';
import { environment } from '../environments/environment';

// ✅ CORRECCIÓN: Importación desde el punto de entrada oficial
import { DialogService } from 'primeng/dynamicdialog';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(), 
    
    provideRouter(routes),
    provideClientHydration(withEventReplay()),

    provideAnimationsAsync(),
    
    // ✅ Mantenemos el DialogService aquí como provider global
    DialogService,

    // --- Configuración de Firebase ---
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ]
};