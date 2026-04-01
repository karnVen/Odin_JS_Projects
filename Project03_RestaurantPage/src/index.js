import './style.css'; // Add this at the very top


import { loadHome } from './home';
import { loadMenu } from './menu';

// ... rest of your code
// Initial Load
loadHome();

// Tab Switching Logic
document.getElementById('home-btn').addEventListener('click', loadHome);
document.getElementById('menu-btn').addEventListener('click', loadMenu);
document.getElementById('about-btn').addEventListener('click', () => {
    const content = document.getElementById('content');
    content.innerHTML = '<h1>About Us</h1><p>Founded in 1204 by a hungry wizard.</p>';
});