// Файл hamsters.js

const API_URL = 'http://localhost:8000/api/hamsters/';

// Переключення вкладок
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelector('.tab.active').classList.remove('active');
        document.querySelector('.tab-content.active').classList.remove('active');

        const tabId = this.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
        this.classList.add('active');
    });
});

// Функція для отримання всіх хом'яків
function fetchHamsters() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            displayHamsters(data);
        });
}

// Виведення хом'яків на сторінку
function displayHamsters(hamsters) {
    const hamsterContainer = document.getElementById('hamsters');
    hamsterContainer.innerHTML = '';

    hamsters.forEach(hamster => {
        const hamsterDiv = document.createElement('div');
        hamsterDiv.innerHTML = `
            <h3>${hamster.name}</h3>
            <p>${hamster.description}</p>
            <p>Price: ${hamster.price}</p>
            <button onclick="deleteHamster(${hamster.id})">Delete</button>
            <button onclick="editHamster(${hamster.id})">Edit</button>
        `;
        hamsterContainer.appendChild(hamsterDiv);
    });
}

// Додавання нового хом'яка
document.getElementById('hamsterForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;

    const newHamster = { name, description, price };

    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newHamster),
    }).then(() => {
        fetchHamsters();  // Оновлюємо список хом'яків після додавання
    });
});

// Видалення хом'яка
function deleteHamster(id) {
    fetch(`${API_URL}${id}/`, {
        method: 'DELETE',
    }).then(() => {
        fetchHamsters();  // Оновлюємо список після видалення
    });
}

// Редагування хом'яка
function editHamster(id) {
    const name = prompt("Enter new name:");
    const description = prompt("Enter new description:");
    const price = prompt("Enter new price:");

    const updatedHamster = { name, description, price };

    fetch(`${API_URL}${id}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedHamster),
    }).then(() => {
        fetchHamsters();  // Оновлюємо список після редагування
    });
}

// Фільтрація хом'яків за ціною
document.getElementById('filterButton').addEventListener('click', function() {
    const minPrice = document.getElementById('minPrice').value;
    const maxPrice = document.getElementById('maxPrice').value;

    const url = `${API_URL}?price__gte=${minPrice}&price__lte=${maxPrice}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayHamsters(data);
        });
});

// Завантаження всіх хом'яків при завантаженні сторінки
fetchHamsters();
