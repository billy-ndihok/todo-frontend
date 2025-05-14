import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = 'http://localhost:3000/api/todos';

  private todosSubject = new BehaviorSubject<Todo[]>([]);
  todos$ = this.todosSubject.asObservable();

  constructor(private http: HttpClient) {
    // Charger les todos au démarrage du service
    this.loadAllTodos();
  }

  // Méthode pour charger tous les todos
  loadAllTodos(): void {
    this.http.get<Todo[]>(this.apiUrl)
      .subscribe({
        next: (todos) => this.todosSubject.next(todos),
        error: (err) => console.error('Erreur lors du chargement des todos:', err)
      });
  }

  // Obtenir tous les todos, avec filtrage optionnel par statut
  getTodos(status?: string): Observable<Todo[]> {
    let url = this.apiUrl;
    if (status) {
      url += `?status=${status}`;
    }
    return this.http.get<Todo[]>(url);
  }

  // Obtenir un todo par son ID
  getTodoById(id: number): Observable<Todo> {
    return this.http.get<Todo>(`${this.apiUrl}/${id}`);
  }

  // Créer un nouveau todo
  createTodo(todo: Partial<Todo>): Observable<Todo> {
    return this.http.post<Todo>(this.apiUrl, todo)
      .pipe(
        tap(newTodo => {
          const currentTodos = this.todosSubject.value;
          this.todosSubject.next([...currentTodos, newTodo]);
        })
      );
  }

  // Mettre à jour un todo existant
  updateTodo(id: number, todo: Partial<Todo>): Observable<Todo> {
    return this.http.put<Todo>(`${this.apiUrl}/${id}`, todo)
      .pipe(
        tap(updatedTodo => {
          const currentTodos = this.todosSubject.value;
          const index = currentTodos.findIndex(t => t.id === id);
          if (index !== -1) {
            const updatedTodos = [...currentTodos];
            updatedTodos[index] = { ...updatedTodos[index], ...updatedTodo };
            this.todosSubject.next(updatedTodos);
          }
        })
      );
  }

  // Basculer l'état d'un todo (complété ou non)
  toggleTodoStatus(id: number, completed: boolean): Observable<Todo> {
    return this.http.patch<Todo>(`${this.apiUrl}/${id}/status`, { completed })
      .pipe(
        tap(updatedTodo => {
          const currentTodos = this.todosSubject.value;
          const index = currentTodos.findIndex(t => t.id === id);
          if (index !== -1) {
            const updatedTodos = [...currentTodos];
            updatedTodos[index] = { ...updatedTodos[index], completed: updatedTodo.completed };
            this.todosSubject.next(updatedTodos);
          }
        })
      );
  }

  // Supprimer un todo
  deleteTodo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => {
          const currentTodos = this.todosSubject.value;
          this.todosSubject.next(currentTodos.filter(todo => todo.id !== id));
        })
      );
  }
}
