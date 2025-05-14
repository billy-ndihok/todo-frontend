import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem, CdkDropList } from '@angular/cdk/drag-drop';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { TodoService } from '../../services/todo.service';
import { NotificationService } from '../../services/notification.service';
import { Todo } from '../../models/todo.model';
import { Observable, combineLatest, of } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { FilterTodosPipe } from '../../pipes/filter-todos.pipe';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    DragDropModule,
    TodoItemComponent
  ],
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss']
})
export class KanbanBoardComponent implements OnInit {
  @ViewChild('todoList') todoList!: CdkDropList;
  @ViewChild('doneList') doneList!: CdkDropList;

  todos$: Observable<Todo[]>;
  completedTodos$: Observable<Todo[]>;
  incompleteTodos$: Observable<Todo[]>;

  completedTodosFiltered$: Observable<Todo[]> = of([]);
  incompleteTodosFiltered$: Observable<Todo[]> = of([]);

  searchControl = new FormControl('');
  filterTodosPipe = new FilterTodosPipe();

  constructor(
    private todoService: TodoService,
    private notificationService: NotificationService
  ) {
    this.todos$ = this.todoService.todos$;

    this.completedTodos$ = this.todos$.pipe(
      map(todos => todos.filter(todo => todo.completed))
    );

    this.incompleteTodos$ = this.todos$.pipe(
      map(todos => todos.filter(todo => !todo.completed))
    );

    this.initFilteredTodos();
  }

  ngOnInit(): void {}

  private initFilteredTodos(): void {
    const search$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      map(value => value || '')
    );

    this.completedTodosFiltered$ = combineLatest([
      this.completedTodos$,
      search$
    ]).pipe(
      map(([todos, searchTerm]) =>
        this.filterTodosPipe.transform(todos, 'completed', searchTerm)
      )
    );

    this.incompleteTodosFiltered$ = combineLatest([
      this.incompleteTodos$,
      search$
    ]).pipe(
      map(([todos, searchTerm]) =>
        this.filterTodosPipe.transform(todos, 'incompleted', searchTerm)
      )
    );
  }

  drop(event: CdkDragDrop<Todo[]>): void {
    if (event.previousContainer === event.container) {
      // Si on reste dans la même colonne
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Détermine le nouveau statut basé sur l'identité de la liste de destination
      // Nous utilisons l'identité des objets CdkDropList
      const newStatus = event.container === this.doneList;

      // Garde une référence à l'élément avant de le déplacer
      const todoToUpdate = event.previousContainer.data[event.previousIndex];
      const todoTitle = todoToUpdate.title;

      // Effectue le transfert visuel
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // Met à jour le statut côté serveur
      this.todoService.toggleTodoStatus(todoToUpdate.id, newStatus).subscribe({
        next: () => {
          // Message basé sur la nouvelle destination, pas sur l'état du todo
          const statusMessage = newStatus ? 'terminée' : 'à faire';
          this.notificationService.success(`Tâche "${todoTitle}" marquée comme ${statusMessage}`);
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour du statut:', err);
          this.notificationService.error('Impossible de mettre à jour le statut');

          // Annuler l'action en cas d'erreur
          transferArrayItem(
            event.container.data,
            event.previousContainer.data,
            event.currentIndex,
            event.previousIndex
          );
        }
      });
    }
  }

  deleteTodo(todo: Todo): void {
    this.todoService.deleteTodo(todo.id).subscribe({
      next: () => {
        this.notificationService.success(`Tâche "${todo.title}" supprimée`);
      },
      error: (err) => {
        console.error('Erreur lors de la suppression:', err);
        this.notificationService.error('Impossible de supprimer la tâche');
      }
    });
  }
}
