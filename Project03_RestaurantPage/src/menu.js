export function loadMenu() {
    const content = document.getElementById('content');
    content.innerHTML = '';

    const headline = document.createElement('h1');
    headline.textContent = "Our Menu";

    const list = document.createElement('ul');
    const items = ['Dragon Wings', 'Mystic Mushroom Soup', 'Knight\'s Feast Roast'];
    
    items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        list.appendChild(li);
    });

    content.appendChild(headline);
    content.appendChild(list);
}