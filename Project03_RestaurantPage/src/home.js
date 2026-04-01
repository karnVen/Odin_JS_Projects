export function loadHome() {
    const content = document.getElementById('content');
    content.innerHTML = ''; // Clear previous content

    const headline = document.createElement('h1');
    headline.textContent = "Welcome to The Golden Griffin";

    const description = document.createElement('p');
    description.textContent = "The finest dining experience in the kingdom, where every meal is a quest fulfilled.";

    content.appendChild(headline);
    content.appendChild(description);
}