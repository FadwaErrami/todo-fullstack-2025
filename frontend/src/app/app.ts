import { Component, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CdkDragDrop, CdkDrag, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TodoService } from './services/todo.service';
import { Todo } from './models/todo.model';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule, 
    MatIconModule, 
    MatButtonModule,
    CdkDrag,
    CdkDropList,
    CdkDropListGroup
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  todos = signal<Todo[]>([]);
  isLoading = signal(true);
  isDark = signal(window.matchMedia('(prefers-color-scheme: dark)').matches);

  // Listes pour le drag and drop
  todo = signal<Todo[]>([]);
  done = signal<Todo[]>([]);

  // Champs pour le formulaire
  newTodoTitle = signal('');
  newTodoDescription = signal('');
  newTodoPriority = signal<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');

  constructor(private todoService: TodoService) {
    this.loadTodos();

    // Dark mode auto
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', e => this.isDark.set(e.matches));
    effect(() => document.documentElement.dataset['theme'] = this.isDark() ? 'dark' : 'light');
  }

  loadTodos() {
    this.todoService.getTodos().subscribe({
      next: (data) => {
        this.todos.set(data);
        // Séparer les todos en deux listes (à faire / terminées)
        this.todo.set(data.filter(item => !item.completed));
        this.done.set(data.filter(item => item.completed));
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  addTodo() {
    const title = this.newTodoTitle().trim();
    if (!title) return;

    const newTodo: Todo = {
      title,
      completed: false,
      description: this.newTodoDescription(),
      priority: this.newTodoPriority()
    };

    this.todoService.addTodo(newTodo).subscribe(todo => {
      this.todos.update(t => [...t, todo]);
      this.todo.update(t => [...t, todo]);
      this.newTodoTitle.set('');
      this.newTodoDescription.set('');
      this.newTodoPriority.set('MEDIUM');
    });
  }

  toggle(todo: Todo) {
    const completed = !todo.completed;
    this.todoService.updateTodo({ ...todo, completed }).subscribe(() => {
      this.todos.update(t => t.map(x => x.id === todo.id ? { ...x, completed } : x));
      
      // Mettre à jour les listes drag and drop
      if (completed) {
        // Déplacer de "todo" vers "done"
        this.todo.update(t => t.filter(x => x.id !== todo.id));
        this.done.update(d => [...d, { ...todo, completed }]);
      } else {
        // Déplacer de "done" vers "todo"
        this.done.update(d => d.filter(x => x.id !== todo.id));
        this.todo.update(t => [...t, { ...todo, completed }]);
      }
    });
  }

  deleteTodo(id?: number) {
    if (!id) return;
    this.todoService.deleteTodo(id).subscribe(() => {
      this.todos.update(t => t.filter(x => x.id !== id));
      this.todo.update(t => t.filter(x => x.id !== id));
      this.done.update(d => d.filter(x => x.id !== id));
    });
  }

  toggleTheme() {
    this.isDark.set(!this.isDark());
  }

  drop(event: CdkDragDrop<Todo[]>) {
    if (event.previousContainer === event.container) {
      // Déplacement dans la même liste
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Déplacement entre listes
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // Mettre à jour l'état completed selon la liste
      const movedTodo = event.container.data[event.currentIndex];
      const completed = event.container.id === 'done-list';
      
      this.todoService.updateTodo({ ...movedTodo, completed }).subscribe(updatedTodo => {
        // Mettre à jour les données locales
        this.todos.update(t => t.map(x => x.id === updatedTodo.id ? updatedTodo : x));
        
        // Forcer la mise à jour des signaux
        if (completed) {
          this.done.update(d => d.map(x => x.id === updatedTodo.id ? updatedTodo : x));
        } else {
          this.todo.update(t => t.map(x => x.id === updatedTodo.id ? updatedTodo : x));
        }
      });
    }
  }
}