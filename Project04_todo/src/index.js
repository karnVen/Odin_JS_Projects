import './style.css';
import { Project } from './modules/project.js';
import { createTodo } from './modules/todo.js';
import { renderTodos } from './modules/dom.js';

// 1. Select the buttons from the DOM
const openModalBtn = document.getElementById('open-modal-btn');
const todoModal = document.getElementById('todo-modal');
const closeModalBtn = document.getElementById('close-modal');
const todoForm = document.getElementById('todo-form');

// 2. Logic to open/close the Modal (Task Button)
openModalBtn.addEventListener('click', () => {
    todoModal.showModal(); // Opens the <dialog>
});

closeModalBtn.addEventListener('click', () => {
    todoModal.close();
});

// 3. Handle Form Submission
todoForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Stop page refresh

    // Get data from form
    const title = document.getElementById('todo-title').value;
    const desc = document.getElementById('todo-desc').value;
    const date = document.getElementById('todo-date').value;
    const priority = document.getElementById('todo-priority').value;

    // Create the todo and update UI (Example logic)
    console.log("New Task Created:", title, priority);
    
    todoForm.reset();
    todoModal.close();
});