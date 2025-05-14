import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Todo } from '../../models/todo.model';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule
  ],
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss']
})
export class TodoItemComponent implements OnInit {
  @Input() todo!: Todo;
  @Output() deleted = new EventEmitter<Todo>();

  constructor(
    private dialog: MatDialog,
    private todoService: TodoService
  ) {}

  ngOnInit(): void {}

  toggleStatus(): void {
    this.todoService.toggleTodoStatus(this.todo.id, !this.todo.completed).subscribe();
  }

  editTodo(): void {
    const dialogRef = this.dialog.open(TodoFormComponent, {
      width: '500px',
      data: { todo: this.todo }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // La mise à jour est gérée dans le formulaire et le service
      }
    });
  }

  deleteTodo(): void {
    this.deleted.emit(this.todo);
  }
}
