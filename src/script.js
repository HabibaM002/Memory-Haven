
let appState = {
    photos: [],
    reminders: [],
    journalEntries: [],
    emergencyContacts: [],
    personName: 'Dear Friend',
    isDarkMode: false
};


function initializeApp() {
    updateDateTime();
    setInterval(updateDateTime, 60000); 
    updateGreeting();
    loadExistingData();
}

// Update date and time display
function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    document.getElementById('dateTime').textContent = now.toLocaleDateString('en-GB', options);
}


function updateGreeting() {
    const hour = new Date().getHours();
    let greeting = 'Hello';
    
    if (hour < 12) greeting = 'Good Morning';
    else if (hour < 17) greeting = 'Good Afternoon';
    else greeting = 'Good Evening';
    
    document.getElementById('greeting').textContent = `${greeting}, ${appState.personName}!`;
}

function toggleDarkMode() {
    appState.isDarkMode = !appState.isDarkMode;
    document.body.classList.toggle('dark-mode', appState.isDarkMode);
}


function addPhoto() {
    const name = document.getElementById('photoName').value.trim();
    const description = document.getElementById('photoDesc').value.trim();
    const fileInput = document.getElementById('photoFile');
    
    if (!name || !description) {
        showNotification('Please fill in both name and description!');
        return;
    }
    
    
    const photo = {
        name: name,
        description: description,
        imageUrl: 'assets/images/default-photo.jpg', 
        dateAdded: new Date().toLocaleDateString('en-GB')
    };
    
    // If user uploaded a file, use it
    if (fileInput.files && fileInput.files[0]) {
        photo.imageUrl = URL.createObjectURL(fileInput.files[0]);
    }
    
    
    appState.photos.push(photo);
    displayPhotos();
    clearPhotoForm();
    showNotification('Added to your collection!');
}

function displayPhotos() {
    const gallery = document.getElementById('photoGallery');
    
    
    
    
    // Add new photos
    appState.photos.forEach(photo => {
        const photoCard = document.createElement('div');
        photoCard.className = 'photo-card user-added';
        photoCard.innerHTML = `
            <img src="${photo.imageUrl}" alt="${photo.name}" class="photo-image">
            <div class="photo-name">${photo.name}</div>
            <div class="photo-description">${photo.description}</div>
        `;
        gallery.appendChild(photoCard);
    });
}

function clearPhotoForm() {
    document.getElementById('photoName').value = '';
    document.getElementById('photoDesc').value = '';
    document.getElementById('photoFile').value = '';
}


function addReminder() {
    const text = document.getElementById('reminderText').value.trim();
    const time = document.getElementById('reminderTime').value;
    
    if (!text || !time) {
        showNotification('Please enter both reminder text and time!');
        return;
    }
    
    appState.reminders.push({
        content: text,
        time: time
    });
    
    displayReminders();
    clearReminderForm();
    showNotification('Reminder added to your list!');
}

function displayReminders() {
    const list = document.getElementById('remindersList');
    
   
    appState.reminders.forEach(reminder => {
        const item = document.createElement('li');
        item.className = 'reminder-item user-added';
        item.innerHTML = `
            <span>${reminder.content}</span>
            <span class="reminder-time">${formatTime(reminder.time)}</span>
        `;
        list.appendChild(item);
    });
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
}

function clearReminderForm() {
    document.getElementById('reminderText').value = '';
    document.getElementById('reminderTime').value = '';
}


function addJournalEntry() {
    const content = document.getElementById('journalEntry').value.trim();
    
    if (!content) {
        showNotification('Please write something in your journal!');
        return;
    }
    
    const entry = {
        content: content,
        date: new Date().toLocaleDateString('en-GB', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }),
        time: new Date().toLocaleTimeString('en-GB', { 
            hour: '2-digit', 
            minute: '2-digit' 
        })
    };
    
    appState.journalEntries.unshift(entry); 
    displayJournalEntries();
    document.getElementById('journalEntry').value = '';
    showNotification(' Journal entry saved!');
}

function displayJournalEntries() {
    const container = document.getElementById('journalEntries');
    container.innerHTML = '';
    
    if (appState.journalEntries.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #888; font-style: italic;">No journal entries yet. Start writing your thoughts above!</p>';
        return;
    }
    
    appState.journalEntries.forEach(entry => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'journal-entry';
        entryDiv.innerHTML = `
            <div class="journal-date">${entry.date} at ${entry.time}</div>
            <div class="journal-content">${entry.content}</div>
        `;
        container.appendChild(entryDiv);
    });
}


function addContact() {
    const name = document.getElementById('contactName').value.trim();
    const phone = document.getElementById('contactPhone').value.trim();
    const relation = document.getElementById('contactRelation').value.trim();
    
    if (!name || !phone || !relation) {
        showNotification('Please fill in all contact fields!');
        return;
    }
    
    appState.emergencyContacts.push({
        name: name,
        phone: phone,
        relation: relation,
        dateAdded: new Date().toLocaleDateString()
    });
    
    displayContacts();
    clearContactForm();
    showNotification(' Emergency contact added!');
}

function displayContacts() {
    const container = document.getElementById('contactList');
    
    
   
    
    
    // Add new contacts
    appState.emergencyContacts.forEach(contact => {
        const contactDiv = document.createElement('div');
        contactDiv.className = 'contact-card user-added';
        contactDiv.innerHTML = `
            <div class="contact-name">${contact.name}</div>
            <div class="contact-phone"> ${contact.phone}</div>
            <div class="contact-relation">${contact.relation}</div>
        `;
        container.appendChild(contactDiv);
    });
}

function clearContactForm() {
    document.getElementById('contactName').value = '';
    document.getElementById('contactPhone').value = '';
    document.getElementById('contactRelation').value = '';
}


function showNotification(message) {
    document.getElementById('notificationText').textContent = message;
    document.getElementById('notification').classList.add('show');
    

    setTimeout(() => {
        document.getElementById('notification').classList.remove('show');
    }, 4000);
}

function closeNotification() {
    document.getElementById('notification').classList.remove('show');
}


function loadExistingData() {
    displayPhotos();
    displayReminders();
    displayJournalEntries();
    displayContacts();
}

// Initialize when page loads
window.addEventListener('load', initializeApp);