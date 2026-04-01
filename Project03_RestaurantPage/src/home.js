export function loadHome() {
    const content = document.getElementById('content');
    content.innerHTML = '';

    const headline = document.createElement('h1');
    headline.textContent = "Desi Dhaba Kitchen";

    const description = document.createElement('p');
    description.textContent = "Authentic North Indian flavors served straight from the tandoor. Experience the rustic charm of highway dining with our world-famous Dal Makhani and Butter Naan.";

    content.appendChild(headline);
    content.appendChild(description);
}