package ma.ensaf.todo.service;

import java.util.List;
import org.springframework.stereotype.Service;
import ma.ensaf.todo.entity.Todo;
import exception.TodoNotFoundException;
import ma.ensaf.todo.repository.TodoRepository;

@Service
public class TodoService {

    private final TodoRepository repository;

    public TodoService(TodoRepository repository) {
        this.repository = repository;
    }

    public List<Todo> findAll() {
        return repository.findAll();
    }

    public Todo create(Todo todo) {
        return repository.save(todo);
    }

    public Todo update(Long id, Todo todo) {
        Todo existing = repository.findById(id)
                .orElseThrow(() -> new TodoNotFoundException(id));
        existing.setTitle(todo.getTitle());
        existing.setDescription(todo.getDescription());
        existing.setCompleted(todo.isCompleted());
        existing.setPriority(todo.getPriority());
        return repository.save(existing);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) throw new TodoNotFoundException(id);
        repository.deleteById(id);
    }

    public Todo findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new TodoNotFoundException(id));
    }

    public List<Todo> findByCompleted(boolean completed) {
        return repository.findByCompleted(completed);
    }

    public List<Todo> findAllByPriority() {
        return repository.findAllByOrderByPriorityDesc();
    }

    public List<Todo> completeAll() {
        List<Todo> todos = repository.findAll();
        todos.forEach(todo -> todo.setCompleted(true));
        return repository.saveAll(todos);
    }
}

