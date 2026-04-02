import { format } from 'date-fns';

export const renderTodos = (project) => {
    const container = document.getElementById('todo-list');
    container.innerHTML = '';

    project.todos.forEach(todo => {
        const div = document.createElement('div');
        div.className = `todo-item priority-${todo.priority}`;
        
        // Use date-fns for formatting
        const dateStr = format(new Date(todo.dueDate), 'MMM do, yyyy');

        div.innerHTML = `
            <h3>${todo.title}</h3>
            <p>${dateStr}</p>
            <button class="del-btn" data-id="${todo.id}">Delete</button>
        `;
        container.appendChild(div);
    });
};