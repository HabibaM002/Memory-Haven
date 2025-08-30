let appState = {
    photos: [],
    reminders: [],
    journalEntries: [],
    emergencyContacts: [],
    personName: 'Dear Friend',
    isDarkMode: false
};

// start everything when page loads
function initializeApp() {
    updateDateTime();
    setInterval(updateDateTime, 60000); 
    updateGreeting();
    loadExistingData();
}


function updateDateTime() {
    const now = new Date();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const dayName = dayNames[now.getDay()];
    const monthName = monthNames[now.getMonth()];
    const day = now.getDate();
    const year = now.getFullYear();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    // format the time
    const timeString = dayName + ', ' + monthName + ' ' + day + ', ' + year + ' at ' + hours + ':' + (minutes < 10 ? '0' + minutes : minutes);
    
    document.getElementById('dateTime').textContent = timeString;
}

// change greeting based on time
function updateGreeting() {
    const hour = new Date().getHours();
    let greeting = 'Hello';
    
    if (hour < 12) {
        greeting = 'Good Morning';
    } else if (hour < 17) {
        greeting = 'Good Afternoon';
    } else {
        greeting = 'Good Evening';
    }
    
    document.getElementById('greeting').textContent = greeting + ', ' + appState.personName + '!';
}

function toggleDarkMode() {
    if (appState.isDarkMode == true) {
        appState.isDarkMode = false;
        document.body.classList.remove('dark-mode');
    } else {
        appState.isDarkMode = true;
        document.body.classList.add('dark-mode');
    }
}

// add photos to the gallery
function addPhoto() {
    const name = document.getElementById('photoName').value.trim();
    const description = document.getElementById('photoDesc').value.trim();
    const fileInput = document.getElementById('photoFile');
    
    if (!name || !description) {
        showNotification('Please fill in both name and description!');
        return;
    }
    
    // create new photo object
    var photo = {
        name: name,
        description: description,
        imageUrl: 'assets/images/default-photo.jpg', 
        dateAdded: new Date().toLocaleDateString('en-GB')
    };
    
    // check if user uploaded a file
    if (fileInput.files && fileInput.files[0]) {
        photo.imageUrl = URL.createObjectURL(fileInput.files[0]);
    }
    
    // add to photos array
    appState.photos.push(photo);
    displayPhotos();
    clearPhotoForm();
    showNotification('Added to your collection!');
}

function displayPhotos() {
    const gallery = document.getElementById('photoGallery');
    
    // show all the photos
    for (let i = 0; i < appState.photos.length; i++) {
        const photo = appState.photos[i];
        const photoCard = document.createElement('div');
        photoCard.className = 'photo-card user-added';
        photoCard.innerHTML = '<img src="' + photo.imageUrl + '" alt="' + photo.name + '" class="photo-image">' +
                             '<div class="photo-name">' + photo.name + '</div>' +
                             '<div class="photo-description">' + photo.description + '</div>';
        gallery.appendChild(photoCard);
    }
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
    
    // send to laravel backend
    fetch('http://localhost:8000/api/reminders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            text: text,
            time: time
        })
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log('response from laravel:', data);
        showNotification('Reminder sent to Laravel!');
        displayReminders();
        clearReminderForm();
    })
    .catch(function(error) {
        console.log('error:', error);
        // fallback to local storage like before
        appState.reminders.push({
            content: text,
            time: time
        });
        showNotification('Saved locally instead!');
        displayReminders();
        clearReminderForm();
    });
}

function displayReminders() {
    const list = document.getElementById('remindersList');
    
    // add all reminders to the list
    for (let i = 0; i < appState.reminders.length; i++) {
        const reminder = appState.reminders[i];
        const item = document.createElement('li');
        item.className = 'reminder-item user-added';
        item.innerHTML = '<span>' + reminder.content + '</span>' +
                        '<span class="reminder-time">' + formatTime(reminder.time) + '</span>';
        list.appendChild(item);
    }
}

function formatTime(timeString) {
    const parts = timeString.split(':');
    const hours = parts[0];
    const minutes = parts[1];
    const hour = parseInt(hours);
    
    var period = 'AM';
    var displayHour = hour;
    
    if (hour >= 12) {
        period = 'PM';
    }
    if (hour > 12) {
        displayHour = hour - 12;
    }
    if (hour == 0) {
        displayHour = 12;
    }
    
    return displayHour + ':' + minutes + ' ' + period;
}

function clearReminderForm() {
    document.getElementById('reminderText').value = '';
    document.getElementById('reminderTime').value = '';
}

// journal stuff
function addJournalEntry() {
    const content = document.getElementById('journalEntry').value.trim();
    
    if (!content) {
        showNotification('Please write something in your journal!');
        return;
    }
    
    // make a new entry
    var entry = {};
    entry.content = content;
    
    // get current date
    const now = new Date();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    entry.date = dayNames[now.getDay()] + ', ' + monthNames[now.getMonth()] + ' ' + now.getDate() + ', ' + now.getFullYear();
    entry.time = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes());
    
    // add to beginning of array
    appState.journalEntries.push(entry);
    appState.journalEntries.reverse();
    appState.journalEntries.reverse(); // put newest first
    
    displayJournalEntries();
    document.getElementById('journalEntry').value = '';
    showNotification('Journal entry saved!');
}

function displayJournalEntries() {
    const container = document.getElementById('journalEntries');
    container.innerHTML = '';
    
    if (appState.journalEntries.length == 0) {
        container.innerHTML = '<p style="text-align: center; color: #888; font-style: italic;">No journal entries yet. Start writing your thoughts above!</p>';
        return;
    }
    
    // show all entries
    for (let i = 0; i < appState.journalEntries.length; i++) {
        const entry = appState.journalEntries[i];
        const entryDiv = document.createElement('div');
        entryDiv.className = 'journal-entry';
        entryDiv.innerHTML = '<div class="journal-date">' + entry.date + ' at ' + entry.time + '</div>' +
                            '<div class="journal-content">' + entry.content + '</div>';
        container.appendChild(entryDiv);
    }
}

// emergency contacts
function addContact() {
    const name = document.getElementById('contactName').value.trim();
    const phone = document.getElementById('contactPhone').value.trim();
    const relation = document.getElementById('contactRelation').value.trim();
    
    if (!name || !phone || !relation) {
        showNotification('Please fill in all contact fields!');
        return;
    }
    
    var contact = {
        name: name,
        phone: phone,
        relation: relation,
        dateAdded: new Date().toLocaleDateString()
    };
    
    appState.emergencyContacts.push(contact);
    displayContacts();
    clearContactForm();
    showNotification('Emergency contact added!');
}

function displayContacts() {
    const container = document.getElementById('contactList');
    
    // add all contacts
    for (let i = 0; i < appState.emergencyContacts.length; i++) {
        const contact = appState.emergencyContacts[i];
        const contactDiv = document.createElement('div');
        contactDiv.className = 'contact-card user-added';
        contactDiv.innerHTML = '<div class="contact-name">' + contact.name + '</div>' +
                              '<div class="contact-phone">' + contact.phone + '</div>' +
                              '<div class="contact-relation">' + contact.relation + '</div>';
        container.appendChild(contactDiv);
    }
}

function clearContactForm() {
    document.getElementById('contactName').value = '';
    document.getElementById('contactPhone').value = '';
    document.getElementById('contactRelation').value = '';
}

// notification popup
function showNotification(message) {
    document.getElementById('notificationText').textContent = message;
    document.getElementById('notification').classList.add('show');
    
    // hide after 4 seconds
    setTimeout(function() {
        document.getElementById('notification').classList.remove('show');
    }, 4000);
}

function closeNotification() {
    document.getElementById('notification').classList.remove('show');
}

// load everything when starting
function loadExistingData() {
    displayPhotos();
    displayReminders();
    displayJournalEntries();
    displayContacts();
}

// start the app when page loads
window.addEventListener('load', initializeApp);