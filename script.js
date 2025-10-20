let currentService = '';
let currentSubService = '';
let currentClientType = '';

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

function selectSubService(subService) {
    currentSubService = subService;
    showPage('client-type-page'); 
}

function selectClientType(clientType) {
    currentClientType = clientType;
    showPage('form-page');
    setupFormValidation();
}

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

function selectSubService(subService) {
    currentSubService = subService;
    showPage('client-type-page'); 
}

function selectClientType(clientType) {
    currentClientType = clientType;
    showPage('form-page');
    setupFormValidation();
}

function goBack() {
    if (document.getElementById('form-page').classList.contains('active')) {
        showPage('client-type-page');
    } else if (document.getElementById('client-type-page').classList.contains('active')) {
        showPage('subservice-page');
    } else if (document.getElementById('subservice-page').classList.contains('active')) {
        showPage('service-page');
    }
}

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
    
    queueNumbers[currentService][currentSubService][currentClientType]++;
    
    const ticketData = {
        queueNumber: queueNumber,
        service: currentService,
        subService: currentSubService,
        clientType: currentClientType,
        name: formData.name,
        barangay: formData.barangay
    };

    addToQueue(ticketData);
    
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
    
    const clientTypeElement = document.createElement('p');
    clientTypeElement.innerHTML = `<strong>Client Type:</strong> <span id="ticket-client-type">${currentClientType}</span>`;
    if (currentClientType === 'Senior/PWD') {
        clientTypeElement.innerHTML = `<strong>Client Type:</strong> <span class="priority-badge">${currentClientType}</span>`;
    }
    
    const ticketDetails = document.querySelector('.ticket-details');
    const existingClientType = document.getElementById('ticket-client-type');
    if (existingClientType) {
        existingClientType.parentElement.remove();
    }
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
    
    localStorage.setItem('queueNumbers', JSON.stringify(queueNumbers));
}

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
        isPriority: ticketData.clientType === 'Senior/PWD',
        isOutsideClient: ticketData.isOutsideClient || false
    };

    let currentQueue = JSON.parse(localStorage.getItem('currentQueue') || '[]');
    currentQueue.push(queueItem);
    localStorage.setItem('currentQueue', JSON.stringify(currentQueue));
    localStorage.setItem('queueUpdated', Date.now().toString());
}

function toggleCityInput() {
    const barangaySelect = document.getElementById('barangay');
    const outsideFields = document.getElementById('outside-fields');
    
    if (barangaySelect && outsideFields) {
        if (barangaySelect.value === 'OTHER') {
            outsideFields.style.display = 'block';
        } else {
            outsideFields.style.display = 'none';
        }
        setupFormValidation();
    }
}

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

function checkAndResetDaily() {
    const today = new Date().toDateString();
    const lastReset = localStorage.getItem('lastResetDate');
    
    if (lastReset !== today) {
        queueNumbers = {
            'Mayors Working Permit': { 
                'Newly Hired': { 'Senior/PWD': 1, 'Regular': 1 },
                'Renew': { 'Senior/PWD': 1, 'Regular': 1 }
            },
            'Mayors Clearance': { 
                'Newly Hired': { 'Senior/PWD': 1, 'Regular': 1 },
                'Renew': { 'Senior/PWD': 1, 'Regular': 1 }
            }
        };
        
        localStorage.removeItem('currentQueue');
        localStorage.removeItem('servingIndex');
        localStorage.removeItem('lastUpdate');
        localStorage.removeItem('queueUpdated');
        
        localStorage.setItem('lastResetDate', today);
        localStorage.setItem('queueNumbers', JSON.stringify(queueNumbers));
        
        console.log('System reset for new day:', today);
    }
}

checkAndResetDaily();