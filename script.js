let currentService = '';
let currentSubService = '';
let currentClientType = '';

// Update queue numbers to include client types
let queueNumbers = {
    'Mayors Working Permit': { 
        'Newly Hired': { 'Senior/PWD': 1, 'Regular': 1 },
        'Renew': { 'Senior/PWD': 1, 'Regular': 1 }
    },
    'Mayors Clearance': { 
        'Newly Hired': { 'Senior/PWD': 1, 'Regular': 1 },
        'Renew': { 'Senior/PWD': 1, 'Regular': 1 }
    }
};


function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

document.getElementById('welcome-page').addEventListener('click', function() {
    showPage('service-page');
});

function selectService(service) {
    currentService = service;
    document.getElementById('subservice-title').textContent = service;
    showPage('subservice-page');
}

// Modify the selectSubService function
function selectSubService(subService) {
    currentSubService = subService;
    showPage('client-type-page'); // Go to client type selection instead of form
}

// NEW: Add client type selection function
function selectClientType(clientType) {
    currentClientType = clientType;
    showPage('form-page');
    setupFormValidation();
}

// Update the goBack function
function goBack() {
    if (document.getElementById('form-page').classList.contains('active')) {
        showPage('client-type-page');
    } else if (document.getElementById('client-type-page').classList.contains('active')) {
        showPage('subservice-page');
    } else if (document.getElementById('subservice-page').classList.contains('active')) {
        showPage('service-page');
    }
}

function goToWelcome() {
    showPage('welcome-page');
}

function setupFormValidation() {
    const form = document.getElementById('customer-form');
    const printBtn = document.getElementById('print-btn');
    const inputs = form.querySelectorAll('input, select');
    
    function checkFormValidity() {
        let allValid = true;
        inputs.forEach(input => {
            if (!input.checkValidity()) {
                allValid = false;
            }
        });
        printBtn.disabled = !allValid;
    }
    
    inputs.forEach(input => {
        input.addEventListener('input', checkFormValidity);
        input.addEventListener('change', checkFormValidity);
    });
    
    checkFormValidity();
}

// Modify the selectSubService function
function selectSubService(subService) {
    currentSubService = subService;
    showPage('client-type-page'); // Go to client type selection instead of form
}

// NEW: Add client type selection function
function selectClientType(clientType) {
    currentClientType = clientType;
    showPage('form-page');
    setupFormValidation();
}

// Update the goBack function
function goBack() {
    if (document.getElementById('form-page').classList.contains('active')) {
        showPage('client-type-page');
    } else if (document.getElementById('client-type-page').classList.contains('active')) {
        showPage('subservice-page');
    } else if (document.getElementById('subservice-page').classList.contains('active')) {
        showPage('service-page');
    }
}

// Update the generateTicket function
function generateTicket() {
    const formData = {
        name: document.getElementById('name').value,
        address: document.getElementById('address').value,
        barangay: document.getElementById('barangay').value
    };
    
    const prefix = currentService === 'Mayors Working Permit' ? 'MWP' : 'MCL';
    const typeCode = currentSubService === 'Newly Hired' ? 'N' : 'R';
    const priorityCode = currentClientType === 'Senior/PWD' ? 'P' : 'R';
    const number = queueNumbers[currentService][currentSubService][currentClientType];
    
    const queueNumber = `${prefix}${typeCode}${priorityCode}${number.toString().padStart(3, '0')}`;
    
    // Increment the correct counter
    queueNumbers[currentService][currentSubService][currentClientType]++;
    
    // Save to ticket data
    const ticketData = {
        queueNumber: queueNumber,
        service: currentService,
        subService: currentSubService,
        clientType: currentClientType,
        name: formData.name,
        barangay: formData.barangay
    };

    // Add to queue system
    addToQueue(ticketData);
    
    // Update ticket display with priority styling
    const ticketElement = document.getElementById('printed-ticket');
    const queueNumberElement = document.getElementById('queue-number');
    
    if (currentClientType === 'Senior/PWD') {
        ticketElement.classList.add('priority-ticket');
        queueNumberElement.classList.add('priority-number');
    } else {
        ticketElement.classList.remove('priority-ticket');
        queueNumberElement.classList.remove('priority-number');
    }
    
    document.getElementById('queue-number').textContent = queueNumber;
    document.getElementById('ticket-service').textContent = currentService;
    document.getElementById('ticket-type').textContent = currentSubService;
    
    // NEW: Add client type to ticket
    const clientTypeElement = document.createElement('p');
    clientTypeElement.innerHTML = `<strong>Client Type:</strong> <span id="ticket-client-type">${currentClientType}</span>`;
    if (currentClientType === 'Senior/PWD') {
        clientTypeElement.innerHTML = `<strong>Client Type:</strong> <span class="priority-badge">${currentClientType}</span>`;
    }
    
    const ticketDetails = document.querySelector('.ticket-details');
    // Remove existing client type if any
    const existingClientType = document.getElementById('ticket-client-type');
    if (existingClientType) {
        existingClientType.parentElement.remove();
    }
    // Insert client type after service and before name
    const serviceElement = document.querySelector('#ticket-service').parentElement;
    serviceElement.parentNode.insertBefore(clientTypeElement, serviceElement.nextSibling);
    
    document.getElementById('ticket-name').textContent = formData.name;
    document.getElementById('ticket-barangay').textContent = formData.barangay;
    document.getElementById('ticket-date').textContent = new Date().toLocaleDateString();
    
    showPage('ticket-page');
    
    setTimeout(() => {
        window.print();
    }, 500);
    
    document.getElementById('customer-form').reset();
    
    // Save updated queue numbers
    localStorage.setItem('queueNumbers', JSON.stringify(queueNumbers));
}

// Update the addToQueue function
function addToQueue(ticketData) {
    const queueItem = {
        number: ticketData.queueNumber,
        service: ticketData.service,
        type: ticketData.subService,
        clientType: ticketData.clientType,
        name: ticketData.name,
        barangay: ticketData.barangay,
        timestamp: new Date().toISOString(),
        called: false,
        completed: false,
        noshow: false,
        isPriority: ticketData.clientType === 'Senior/PWD'
    };

    // Get current queue from localStorage
    let currentQueue = JSON.parse(localStorage.getItem('currentQueue') || '[]');
    currentQueue.push(queueItem);
    localStorage.setItem('currentQueue', JSON.stringify(currentQueue));
    
    // Trigger storage event
    localStorage.setItem('queueUpdated', Date.now().toString());
}

// Update the initializeQueueNumbers function for daily reset
function initializeQueueNumbers() {
    const saved = localStorage.getItem('queueNumbers');
    if (saved) {
        return JSON.parse(saved);
    } else {
        return {
            'Mayors Working Permit': { 
                'Newly Hired': { 'Senior/PWD': 1, 'Regular': 1 },
                'Renew': { 'Senior/PWD': 1, 'Regular': 1 }
            },
            'Mayors Clearance': { 
                'Newly Hired': { 'Senior/PWD': 1, 'Regular': 1 },
                'Renew': { 'Senior/PWD': 1, 'Regular': 1 }
            }
        };
    }
}

document.addEventListener('DOMContentLoaded', function() {
    showPage('welcome-page');
});

function addToQueue(ticketData) {
    const queueItem = {
        number: ticketData.queueNumber,
        service: ticketData.service,
        type: ticketData.subService,
        name: ticketData.name,
        barangay: ticketData.barangay,
        timestamp: new Date().toISOString(),
        called: false,
        completed: false,
        noshow: false
    };

    // Get current queue from localStorage
    let currentQueue = JSON.parse(localStorage.getItem('currentQueue') || '[]');
    currentQueue.push(queueItem);
    localStorage.setItem('currentQueue', JSON.stringify(currentQueue));
}

function addToQueue(ticketData) {
    const queueItem = {
        number: ticketData.queueNumber,
        service: currentService,
        type: currentSubService,
        name: ticketData.name,
        barangay: ticketData.barangay,
        timestamp: new Date().toISOString(),
        called: false,
        completed: false,
        noshow: false
    };

    // Get current queue from localStorage
    let currentQueue = JSON.parse(localStorage.getItem('currentQueue') || '[]');
    currentQueue.push(queueItem);
    localStorage.setItem('currentQueue', JSON.stringify(currentQueue));
    
    // Trigger storage event
    localStorage.setItem('queueUpdated', Date.now().toString());
}

// Automatic daily reset function
function checkAndResetDaily() {
    const today = new Date().toDateString();
    const lastReset = localStorage.getItem('lastResetDate');
    
    // If it's a new day, reset everything
    if (lastReset !== today) {
        // Reset queue numbers
        queueNumbers = {
            'Mayors Working Permit': { 'Newly Hired': 1, 'Renew': 1 },
            'Mayors Clearance': { 'Newly Hired': 1, 'Renew': 1 }
        };
        
        // Clear queue data
        localStorage.removeItem('currentQueue');
        localStorage.removeItem('servingIndex');
        localStorage.removeItem('lastUpdate');
        localStorage.removeItem('queueUpdated');
        
        // Set today as reset date
        localStorage.setItem('lastResetDate', today);
        localStorage.setItem('queueNumbers', JSON.stringify(queueNumbers));
        
        console.log('System reset for new day:', today);
    }
}

// Call this when the system starts
checkAndResetDaily();