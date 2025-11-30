package ma.ensaf.todo.controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import ma.ensaf.todo.entity.Todo;
import ma.ensaf.todo.service.TodoService;

@RestController
@RequestMapping("/api/todos")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class TodoController {

    private final TodoService service;

    public TodoController(TodoService service) {
        this.service = service;
    }

    @GetMapping
    public List<Todo> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Todo findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Todo create(@Valid @RequestBody Todo todo) {
        return service.create(todo);
    }

    @PutMapping("/{id}")
    public Todo update(@PathVariable Long id, @Valid @RequestBody Todo todo) {
        return service.update(id, todo);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    // Filtrer par statut complété
    @GetMapping("/completed")
    public List<Todo> getCompletedTodos(@RequestParam boolean completed) {
        return service.findByCompleted(completed);
    }

    // Trier par priorité
    @GetMapping("/by-priority")
    public List<Todo> getTodosByPriority() {
        return service.findAllByPriority();
    }

    // Marquer toutes les todos comme complétées
    @PutMapping("/complete-all")
    public List<Todo> completeAllTodos() {
        return service.completeAll();
    }
}
