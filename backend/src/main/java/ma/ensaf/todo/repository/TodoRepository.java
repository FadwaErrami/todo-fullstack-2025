package ma.ensaf.todo.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import ma.ensaf.todo.entity.Todo;

public interface TodoRepository extends JpaRepository<Todo, Long> {
    List<Todo> findByCompleted(boolean completed);
    List<Todo> findAllByOrderByPriorityDesc();
}
