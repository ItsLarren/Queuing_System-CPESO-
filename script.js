let currentService = '';
let currentSubService = '';
let queueNumbers = {
    'Mayors Working Permit': { 'Newly Hired': 1, 'Renew': 1 },
    'Mayors Clearance': { 'Newly Hired': 1, 'Renew': 1 }
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
    showPage('form-page');
    
    setupFormValidation();
}

function goBack() {
    if (document.getElementById('form-page').classList.contains('active')) {
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

function generateTicket() {
    const formData = {
        name: document.getElementById('name').value,
        address: document.getElementById('address').value,
        barangay: document.getElementById('barangay').value
    };
    
    const prefix = currentService === 'Mayors Working Permit' ? 'MWP' : 'MCL';
    const typeCode = currentSubService === 'Newly Hired' ? 'N' : 'R';
    const number = queueNumbers[currentService][currentSubService];
    
    const queueNumber = `${prefix}${typeCode}${number.toString().padStart(3, '0')}`;
    
    queueNumbers[currentService][currentSubService]++;
    
    document.getElementById('queue-number').textContent = queueNumber;
    document.getElementById('ticket-service').textContent = currentService;
    document.getElementById('ticket-type').textContent = currentSubService;
    document.getElementById('ticket-name').textContent = formData.name;
    document.getElementById('ticket-barangay').textContent = formData.barangay;
    document.getElementById('ticket-date').textContent = new Date().toLocaleDateString();
    
    showPage('ticket-page');
    
    setTimeout(() => {
        window.print();
    }, 500);
    
    document.getElementById('customer-form').reset();
}

document.addEventListener('DOMContentLoaded', function() {
    showPage('welcome-page');
});