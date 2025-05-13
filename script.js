// Store entries in localStorage
const STORAGE_KEY = 'diary_entries';

// Get entries from localStorage
function getEntries() {
    const entries = localStorage.getItem(STORAGE_KEY);
    return entries ? JSON.parse(entries) : [];
}

// Save entries to localStorage
function saveEntries(entries) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

// Add a new entry
function addEntry(entry) {
    const entries = getEntries();
    entries.push(entry);
    saveEntries(entries);
}

// Get a random entry
function getRandomEntry() {
    const entries = getEntries();
    if (entries.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * entries.length);
    return entries[randomIndex];
}

// Display a random entry on the home page
function displayRandomEntry() {
    const randomEntryDiv = document.getElementById('random-entry-content');
    if (!randomEntryDiv) return;

    const entry = getRandomEntry();
    if (!entry) {
        randomEntryDiv.innerHTML = '<p>No entries yet. Start writing your first diary entry!</p>';
        return;
    }

    randomEntryDiv.innerHTML = `
        <h3>${entry.title}</h3>
        <p class="entry-date">${new Date(entry.date).toLocaleDateString()}</p>
        <div class="entry-content">${entry.content}</div>
        ${entry.image ? `<img src="${entry.image}" alt="Entry image" class="entry-image">` : ''}
    `;
}

// Display all entries on the history page
function displayEntries() {
    const entriesList = document.getElementById('entries-list');
    if (!entriesList) return;

    const entries = getEntries().sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (entries.length === 0) {
        entriesList.innerHTML = '<p>No entries yet. Start writing your first diary entry!</p>';
        return;
    }

    entriesList.innerHTML = entries.map(entry => `
        <div class="entry-card">
            <h3>${entry.title}</h3>
            <p class="entry-date">${new Date(entry.date).toLocaleDateString()}</p>
            <div class="entry-content">${entry.content}</div>
            ${entry.image ? `<img src="${entry.image}" alt="Entry image" class="entry-image">` : ''}
        </div>
    `).join('');
}

// Handle form submission
function handleFormSubmit(event) {
    event.preventDefault();

    const title = document.getElementById('entry-title').value;
    const date = document.getElementById('entry-date').value;
    const content = document.getElementById('entry-content').value;
    const imageFile = document.getElementById('entry-image').files[0];

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const entry = {
                title,
                date,
                content,
                image: e.target.result
            };
            addEntry(entry);
            event.target.reset();
            displayRandomEntry();
            alert('Entry saved successfully!');
        };
        reader.readAsDataURL(imageFile);
    } else {
        const entry = {
            title,
            date,
            content
        };
        addEntry(entry);
        event.target.reset();
        displayRandomEntry();
        alert('Entry saved successfully!');
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Set today's date as default
    const dateInput = document.getElementById('entry-date');
    if (dateInput) {
        dateInput.valueAsDate = new Date();
    }

    // Display random entry on home page
    displayRandomEntry();

    // Display all entries on history page
    displayEntries();

    // Add form submit handler
    const form = document.getElementById('diary-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}); 