import { Component, OnInit, Inject, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.model';
import { AutoFocusDirective } from '../../directives/auto-focus.directive';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    AutoFocusDirective
  ],
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss']
})
export class TodoFormComponent implements OnInit {
  todoForm: FormGroup;
  isEditMode = false;
  dialogTitle = 'Ajouter une tâche';

  constructor(
    private fb: FormBuilder,
    private todoService: TodoService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<TodoFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { todo: Todo }
  ) {
    // Création du formulaire avec seulement les champs présents dans le backend
    this.todoForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''], // Optionnel
      completed: [false]
    });

    // Si on a des données, on est en mode édition
    if (data && data.todo) {
      this.isEditMode = true;
      this.dialogTitle = 'Modifier la tâche';
      this.todoForm.patchValue({
        title: data.todo.title,
        description: data.todo.description || '', // Gestion du cas où description est undefined
        completed: data.todo.completed
      });
    }
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.todoForm.invalid) {
      return;
    }

    const todoData = this.todoForm.value;

    if (this.isEditMode) {
      this.todoService.updateTodo(this.data.todo.id, todoData).subscribe({
        next: () => {
          this.notificationService.success('Tâche mise à jour avec succès');
          this.dialogRef.close(true);
        },
        error: err => {
          console.error('Erreur lors de la mise à jour:', err);
          this.notificationService.error('Erreur lors de la mise à jour de la tâche');
        }
      });
    } else {
      this.todoService.createTodo(todoData).subscribe({
        next: () => {
          this.notificationService.success('Tâche ajoutée avec succès');
          this.dialogRef.close(true);
        },
        error: err => {
          console.error('Erreur lors de la création:', err);
          this.notificationService.error('Erreur lors de la création de la tâche');
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
