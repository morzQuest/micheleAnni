import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // globale Fehler weiterreichen (window.onerror / unhandledrejection -> ErrorHandler)
    provideBrowserGlobalErrorListeners(),

    // weniger unnötige CD-Zyklen durch Event-Coalescing
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Router + bequeme @Input-Bindung aus Routen-Parametern
    provideRouter(routes, withComponentInputBinding()),

    // HttpClient bereitstellen (mit DI-Interceptors, falls definiert)
    provideHttpClient(withInterceptorsFromDi()),

    // Browser-Animationen (falls du Animationsmodule/Angular Animations nutzt)
    provideAnimations(),
  ]
};
