package exception;

public class TodoNotFoundException extends RuntimeException {

    private static final long serialVersionUID = 1L; // <- ajoute ceci

    public TodoNotFoundException(Long id) {
        super("Todo introuvable avec l'id : " + id);
    }
}
