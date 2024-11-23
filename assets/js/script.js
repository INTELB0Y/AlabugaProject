

const API_URL = 'https://67287885270bd0b975559810.mockapi.io/api/v1/Attractions';

async function fetchAttractions() {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching attractions:', error);
        return [];
    }
}

let currentPage = parseInt(localStorage.getItem('currentPage')) || 1;
const itemsPerPage = 5;
let filteredItems = [];

const savedSearchInput = localStorage.getItem('searchInput') || '';
const savedCategory = localStorage.getItem('category') || 'all';
document.getElementById('searchInput').value = savedSearchInput;

async function applyFilters() {
    const searchInput = localStorage.getItem('searchInput').toLowerCase();
    const category = localStorage.getItem('category');

    const attractions = await fetchAttractions();
    filteredItems = attractions.filter(attraction =>
        (category === 'all' || attraction.category === category) &&
        attraction.name.toLowerCase().includes(searchInput)
    );

    currentPage = 1;
    localStorage.setItem('currentPage', currentPage);
    renderItems();
}

function renderItems() {
    const itemContainer = document.getElementById('itemContainer');
    itemContainer.innerHTML = '';

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = filteredItems.slice(startIndex, endIndex);

    paginatedItems.forEach(attraction => {
        const item = document.createElement('div');
        item.className = 'col item';
        item.setAttribute('data-category', attraction.category);

        const container = document.createElement('div');
        container.className = 'container';

        const front = document.createElement('div');
        front.className = 'front';
        front.style.backgroundImage = `url(${attraction.image})`;

        const frontInner = document.createElement('div');
        frontInner.className = 'inner';
        frontInner.textContent = attraction.name;

        front.appendChild(frontInner);

        const back = document.createElement('div');
        back.className = 'back';

        const backInner = document.createElement('div');
        backInner.className = 'inner';
        backInner.textContent = attraction.description;

        back.appendChild(backInner);

        container.appendChild(front);
        container.appendChild(back);
        item.appendChild(container);

        itemContainer.appendChild(item);
    });

    renderPagination();
}

function renderPagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.onclick = () => {
            currentPage = i;
            localStorage.setItem('currentPage', currentPage);
            renderItems();
        };
        pagination.appendChild(button);
    }
}

async function filterItems() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    localStorage.setItem('searchInput', searchInput);
    await applyFilters();
}

async function filterByCategory(category) {
    localStorage.setItem('category', category);
    await applyFilters();
}

document.addEventListener('DOMContentLoaded', async function() {
    await applyFilters();
});

function openModal(modalId) {
    document.getElementById(modalId).style.display = "block";
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        closeModal(event.target.id);
    }
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('open');
}