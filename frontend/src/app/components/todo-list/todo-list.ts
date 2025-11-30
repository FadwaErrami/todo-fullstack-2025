import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { Todo } from '../../models/todo.model';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.scss',
})
export class TodoList implements OnInit {

  todos = signal<Todo[]>([]);
  loading = signal(true);

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos() {
    this.loading.set(true);
    this.todoService.getTodos().subscribe(data => {
      this.todos.set(data);
      this.loading.set(false);
    });
  }

  addTodo(title: string) {
    title = title.trim();
    if (!title) return;

    this.todoService.addTodo({ title, completed: false })
      .subscribe(todo => {
        this.todos.update(list => [...list, todo]);
      });
  }

  toggle(todo: Todo) {
    const updated = { ...todo, completed: !todo.completed };

    this.todoService.updateTodo(updated).subscribe(() => {
      this.todos.update(list =>
        list.map(t => t.id === updated.id ? updated : t)
      );
    });
  }

  delete(todo: Todo) {
    this.todoService.deleteTodo(todo.id!).subscribe(() => {
      this.todos.update(list => list.filter(t => t.id !== todo.id));
    });
  }
}
