export function loadMenu() {
    const content = document.getElementById('content');
    content.innerHTML = '';

    const headline = document.createElement('h1');
    headline.textContent = "Tandoori Specialties";

    const list = document.createElement('ul');
    list.className = 'menu-list';
    
    const items = ['Paneer Tikka', 'Butter Chicken', 'Tandoori Roti', 'Lassi (Tall Glass)', 'Sarson da Saag', 'Garlic Naan'];
    
    items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        list.appendChild(li);
    });

    content.appendChild(headline);
    content.appendChild(list);
}