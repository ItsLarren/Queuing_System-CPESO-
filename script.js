// ============================================
// GLOBAL VARIABLES - QUEUING SYSTEM
// ============================================

let queueData = {
    'Mayors Working Permit': {
        'Newly Hired': { current: 0, queue: [], done: [] },
        'Renew': { current: 0, queue: [], done: [] }
    },
    'Mayors Clearance': {
        'Newly Hired': { current: 0, queue: [], done: [] },
        'Renew': { current: 0, queue: [], done: [] }
    }
};

let clientStats = {
    csfp: 0,
    nonCsfp: 0,
    ftj: 0
};

let currentService = '';
let currentSubService = '';
let currentClientType = '';
let autoResetEnabled = false;
let autoResetTime = '00:00';

// ============================================
// COPYRIGHT PROTECTION SYSTEM
// ============================================

const COPYRIGHT_OWNER = "Engr. Yumul Larren Joy D.";
const DEVELOPMENT_YEAR = "2025";
const SYSTEM_LOCATION = "City of San Fernando Heroes Hall";

// Initialize copyright protection
function protectCopyright() {
    // 1. Console warning
    console.log(`%c
    ╔══════════════════════════════════════════════════╗
    ║           QUEUING SYSTEM - COPYRIGHT             ║
    ╠══════════════════════════════════════════════════╣
    ║  Owner: ${COPYRIGHT_OWNER}      ║
    ║  Developed: ${DEVELOPMENT_YEAR}                            ║
    ║  Location: ${SYSTEM_LOCATION}   ║
    ║                                                  ║
    ║  This system was solely developed by:            ║
    ║  ${COPYRIGHT_OWNER}      ║
    ║  Computer Engineer                              ║
    ║                                                  ║
    ║  WARNING: This software is the intellectual      ║
    ║  property of ${COPYRIGHT_OWNER} ║
    ║  Unauthorized modifications or claiming of      ║
    ║  ownership is strictly prohibited.              ║
    ╚══════════════════════════════════════════════════╝
    `, "color: #e74c3c; font-weight: bold;");
    
    // 2. Add watermark to all pages
    addCopyrightWatermark();
    
    // 3. Check for tampering
    checkForTampering();
    
    // 4. Add credit footer
    addCreditFooter();
    
    // 5. Add page credits
    addPageCredits();
    
    // 6. Make copyright info globally accessible (read-only)
    Object.defineProperty(window, 'systemCredits', {
        value: {
            developer: COPYRIGHT_OWNER,
            year: DEVELOPMENT_YEAR,
            location: SYSTEM_LOCATION,
            position: "Computer Engineer",
            getInfo: function() {
                return `Queuing System v1.0 - Developed by ${this.developer} (${this.year})`;
            }
        },
        writable: false,
        configurable: false
    });
    
    // 7. Override console.log to always show credit
    const originalLog = console.log;
    console.log = function(...args) {
        if (args[0] && typeof args[0] === 'string' && !args[0].includes('QUEUING SYSTEM')) {
            args[0] = `[System by: ${COPYRIGHT_OWNER}] ${args[0]}`;
        }
        originalLog.apply(console, args);
    };
}

// Add watermark to all pages
function addCopyrightWatermark() {
    if (document.getElementById('copyright-watermark')) return;
    
    const watermark = document.createElement('div');
    watermark.id = 'copyright-watermark';
    watermark.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        z-index: 99999;
        color: rgba(231, 76, 60, 0.3);
        font-size: 10px;
        font-family: Arial, sans-serif;
        pointer-events: none;
        user-select: none;
        transform: rotate(-45deg);
        transform-origin: right bottom;
        white-space: nowrap;
        font-weight: bold;
    `;
    watermark.innerHTML = `© ${DEVELOPMENT_YEAR} ${COPYRIGHT_OWNER}`;
    document.body.appendChild(watermark);
}

// Add credit footer to all pages
function addCreditFooter() {
    if (document.getElementById('copyright-footer')) return;
    
    const footer = document.createElement('div');
    footer.id = 'copyright-footer';
    footer.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 8px;
        font-size: 11px;
        text-align: center;
        z-index: 99998;
        border-top: 1px solid #e74c3c;
        font-family: Arial, sans-serif;
        display: none;
        transition: opacity 0.3s;
    `;
    footer.innerHTML = `
        <div>
            <strong>QUEUING SYSTEM INTELLECTUAL PROPERTY</strong> | 
            Developed by: <strong style="color: #3498db">${COPYRIGHT_OWNER}</strong> | 
            Year: <strong>${DEVELOPMENT_YEAR}</strong> | 
            Location: <strong>${SYSTEM_LOCATION}</strong> | 
            Position: <strong>Computer Engineer</strong>
        </div>
        <div style="font-size: 9px; margin-top: 3px; opacity: 0.8;">
            © ${DEVELOPMENT_YEAR} ${COPYRIGHT_OWNER}. All rights reserved. 
            This system remains the property of ${COPYRIGHT_OWNER} even after deployment.
            Unauthorized modifications or claims of ownership are prohibited.
        </div>
    `;
    document.body.appendChild(footer);
    
    // Show on hover at bottom
    let showTimer;
    document.addEventListener('mousemove', function(e) {
        if (e.clientY > window.innerHeight - 50) {
            clearTimeout(showTimer);
            showTimer = setTimeout(() => {
                footer.style.display = 'block';
                footer.style.opacity = '1';
            }, 500);
        } else {
            clearTimeout(showTimer);
            footer.style.opacity = '0';
            setTimeout(() => {
                if (footer.style.opacity === '0') {
                    footer.style.display = 'none';
                }
            }, 300);
        }
    });
}

// Check for tampering attempts
function checkForTampering() {
    // Check for attempts to remove copyright
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.removedNodes) {
                mutation.removedNodes.forEach(function(node) {
                    if (node.id === 'copyright-footer' || node.id === 'copyright-watermark' || 
                        node.id === 'splash-credit') {
                        console.warn('Tampering detected: Attempt to remove copyright notice');
                        // Re-add the element
                        if (node.id === 'copyright-footer') addCreditFooter();
                        if (node.id === 'copyright-watermark') addCopyrightWatermark();
                        if (node.id === 'splash-credit') showSplashCredit();
                    }
                });
            }
        });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
}

// Show splash credit on first load
function showSplashCredit() {
    // Check if already shown in this session
    if (sessionStorage.getItem('splashShown')) return;
    
    const splash = document.createElement('div');
    splash.id = 'splash-credit';
    splash.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        z-index: 100000;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: white;
        font-family: Arial, sans-serif;
        text-align: center;
    `;
    
    splash.innerHTML = `
        <div style="max-width: 800px; padding: 40px;">
            <div style="border: 3px solid #e74c3c; border-radius: 20px; padding: 40px; background: rgba(52, 73, 94, 0.9);">
                <h1 style="color: #3498db; font-size: 2.5em; margin-bottom: 30px; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">
                    QUEUING MANAGEMENT SYSTEM
                </h1>
                
                <div style="background: rgba(231, 76, 60, 0.2); padding: 25px; border-radius: 15px; margin: 25px 0; border: 2px solid #e74c3c;">
                    <h2 style="color: #ffeb3b; font-size: 1.8em; margin-bottom: 15px;">INTELLECTUAL PROPERTY DECLARATION</h2>
                    
                    <div style="font-size: 1.3em; line-height: 1.8;">
                        <p><strong>Developer/Owner:</strong> <span style="color: #3498db; font-weight: bold;">${COPYRIGHT_OWNER}</span></p>
                        <p><strong>Position:</strong> Computer Engineer</p>
                        <p><strong>Year Developed:</strong> ${DEVELOPMENT_YEAR}</p>
                        <p><strong>System Location:</strong> ${SYSTEM_LOCATION}</p>
                    </div>
                </div>
                
                <div style="background: rgba(52, 152, 219, 0.2); padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid #3498db;">
                    <h3 style="color: #2ecc71; margin-bottom: 15px;">OWNERSHIP STATEMENT</h3>
                    <p style="font-size: 1.1em;">
                        This queuing system was <strong>solely developed and created</strong> by 
                        <strong style="color: #ffeb3b;"> ${COPYRIGHT_OWNER}</strong>.
                    </p>
                    <p style="font-size: 1.1em; margin-top: 10px;">
                        Even though deployed at the ${SYSTEM_LOCATION}, this software remains the 
                        <strong>intellectual property</strong> of the developer.
                    </p>
                </div>
                
                <div style="background: rgba(46, 204, 113, 0.1); padding: 15px; border-radius: 8px; margin-top: 30px; border: 1px dashed #2ecc71;">
                    <p style="font-size: 1em; font-style: italic;">
                        "This system is provided for use by the ${SYSTEM_LOCATION}. 
                        All rights reserved. Unauthorized modifications, distribution, 
                        or claims of ownership are strictly prohibited."
                    </p>
                </div>
                
                <button id="close-splash-btn" style="
                    margin-top: 40px;
                    padding: 15px 40px;
                    background: linear-gradient(135deg, #e74c3c, #c0392b);
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-size: 1.2em;
                    font-weight: bold;
                    cursor: pointer;
                    transition: transform 0.3s;
                ">
                    ACKNOWLEDGE AND CONTINUE
                </button>
                
                <p style="margin-top: 20px; font-size: 0.9em; opacity: 0.7;">
                    This message will appear only once per session
                </p>
            </div>
        </div>
    `;
    
    document.body.appendChild(splash);
    
    // Add event listener to close button
    document.getElementById('close-splash-btn').addEventListener('click', function() {
        splash.style.opacity = '0';
        splash.style.transition = 'opacity 0.5s';
        setTimeout(() => {
            if (splash.parentNode) {
                splash.parentNode.removeChild(splash);
            }
        }, 500);
        sessionStorage.setItem('splashShown', 'true');
    });
}

// Add credit info to all main pages
function addPageCredits() {
    // Add to welcome page
    const welcomePage = document.getElementById('welcome-page');
    if (welcomePage && !welcomePage.querySelector('.page-credit')) {
        const credit = document.createElement('div');
        credit.className = 'page-credit';
        credit.style.cssText = `
            position: absolute;
            bottom: 20px;
            right: 20px;
            color: rgba(255, 255, 255, 0.6);
            font-size: 11px;
            font-family: Arial, sans-serif;
            text-align: right;
        `;
        credit.innerHTML = `System by: <strong>${COPYRIGHT_OWNER}</strong>`;
        welcomePage.querySelector('.client-body').appendChild(credit);
    }
}

// Add this function to your copyright protection section
function addSystemCreditsFooter() {
    // Check if already exists
    if (document.getElementById('system-credits')) return;
    
    const creditsFooter = document.createElement('div');
    creditsFooter.id = 'system-credits';
    creditsFooter.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #2c3e50, #34495e);
        color: white;
        padding: 5px 10px;
        font-size: 11px;
        text-align: center;
        z-index: 9998;
        border-top: 1px solid rgba(255,255,255,0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
        pointer-events: none;
        font-family: Arial, sans-serif;
    `;
    
    creditsFooter.innerHTML = `
        <span>Queuing System v1.0 © ${DEVELOPMENT_YEAR} ${COPYRIGHT_OWNER}</span>
        <span>Developer: Engr. Yumul Larren Joy D.</span>
        <span>Licensed to ${SYSTEM_LOCATION}</span>
    `;
    
    document.body.appendChild(creditsFooter);
    
    // Add hidden encoded credits
    const backupCredits = document.createElement('div');
    backupCredits.id = 'backup-credits';
    backupCredits.style.display = 'none';
    backupCredits.innerHTML = `
        <!-- 
        QUEUING_SYSTEM_INFO_START
        System: Municipal Queuing Management System
        Version: 1.0
        Developer: ${COPYRIGHT_OWNER}, Computer Engineer
        Copyright: © ${DEVELOPMENT_YEAR} ${COPYRIGHT_OWNER}. All Rights Reserved.
        Client: ${SYSTEM_LOCATION}
        Deployment: Office of the Mayor - Permits Section
        Type: Queue Management System for Mayor's Permit & Clearance
        Features: Priority Queuing, FTJ Support, Financial Reporting
        QUEUING_SYSTEM_INFO_END
        -->
    `;
    
    document.body.appendChild(backupCredits);
}

// Update the protectCopyright function to include the footer
function protectCopyright() {
    // 1. Console warning
    console.log(`%c
    ╔══════════════════════════════════════════════════╗
    ║           QUEUING SYSTEM - COPYRIGHT             ║
    ╠══════════════════════════════════════════════════╣
    ║  Owner: ${COPYRIGHT_OWNER}      ║
    ║  Developed: ${DEVELOPMENT_YEAR}                            ║
    ║  Location: ${SYSTEM_LOCATION}   ║
    ║                                                  ║
    ║  This system was solely developed by:            ║
    ║  ${COPYRIGHT_OWNER}      ║
    ║  Computer Engineer                              ║
    ║                                                  ║
    ║  WARNING: This software is the intellectual      ║
    ║  property of ${COPYRIGHT_OWNER} ║
    ║  Unauthorized modifications or claiming of      ║
    ║  ownership is strictly prohibited.              ║
    ╚══════════════════════════════════════════════════╝
    `, "color: #e74c3c; font-weight: bold;");
    
    // 2. Add watermark to all pages
    addCopyrightWatermark();
    
    // 3. Add system credits footer (NEW)
    addSystemCreditsFooter();
    
    // 4. Check for tampering
    checkForTampering();
    
    // 5. Add credit footer (hover version)
    addCreditFooter();
    
    // 6. Add page credits
    addPageCredits();
    
    // 7. Make copyright info globally accessible (read-only)
    Object.defineProperty(window, 'systemCredits', {
        value: {
            developer: COPYRIGHT_OWNER,
            year: DEVELOPMENT_YEAR,
            location: SYSTEM_LOCATION,
            position: "Computer Engineer",
            getInfo: function() {
                return `Queuing System v1.0 - Developed by ${this.developer} (${this.year})`;
            }
        },
        writable: false,
        configurable: false
    });
    
    // 8. Override console.log to always show credit
    const originalLog = console.log;
    console.log = function(...args) {
        if (args[0] && typeof args[0] === 'string' && !args[0].includes('QUEUING SYSTEM')) {
            args[0] = `[System by: ${COPYRIGHT_OWNER}] ${args[0]}`;
        }
        originalLog.apply(console, args);
    };
}

// Update the checkForTampering function to protect the new footer
function checkForTampering() {
    // Check for attempts to remove copyright
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.removedNodes) {
                mutation.removedNodes.forEach(function(node) {
                    if (node.id === 'copyright-footer' || node.id === 'copyright-watermark' || 
                        node.id === 'splash-credit' || node.id === 'system-credits' || 
                        node.id === 'backup-credits') {
                        console.warn('Tampering detected: Attempt to remove copyright notice');
                        // Re-add the element
                        if (node.id === 'copyright-footer') addCreditFooter();
                        if (node.id === 'copyright-watermark') addCopyrightWatermark();
                        if (node.id === 'splash-credit') showSplashCredit();
                        if (node.id === 'system-credits') addSystemCreditsFooter();
                    }
                });
            }
        });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
}

// ============================================
// QUEUING SYSTEM FUNCTIONS
// ============================================

// Initialize system
function initializeSystem() {
    const savedQueueData = localStorage.getItem('queueData');
    const savedClientStats = localStorage.getItem('clientStats');
    
    if (savedQueueData) {
        queueData = JSON.parse(savedQueueData);
    }
    
    if (savedClientStats) {
        clientStats = JSON.parse(savedClientStats);
    } else {
        updateClientStats();
    }
    
    updateClientStats();
    updateAdminStats();
    updateFinancialStats();
    updateEmployeeQueueList();
    updateDisplay();
}

// Page navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
    
    if (pageId === 'employee-page') {
        updateEmployeeQueueList();
    } else if (pageId === 'display-page') {
        updateDisplay();
    } else if (pageId === 'admin-page') {
        updateAdminStats();
    }
}

function selectService(service) {
    currentService = service;
    showPage('subservice-page');
    document.getElementById('subservice-title').textContent = service;
}

function selectSubService(subService) {
    currentSubService = subService;
    showPage('client-type-page');
}

function selectClientType(clientType) {
    currentClientType = clientType;
    showPage('form-page');
    document.getElementById('print-btn').disabled = false;
}

function goBack() {
    if (document.getElementById('form-page').classList.contains('active')) {
        showPage('client-type-page');
    } else if (document.getElementById('client-type-page').classList.contains('active')) {
        showPage('subservice-page');
    } else if (document.getElementById('subservice-page').classList.contains('active')) {
        showPage('service-page');
    } else if (document.getElementById('service-page').classList.contains('active')) {
        showPage('welcome-page');
    }
}

function goToWelcome() {
    showPage('welcome-page');
}

// Form handling
function toggleCityInput() {
    const barangaySelect = document.getElementById('barangay');
    const outsideFields = document.getElementById('outside-fields');
    
    if (barangaySelect.value === 'OTHER') {
        outsideFields.style.display = 'block';
    } else {
        outsideFields.style.display = 'none';
    }
}

function generateTicket() {
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const barangay = document.getElementById('barangay').value;
    const customBarangay = document.getElementById('custom-barangay').value;
    const city = document.getElementById('city').value;
    const province = document.getElementById('province').value;
    
    if (!name || !address || !barangay) {
        alert('Please fill in all required fields');
        return;
    }
    
    let finalBarangay = barangay;
    if (barangay === 'OTHER') {
        if (!customBarangay || !city || !province) {
            alert('Please fill in all required fields for outside SF Pampanga');
            return;
        }
        finalBarangay = `${customBarangay}, ${city}, ${province}`;
    }
    
    const queueNumber = generateQueueNumber();
    
    document.getElementById('queue-number').textContent = queueNumber;
    document.getElementById('ticket-service').textContent = currentService;
    document.getElementById('ticket-type').textContent = currentSubService;
    document.getElementById('ticket-client-type').textContent = currentClientType;
    document.getElementById('ticket-name').textContent = name;
    document.getElementById('ticket-barangay').textContent = finalBarangay;
    document.getElementById('ticket-date').textContent = new Date().toLocaleDateString();
    
    const ticketElement = document.getElementById('printed-ticket');
    
    const existingBadge = document.querySelector('.priority-badge, .ftj-badge');
    if (existingBadge) {
        existingBadge.remove();
    }
    
    ticketElement.classList.remove('priority-ticket', 'ftj-ticket');
    
    if (currentClientType === 'Senior/PWD') {
        ticketElement.classList.add('priority-ticket');
        const priorityBadge = document.createElement('div');
        priorityBadge.className = 'priority-badge';
        priorityBadge.textContent = 'PRIORITY';
        ticketElement.querySelector('.ticket-header').prepend(priorityBadge);
    } else if (currentClientType === 'FTJ') {
        ticketElement.classList.add('ftj-ticket');
        const ftjBadge = document.createElement('div');
        ftjBadge.className = 'ftj-badge';
        ftjBadge.textContent = 'FIRST TIME JOB SEEKER';
        ticketElement.querySelector('.ticket-header').prepend(ftjBadge);
    }
    
    addToQueue(queueNumber, name, finalBarangay);
    showPage('ticket-page');
    
    document.getElementById('customer-form').reset();
    document.getElementById('outside-fields').style.display = 'none';
    document.getElementById('print-btn').disabled = true;
}

function generateQueueNumber() {
    let prefix = '';
    if (currentService === 'Mayors Working Permit') {
        prefix = 'MWP';
    } else if (currentService === 'Mayors Clearance') {
        prefix = 'MCL';
    }
    
    if (currentSubService === 'Newly Hired') {
        prefix += 'N';
    } else if (currentSubService === 'Renew') {
        prefix += 'R';
    }
    
    if (currentClientType === 'Senior/PWD') {
        prefix += 'P';
    } else if (currentClientType === 'FTJ') {
        prefix += 'F';
    }
    
    const queue = queueData[currentService][currentSubService];
    const nextNumber = queue.queue.length + 1;
    const formattedNumber = nextNumber.toString().padStart(3, '0');
    
    return `${prefix}${formattedNumber}`;
}

function addToQueue(queueNumber, name, barangay) {
    const queueItem = {
        number: queueNumber,
        name: name,
        barangay: barangay,
        service: currentService,
        subService: currentSubService,
        clientType: currentClientType,
        timestamp: new Date().toISOString(),
        status: 'waiting'
    };
    
    queueData[currentService][currentSubService].queue.push(queueItem);
    localStorage.setItem('queueData', JSON.stringify(queueData));
    
    updateEmployeeQueueList();
    updateDisplay();
}

// Statistics functions
function updateClientStats() {
    clientStats.csfp = 0;
    clientStats.nonCsfp = 0;
    clientStats.ftj = 0;
    
    const csfpBarangays = [
        'Alasas', 'Baliti', 'Bulaon', 'Calulut', 'Del Carmen', 'Del Pilar', 
        'Del Rosario', 'Dela Paz Norte', 'Dela Paz Sur', 'Dolores', 'Juliana', 
        'Lara', 'Lourdes', 'Magliman', 'Maimpis', 'Malino', 'Malpitic', 
        'Pandaras', 'Panipuan', 'Pulung Bulu', 'Quebiauan', 'Saguin', 
        'San Agustin', 'San Felipe', 'San Isidro', 'San Jose', 'San Juan', 
        'San Nicolas', 'San Pedro', 'Santa Lucia', 'Santa Teresita', 
        'Santo Niño', 'Santo Rosario', 'Sindalan', 'Telebastagan'
    ];
    
    for (const service in queueData) {
        for (const subService in queueData[service]) {
            const doneQueue = queueData[service][subService].done;
            
            doneQueue.forEach(item => {
                if (item.status === 'served') { 
                    if (item.clientType === 'FTJ') {
                        clientStats.ftj++;
                    } else {
                        const isCsfp = csfpBarangays.some(barangay => 
                            item.barangay.includes(barangay) || 
                            (item.barangay === barangay)
                        );
                        
                        if (isCsfp) {
                            clientStats.csfp++;
                        } else {
                            clientStats.nonCsfp++;
                        }
                    }
                }
            });
        }
    }
    
    localStorage.setItem('clientStats', JSON.stringify(clientStats));
    updateAdminStats();
    updateFinancialStats();
}

function updateAdminStats() {
    document.getElementById('csfp-count').textContent = clientStats.csfp;
    document.getElementById('non-csfp-count').textContent = clientStats.nonCsfp;
    document.getElementById('ftj-count').textContent = clientStats.ftj;
    document.getElementById('total-clients').textContent = clientStats.csfp + clientStats.nonCsfp + clientStats.ftj;
}

function updateFinancialStats() {
    const csfpCount = clientStats.csfp;
    const nonCsfpCount = clientStats.nonCsfp;
    const ftjCount = clientStats.ftj;
    
    const csfpTotal = csfpCount * 150;
    const nonCsfpTotal = nonCsfpCount * 150;
    const ftjTotal = ftjCount * 150;
    const totalIncome = csfpTotal + nonCsfpTotal;
    const netIncome = totalIncome - ftjTotal;
    
    document.getElementById('financial-csfp-count').textContent = csfpCount;
    document.getElementById('financial-non-csfp-count').textContent = nonCsfpCount;
    document.getElementById('financial-ftj-count').textContent = ftjCount;
    
    document.getElementById('financial-csfp-total').textContent = `₱${csfpTotal}`;
    document.getElementById('financial-non-csfp-total').textContent = `₱${nonCsfpTotal}`;
    document.getElementById('financial-ftj-total').textContent = `₱${ftjTotal}`;
    
    document.getElementById('financial-total-income').textContent = `₱${totalIncome}`;
    document.getElementById('financial-net-income').textContent = `₱${netIncome}`;
}

// Queue management
function callNext() {
    let nextCustomer = null;
    let serviceType = '';
    let subServiceType = '';
    
    // Check for priority customers first
    for (const service in queueData) {
        for (const subService in queueData[service]) {
            const queue = queueData[service][subService].queue;
            if (queue.length > 0) {
                const priorityCustomer = queue.find(customer => 
                    customer.clientType === 'Senior/PWD' && 
                    (customer.status === 'waiting' || customer.status === 'noshow')
                );
                if (priorityCustomer) {
                    nextCustomer = priorityCustomer;
                    serviceType = service;
                    subServiceType = subService;
                    break;
                }
            }
        }
        if (nextCustomer) break;
    }
    
    // If no priority customers, check for any available customer
    if (!nextCustomer) {
        for (const service in queueData) {
            for (const subService in queueData[service]) {
                const queue = queueData[service][subService].queue;
                if (queue.length > 0) {
                    const availableCustomer = queue.find(customer => 
                        customer.status === 'waiting' || customer.status === 'noshow'
                    );
                    if (availableCustomer) {
                        nextCustomer = availableCustomer;
                        serviceType = service;
                        subServiceType = subService;
                        break;
                    }
                }
            }
            if (nextCustomer) break;
        }
    }
    
    if (nextCustomer) {
        nextCustomer.status = 'called';
        queueData[serviceType][subServiceType].current = nextCustomer.number;
        localStorage.setItem('queueData', JSON.stringify(queueData));
        updateEmployeeQueueList();
        updateDisplay();
    } else {
        alert('No customers in queue');
    }
}

function markDone() {
    let currentCustomer = null;
    let serviceType = '';
    let subServiceType = '';
    
    for (const service in queueData) {
        for (const subService in queueData[service]) {
            const queue = queueData[service][subService].queue;
            if (queue.length > 0 && queue[0].status === 'called') {
                currentCustomer = queue[0];
                serviceType = service;
                subServiceType = subService;
                break;
            }
        }
        if (currentCustomer) break;
    }
    
    if (currentCustomer) {
        currentCustomer.status = 'served';
        queueData[serviceType][subServiceType].done.push(currentCustomer);
        queueData[serviceType][subServiceType].queue.shift();
        queueData[serviceType][subServiceType].current = 0;
        localStorage.setItem('queueData', JSON.stringify(queueData));
        
        updateClientStats();
        updateEmployeeQueueList();
        updateDisplay();
    } else {
        alert('No customer is currently being served');
    }
}

function markNoShow() {
    let currentCustomer = null;
    let serviceType = '';
    let subServiceType = '';
    
    for (const service in queueData) {
        for (const subService in queueData[service]) {
            const queue = queueData[service][subService].queue;
            if (queue.length > 0 && queue[0].status === 'called') {
                currentCustomer = queue[0];
                serviceType = service;
                subServiceType = subService;
                break;
            }
        }
        if (currentCustomer) break;
    }
    
    if (currentCustomer) {
        const userChoice = confirm(
            `Mark ${currentCustomer.number} as No Show?\n\n` +
            `Click OK to move to end of queue (client might still come).\n` +
            `Click Cancel to remove completely (definitely not coming - won't count in revenue).`
        );
        
        if (userChoice) {
            currentCustomer.status = 'noshow';
            const movedCustomer = queueData[serviceType][subServiceType].queue.shift();
            queueData[serviceType][subServiceType].queue.push(movedCustomer);
            queueData[serviceType][subServiceType].current = 0;
            
            localStorage.setItem('queueData', JSON.stringify(queueData));
            updateEmployeeQueueList();
            updateDisplay();
            
            alert(`Number ${currentCustomer.number} moved to end of queue.`);
        } else {
            const removedCustomer = queueData[serviceType][subServiceType].queue.shift();
            queueData[serviceType][subServiceType].current = 0;
            
            removedCustomer.status = 'noshow_removed';
            queueData[serviceType][subServiceType].done.push(removedCustomer);
            
            localStorage.setItem('queueData', JSON.stringify(queueData));
            updateEmployeeQueueList();
            updateDisplay();
            
            alert(`Number ${currentCustomer.number} completely removed from queue and won't count in revenue.`);
        }
    } else {
        alert('No customer is currently being served');
    }
}

function updateEmployeeQueueList() {
    const queueList = document.getElementById('employee-queue-list');
    queueList.innerHTML = '';
    
    let allQueueItems = [];
    for (const service in queueData) {
        for (const subService in queueData[service]) {
            const queue = queueData[service][subService].queue;
            allQueueItems = allQueueItems.concat(queue.map(item => ({
                ...item,
                fullService: `${service} - ${subService}`
            })));
        }
    }
    
    allQueueItems.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    if (allQueueItems.length === 0) {
        queueList.innerHTML = '<p>No customers in queue</p>';
    } else {
        allQueueItems.forEach(item => {
            const queueItem = document.createElement('div');
            queueItem.className = `employee-queue-item employee-status-${item.status}`;
            
            if (item.clientType === 'Senior/PWD') {
                queueItem.classList.add('priority-queue');
            } else if (item.clientType === 'FTJ') {
                queueItem.classList.add('ftj-queue');
            }
            
            if (item.barangay.includes('OTHER')) {
                queueItem.classList.add('outside-location');
            }
            
            let statusText = '';
            if (item.status === 'called') {
                statusText = '<span style="color: #f39c12;">(CALLED)</span>';
            } else if (item.status === 'serving') {
                statusText = '<span style="color: #27ae60;">(SERVING)</span>';
            } else if (item.status === 'noshow') {
                statusText = '<span style="color: #95a5a6;">(NO SHOW)</span>';
            }
            
            let clientTypeBadge = '';
            if (item.clientType === 'Senior/PWD') {
                clientTypeBadge = '<span style="color: #e67e22;">(PRIORITY)</span>';
            } else if (item.clientType === 'FTJ') {
                clientTypeBadge = '<span style="color: #3498db;">(FTJ)</span>';
            }
            
            queueItem.innerHTML = `
                <div>
                    <div class="employee-queue-number">
                        <span class="${item.clientType === 'Senior/PWD' ? 'priority-number' : (item.clientType === 'FTJ' ? 'ftj-number' : '')}">
                            ${item.number}
                        </span>
                        ${statusText}
                        ${clientTypeBadge}
                        ${item.barangay.includes('OTHER') ? '<span class="outside-badge">OUTSIDE</span>' : ''}
                    </div>
                    <div class="employee-queue-service">${item.fullService}</div>
                    <div>${item.name} - ${item.barangay}</div>
                </div>
            `;
            
            queueList.appendChild(queueItem);
        });
    }
    
    updateCurrentServing();
}

function updateCurrentServing() {
    let currentNumber = '---';
    let currentServiceText = 'No one is currently being served';
    
    for (const service in queueData) {
        for (const subService in queueData[service]) {
            const current = queueData[service][subService].current;
            if (current !== 0) {
                currentNumber = current;
                currentServiceText = `${service} - ${subService}`;
                break;
            }
        }
        if (currentNumber !== '---') break;
    }
    
    document.getElementById('employee-display-number').textContent = currentNumber;
    document.getElementById('employee-current-service').textContent = currentServiceText;
}

function updateDisplay() {
    let currentNumber = '---';
    let currentServiceText = 'Please wait for your number to be called';
    
    for (const service in queueData) {
        for (const subService in queueData[service]) {
            const current = queueData[service][subService].current;
            if (current !== 0) {
                currentNumber = current;
                currentServiceText = `${service} - ${subService}`;
                break;
            }
        }
        if (currentNumber !== '---') break;
    }
    
    document.getElementById('display-current-number').textContent = currentNumber;
    document.getElementById('display-current-service').textContent = currentServiceText;
    
    const nextNumbersContainer = document.getElementById('display-next-numbers');
    nextNumbersContainer.innerHTML = '';
    
    let nextNumbers = [];
    for (const service in queueData) {
        for (const subService in queueData[service]) {
            const queue = queueData[service][subService].queue;
            const waitingNumbers = queue
                .filter(item => item.status === 'waiting')
                .slice(0, 3)
                .map(item => item.number);
            nextNumbers = nextNumbers.concat(waitingNumbers);
        }
    }
    
    nextNumbers.slice(0, 3).forEach(number => {
        const numberElement = document.createElement('div');
        numberElement.className = 'display-next-number';
        numberElement.textContent = number;
        nextNumbersContainer.appendChild(numberElement);
    });
    
    if (nextNumbers.length === 0) {
        const messageElement = document.createElement('div');
        messageElement.className = 'display-next-number';
        messageElement.textContent = '---';
        nextNumbersContainer.appendChild(messageElement);
    }
}

// Reset functions
function showResetConfirmation() {
    document.getElementById('confirm-reset').style.display = 'block';
}

function hideResetConfirmation() {
    document.getElementById('confirm-reset').style.display = 'none';
}

function resetSystem() {
    for (const service in queueData) {
        for (const subService in queueData[service]) {
            queueData[service][subService] = {
                current: 0,
                queue: [],
                done: []
            };
        }
    }
    
    localStorage.setItem('queueData', JSON.stringify(queueData));
    updateEmployeeQueueList();
    updateDisplay();
    hideResetConfirmation();
    alert('System has been reset successfully!');
}

function showAdminResetConfirmation() {
    document.getElementById('admin-confirm-reset').style.display = 'block';
}

function hideAdminResetConfirmation() {
    document.getElementById('admin-confirm-reset').style.display = 'none';
}

function adminResetSystem() {
    for (const service in queueData) {
        for (const subService in queueData[service]) {
            queueData[service][subService] = {
                current: 0,
                queue: [],
                done: []
            };
        }
    }
    
    clientStats = {
        csfp: 0,
        nonCsfp: 0,
        ftj: 0
    };
    
    localStorage.setItem('queueData', JSON.stringify(queueData));
    localStorage.setItem('clientStats', JSON.stringify(clientStats));
    
    updateAdminStats();
    updateFinancialStats();
    updateEmployeeQueueList();
    updateDisplay();
    
    document.getElementById('admin-success-message').style.display = 'block';
    setTimeout(() => {
        document.getElementById('admin-success-message').style.display = 'none';
    }, 3000);
    
    hideAdminResetConfirmation();
}

function toggleAutoReset() {
    autoResetEnabled = !autoResetEnabled;
    document.getElementById('auto-reset-status').textContent = autoResetEnabled ? 'ON' : 'OFF';
    
    if (autoResetEnabled) {
        alert('Auto reset enabled. System will reset daily at midnight.');
    } else {
        alert('Auto reset disabled.');
    }
}

// Financial admin functions
function showFinancialAdmin() {
    showPage('financial-login-page');
}

function verifyFinancialAccess() {
    const password = document.getElementById('admin-password').value;
    
    if (password === 'admin123') {
        document.getElementById('admin-password').value = '';
        document.getElementById('login-error').style.display = 'none';
        showPage('financial-admin-page');
        updateFinancialStats();
    } else {
        document.getElementById('login-error').style.display = 'block';
    }
}

function goToAdmin() {
    showPage('admin-page');
}

// Recall function
function recallCurrent() {
    let currentCustomer = null;
    let serviceType = '';
    let subServiceType = '';
    
    for (const service in queueData) {
        for (const subService in queueData[service]) {
            const queue = queueData[service][subService].queue;
            if (queue.length > 0 && queue[0].status === 'called') {
                currentCustomer = queue[0];
                serviceType = service;
                subServiceType = subService;
                break;
            }
        }
        if (currentCustomer) break;
    }
    
    if (currentCustomer) {
        const displayNumber = document.getElementById('display-current-number');
        const employeeDisplay = document.getElementById('employee-display-number');
        
        const originalColor = '#e74c3c';
        const originalTextShadow = '0 0 50px rgba(231, 76, 60, 0.7)';
        const blinkColor = '#ffeb3b';
        const blinkTextShadow = '0 0 50px rgba(255, 235, 59, 0.9)';
        
        let blinkCount = 0;
        const blinkInterval = setInterval(() => {
            if (blinkCount % 2 === 0) {
                displayNumber.style.color = blinkColor;
                displayNumber.style.textShadow = blinkTextShadow;
                displayNumber.style.fontSize = '13em';
                employeeDisplay.style.color = blinkColor;
                employeeDisplay.style.fontSize = '7em';
            } else {
                displayNumber.style.color = originalColor;
                displayNumber.style.textShadow = originalTextShadow;
                displayNumber.style.fontSize = '12em';
                employeeDisplay.style.color = originalColor;
                employeeDisplay.style.fontSize = '6em';
            }
            blinkCount++;
            
            if (blinkCount >= 8) {
                clearInterval(blinkInterval);
                displayNumber.style.color = originalColor;
                displayNumber.style.textShadow = originalTextShadow;
                displayNumber.style.fontSize = '12em';
                employeeDisplay.style.color = originalColor;
                employeeDisplay.style.fontSize = '6em';
            }
        }, 400);
        
        alert(`🔔 RECALLING NUMBER: ${currentCustomer.number}\n\nPlease proceed to the counter.`);
    } else {
        alert('No customer is currently being called');
    }
}

// ============================================
// INITIALIZATION
// ============================================

window.onload = function() {
    initializeSystem();
    protectCopyright();
    
    // Show splash credit after a short delay
    setTimeout(showSplashCredit, 1000);
    
    // Event listeners
    document.getElementById('welcome-page').addEventListener('click', function() {
        showPage('service-page');
    });
    
    document.querySelector('.instruction').addEventListener('click', function(e) {
        e.stopPropagation();
        showPage('service-page');
    });
    
    document.getElementById('customer-form').addEventListener('input', function() {
        const name = document.getElementById('name').value;
        const address = document.getElementById('address').value;
        const barangay = document.getElementById('barangay').value;
        const printBtn = document.getElementById('print-btn');
        
        let isValid = name && address && barangay;
        
        if (barangay === 'OTHER') {
            const customBarangay = document.getElementById('custom-barangay').value;
            const city = document.getElementById('city').value;
            const province = document.getElementById('province').value;
            isValid = isValid && customBarangay && city && province;
        }
        
        printBtn.disabled = !isValid;
    });
};