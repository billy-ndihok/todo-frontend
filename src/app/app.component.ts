import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton, MatFabButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltip } from '@angular/material/tooltip';
import { TodoFormComponent } from './components/todo-form/todo-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbar,
    MatFabButton,
    MatIcon,
    MatTooltip,
    MatDialogModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Todo Kanban App';

  constructor(private dialog: MatDialog) {}

  openAddTodoDialog(): void {
    const dialogRef = this.dialog.open(TodoFormComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      // Si result est true, un todo a été ajouté
    });
  }
}
