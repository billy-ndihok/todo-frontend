import { Pipe, PipeTransform } from '@angular/core';
import { Todo } from '../models/todo.model';

@Pipe({
  name: 'filterTodos',
  standalone: true,
  pure: false // Pour détecter les changements dans les objets
})
export class FilterTodosPipe implements PipeTransform {
  transform(todos: Todo[], filterType?: string, searchTerm?: string): Todo[] {
    if (!todos) {
      return [];
    }

    // Filtrer par type (completed/incompleted)
    let filteredTodos = todos;
    if (filterType === 'completed') {
      filteredTodos = todos.filter(todo => todo.completed);
    } else if (filterType === 'incompleted') {
      filteredTodos = todos.filter(todo => !todo.completed);
    }

    // Filtrer par terme de recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredTodos = filteredTodos.filter(
        todo =>
          todo.title.toLowerCase().includes(term) ||
          (todo.description && todo.description.toLowerCase().includes(term))
      );
    }

    return filteredTodos;
  }
}
