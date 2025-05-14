import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private snackBar: MatSnackBar) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Une erreur est survenue';

        if (error.error instanceof ErrorEvent) {
          // Erreur côté client
          errorMessage = `Erreur: ${error.error.message}`;
        } else {
          // Erreur côté serveur
          errorMessage = `Erreur ${error.status}: ${error.message}`;

          // Messages personnalisés selon le code d'erreur
          switch (error.status) {
            case 404:
              errorMessage = 'Ressource non trouvée';
              break;
            case 401:
              errorMessage = 'Non autorisé';
              break;
            case 403:
              errorMessage = 'Accès refusé';
              break;
            case 500:
              errorMessage = 'Erreur serveur';
              break;
          }
        }

        // Afficher le message d'erreur
        this.snackBar.open(errorMessage, 'Fermer', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar']
        });

        return throwError(() => error);
      })
    );
  }
}
