export const createTodo = (title, description, dueDate, priority, notes = "") => {
    return {
        title,
        description,
        dueDate,
        priority,
        notes,
        id: crypto.randomUUID(),
        completed: false,
        toggleComplete() { this.completed = !this.completed; }
    };
};