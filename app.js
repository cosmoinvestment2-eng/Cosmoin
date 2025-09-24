// Cosmo Investment Website JavaScript with Financial Calculators

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initSmoothScrolling();
    initScrollAnimations();
    initContactForm();
    initMobileMenu();
    initHeaderScroll();
    initPartnerTagAnimations();
    initCalculatorInputs();
    
    // Make calculator functions globally available
    window.calculateSIP = calculateSIP;
    window.resetSIP = resetSIP;
    window.calculateCI = calculateCI;
    window.resetCI = resetCI;
    window.calculateIG = calculateIG;
    window.resetIG = resetIG;
    window.calculateEMI = calculateEMI;
    window.resetEMI = resetEMI;
    window.calculateGP = calculateGP;
    window.resetGP = resetGP;
});

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                updateActiveNavLink(this);
                
                // Close mobile menu if open
                const nav = document.querySelector('.nav');
                if (nav && nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    const mobileToggle = document.querySelector('.mobile-menu-toggle i');
                    if (mobileToggle) {
                        mobileToggle.className = 'fas fa-bars';
                    }
                }
            }
        });
    });
}

// Update active navigation link
function updateActiveNavLink(activeLink) {
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => link.classList.remove('active'));
    if (activeLink.classList.contains('nav__link')) {
        activeLink.classList.add('active');
    }
}

// Scroll-based animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Add fade-in class to elements that should animate
    const animateElements = document.querySelectorAll(
        '.calculator-card, .service-category, .partner-category, .stat-card, .contact-item, .credential-item'
    );
    
    animateElements.forEach((el, index) => {
        el.classList.add('fade-in');
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
}

// Header scroll effect
function initHeaderScroll() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Update active section in navigation
        updateActiveSection();
    });
}

// Update active section based on scroll position
function updateActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
    const headerHeight = document.querySelector('.header').offsetHeight;
    const scrollPosition = window.scrollY + headerHeight + 50;
    
    let activeSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            activeSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${activeSection}`) {
            link.classList.add('active');
        }
    });
}

// Contact form handling
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                service: document.getElementById('service').value,
                message: document.getElementById('message').value
            };
            
            // Validate form
            if (validateForm(formData)) {
                handleFormSubmission(formData);
            }
        });
        
        // Add real-time validation
        const formInputs = contactForm.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
    }
}

// Form validation
function validateForm(data) {
    let isValid = true;
    const errors = [];
    
    // Name validation
    if (!data.name.trim()) {
        errors.push('Name is required');
        showFieldError('name', 'Name is required');
        isValid = false;
    } else {
        clearFieldError('name');
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email.trim()) {
        errors.push('Email is required');
        showFieldError('email', 'Email is required');
        isValid = false;
    } else if (!emailRegex.test(data.email)) {
        errors.push('Please enter a valid email');
        showFieldError('email', 'Please enter a valid email');
        isValid = false;
    } else {
        clearFieldError('email');
    }
    
    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!data.phone.trim()) {
        errors.push('Phone number is required');
        showFieldError('phone', 'Phone number is required');
        isValid = false;
    } else if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
        errors.push('Please enter a valid 10-digit phone number');
        showFieldError('phone', 'Please enter a valid 10-digit phone number');
        isValid = false;
    } else {
        clearFieldError('phone');
    }
    
    return isValid;
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name');
    
    switch(fieldName) {
        case 'name':
            if (!value) {
                showFieldError(fieldName, 'Name is required');
            } else {
                clearFieldError(fieldName);
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) {
                showFieldError(fieldName, 'Email is required');
            } else if (!emailRegex.test(value)) {
                showFieldError(fieldName, 'Please enter a valid email');
            } else {
                clearFieldError(fieldName);
            }
            break;
            
        case 'phone':
            const phoneRegex = /^[0-9]{10}$/;
            if (!value) {
                showFieldError(fieldName, 'Phone number is required');
            } else if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                showFieldError(fieldName, 'Please enter a valid 10-digit phone number');
            } else {
                clearFieldError(fieldName);
            }
            break;
    }
}

// Show field error
function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const formGroup = field.closest('.form-group');
    
    // Remove existing error
    const existingError = formGroup.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error styling
    field.classList.add('error');
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    
    formGroup.appendChild(errorDiv);
}

// Clear field error
function clearFieldError(fieldName) {
    const field = document.getElementById(fieldName);
    const formGroup = field.closest('.form-group');
    const existingError = formGroup.querySelector('.field-error');
    
    if (existingError) {
        existingError.remove();
    }
    
    field.classList.remove('error');
}

// Handle form submission
function handleFormSubmission(data) {
    const submitButton = document.querySelector('#contactForm button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        // Show success message
        showNotification('Thank you! Your message has been sent successfully. We will contact you soon.', 'success');
        
        // Reset form
        document.getElementById('contactForm').reset();
        
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // Clear any existing errors
        const errorMessages = document.querySelectorAll('.field-error');
        errorMessages.forEach(error => error.remove());
        
        const errorFields = document.querySelectorAll('.form-control.error');
        errorFields.forEach(field => field.classList.remove('error'));
        
    }, 2000);
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification__content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="notification__close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 16px;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Mobile menu functionality
function initMobileMenu() {
    const nav = document.querySelector('.nav');
    
    // Create mobile menu toggle button
    const mobileMenuToggle = document.createElement('button');
    mobileMenuToggle.className = 'mobile-menu-toggle';
    mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    mobileMenuToggle.style.display = 'none';
    
    // Insert toggle button
    const headerContent = document.querySelector('.header__content');
    headerContent.appendChild(mobileMenuToggle);
    
    // Toggle mobile menu
    mobileMenuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
        const icon = this.querySelector('i');
        icon.className = nav.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
    });
}

// Partner tag hover animations
function initPartnerTagAnimations() {
    const partnerTags = document.querySelectorAll('.partner-tag');
    
    partnerTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05) translateY(-2px)';
            this.style.boxShadow = '0 4px 12px rgba(251, 191, 36, 0.3)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
}

// Initialize calculator inputs for real-time calculation
function initCalculatorInputs() {
    // Add event listeners to all calculator inputs for real-time calculation
    const calculatorInputs = document.querySelectorAll('.calculator-card input, .calculator-card select');
    
    calculatorInputs.forEach(input => {
        input.addEventListener('input', function() {
            const calculatorCard = this.closest('.calculator-card');
            const calculatorType = getCalculatorType(calculatorCard);
            
            // Add debounced calculation
            clearTimeout(this.calculationTimeout);
            this.calculationTimeout = setTimeout(() => {
                switch(calculatorType) {
                    case 'sip':
                        if (validateSIPInputs()) calculateSIP();
                        break;
                    case 'ci':
                        if (validateCIInputs()) calculateCI();
                        break;
                    case 'ig':
                        if (validateIGInputs()) calculateIG();
                        break;
                    case 'emi':
                        if (validateEMIInputs()) calculateEMI();
                        break;
                    case 'gp':
                        if (validateGPInputs()) calculateGP();
                        break;
                }
            }, 500);
        });
    });
}

// Get calculator type from card
function getCalculatorType(card) {
    if (card.querySelector('#sip-monthly')) return 'sip';
    if (card.querySelector('#ci-principal')) return 'ci';
    if (card.querySelector('#ig-initial')) return 'ig';
    if (card.querySelector('#emi-loan')) return 'emi';
    if (card.querySelector('#gp-target')) return 'gp';
    return null;
}

// Utility function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
}

// Utility function to format number
function formatNumber(number) {
    return new Intl.NumberFormat('en-IN').format(Math.round(number));
}

// SIP Calculator Functions
function validateSIPInputs() {
    const monthly = parseFloat(document.getElementById('sip-monthly').value);
    const returnRate = parseFloat(document.getElementById('sip-return').value);
    const years = parseFloat(document.getElementById('sip-years').value);
    
    return monthly > 0 && returnRate > 0 && years > 0;
}

function calculateSIP() {
    const monthly = parseFloat(document.getElementById('sip-monthly').value);
    const annualReturn = parseFloat(document.getElementById('sip-return').value);
    const years = parseFloat(document.getElementById('sip-years').value);
    
    if (!monthly || !annualReturn || !years || monthly <= 0 || annualReturn <= 0 || years <= 0) {
        document.getElementById('sip-result').style.display = 'none';
        return;
    }
    
    // Convert annual return to monthly
    const monthlyReturn = annualReturn / 12 / 100;
    const months = years * 12;
    
    // SIP Formula: FV = PMT × ((1 + r)^n - 1) / r
    const futureValue = monthly * (Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn;
    const totalInvestment = monthly * months;
    const expectedReturns = futureValue - totalInvestment;
    
    // Display results
    document.getElementById('sip-total-investment').textContent = formatCurrency(totalInvestment);
    document.getElementById('sip-returns').textContent = formatCurrency(expectedReturns);
    document.getElementById('sip-maturity').textContent = formatCurrency(futureValue);
    document.getElementById('sip-result').style.display = 'block';
}

function resetSIP() {
    document.getElementById('sip-monthly').value = '';
    document.getElementById('sip-return').value = '';
    document.getElementById('sip-years').value = '';
    document.getElementById('sip-result').style.display = 'none';
}

// Compound Interest Calculator Functions
function validateCIInputs() {
    const principal = parseFloat(document.getElementById('ci-principal').value);
    const rate = parseFloat(document.getElementById('ci-rate').value);
    const time = parseFloat(document.getElementById('ci-time').value);
    
    return principal > 0 && rate > 0 && time > 0;
}

function calculateCI() {
    const principal = parseFloat(document.getElementById('ci-principal').value);
    const rate = parseFloat(document.getElementById('ci-rate').value);
    const frequency = parseFloat(document.getElementById('ci-frequency').value);
    const time = parseFloat(document.getElementById('ci-time').value);
    
    if (!principal || !rate || !time || principal <= 0 || rate <= 0 || time <= 0) {
        document.getElementById('ci-result').style.display = 'none';
        return;
    }
    
    // Compound Interest Formula: A = P(1 + r/n)^(nt)
    const amount = principal * Math.pow(1 + (rate/100)/frequency, frequency * time);
    const compoundInterest = amount - principal;
    
    // Display results
    document.getElementById('ci-principal-result').textContent = formatCurrency(principal);
    document.getElementById('ci-interest').textContent = formatCurrency(compoundInterest);
    document.getElementById('ci-total').textContent = formatCurrency(amount);
    document.getElementById('ci-result').style.display = 'block';
}

function resetCI() {
    document.getElementById('ci-principal').value = '';
    document.getElementById('ci-rate').value = '';
    document.getElementById('ci-frequency').value = '1';
    document.getElementById('ci-time').value = '';
    document.getElementById('ci-result').style.display = 'none';
}

// Investment Growth Calculator Functions
function validateIGInputs() {
    const initial = parseFloat(document.getElementById('ig-initial').value);
    const monthly = parseFloat(document.getElementById('ig-monthly').value);
    const returnRate = parseFloat(document.getElementById('ig-return').value);
    const years = parseFloat(document.getElementById('ig-years').value);
    
    return initial > 0 && monthly >= 0 && returnRate > 0 && years > 0;
}

function calculateIG() {
    const initial = parseFloat(document.getElementById('ig-initial').value) || 0;
    const monthly = parseFloat(document.getElementById('ig-monthly').value) || 0;
    const annualReturn = parseFloat(document.getElementById('ig-return').value);
    const years = parseFloat(document.getElementById('ig-years').value);
    
    if (!annualReturn || !years || annualReturn <= 0 || years <= 0) {
        document.getElementById('ig-result').style.display = 'none';
        return;
    }
    
    const monthlyReturn = annualReturn / 12 / 100;
    const months = years * 12;
    
    // Future value of initial investment
    const initialFV = initial * Math.pow(1 + monthlyReturn, months);
    
    // Future value of monthly contributions (SIP)
    let monthlyFV = 0;
    if (monthly > 0) {
        monthlyFV = monthly * (Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn;
    }
    
    const totalFinalValue = initialFV + monthlyFV;
    const totalInvested = initial + (monthly * months);
    const totalGrowth = totalFinalValue - totalInvested;
    
    // Display results
    document.getElementById('ig-total-invested').textContent = formatCurrency(totalInvested);
    document.getElementById('ig-growth').textContent = formatCurrency(totalGrowth);
    document.getElementById('ig-final').textContent = formatCurrency(totalFinalValue);
    document.getElementById('ig-result').style.display = 'block';
}

function resetIG() {
    document.getElementById('ig-initial').value = '';
    document.getElementById('ig-monthly').value = '';
    document.getElementById('ig-return').value = '';
    document.getElementById('ig-years').value = '';
    document.getElementById('ig-result').style.display = 'none';
}

// EMI Calculator Functions
function validateEMIInputs() {
    const loan = parseFloat(document.getElementById('emi-loan').value);
    const rate = parseFloat(document.getElementById('emi-rate').value);
    const tenure = parseFloat(document.getElementById('emi-tenure').value);
    
    return loan > 0 && rate > 0 && tenure > 0;
}

function calculateEMI() {
    const loanAmount = parseFloat(document.getElementById('emi-loan').value);
    const annualRate = parseFloat(document.getElementById('emi-rate').value);
    const tenureYears = parseFloat(document.getElementById('emi-tenure').value);
    
    if (!loanAmount || !annualRate || !tenureYears || loanAmount <= 0 || annualRate <= 0 || tenureYears <= 0) {
        document.getElementById('emi-result').style.display = 'none';
        return;
    }
    
    const monthlyRate = annualRate / 12 / 100;
    const months = tenureYears * 12;
    
    // EMI Formula: EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
    const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                (Math.pow(1 + monthlyRate, months) - 1);
    
    const totalAmount = emi * months;
    const totalInterest = totalAmount - loanAmount;
    
    // Display results
    document.getElementById('emi-monthly').textContent = formatCurrency(emi);
    document.getElementById('emi-total-interest').textContent = formatCurrency(totalInterest);
    document.getElementById('emi-total-amount').textContent = formatCurrency(totalAmount);
    document.getElementById('emi-result').style.display = 'block';
}

function resetEMI() {
    document.getElementById('emi-loan').value = '';
    document.getElementById('emi-rate').value = '';
    document.getElementById('emi-tenure').value = '';
    document.getElementById('emi-result').style.display = 'none';
}

// Goal Planning Calculator Functions
function validateGPInputs() {
    const target = parseFloat(document.getElementById('gp-target').value);
    const currentAge = parseFloat(document.getElementById('gp-current-age').value);
    const targetAge = parseFloat(document.getElementById('gp-target-age').value);
    const returnRate = parseFloat(document.getElementById('gp-return').value);
    
    return target > 0 && currentAge > 0 && targetAge > currentAge && returnRate > 0;
}

function calculateGP() {
    const targetAmount = parseFloat(document.getElementById('gp-target').value);
    const currentAge = parseFloat(document.getElementById('gp-current-age').value);
    const targetAge = parseFloat(document.getElementById('gp-target-age').value);
    const annualReturn = parseFloat(document.getElementById('gp-return').value);
    
    if (!targetAmount || !currentAge || !targetAge || !annualReturn || targetAge <= currentAge || targetAmount <= 0 || annualReturn <= 0) {
        document.getElementById('gp-result').style.display = 'none';
        return;
    }
    
    const years = targetAge - currentAge;
    const monthlyReturn = annualReturn / 12 / 100;
    const months = years * 12;
    
    // Calculate required monthly SIP
    // FV = PMT × ((1 + r)^n - 1) / r
    // PMT = FV × r / ((1 + r)^n - 1)
    const requiredMonthlyInvestment = (targetAmount * monthlyReturn) / 
                                    (Math.pow(1 + monthlyReturn, months) - 1);
    
    const totalInvestment = requiredMonthlyInvestment * months;
    
    // Display results
    document.getElementById('gp-period').textContent = `${years} Years`;
    document.getElementById('gp-monthly-investment').textContent = formatCurrency(requiredMonthlyInvestment);
    document.getElementById('gp-total-investment').textContent = formatCurrency(totalInvestment);
    document.getElementById('gp-result').style.display = 'block';
}

function resetGP() {
    document.getElementById('gp-target').value = '';
    document.getElementById('gp-current-age').value = '';
    document.getElementById('gp-target-age').value = '';
    document.getElementById('gp-return').value = '';
    document.getElementById('gp-result').style.display = 'none';
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

// Initialize performance optimizations
function initPerformanceOptimizations() {
    // Lazy load images when they enter viewport
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// Initialize all optimizations
document.addEventListener('DOMContentLoaded', function() {
    initPerformanceOptimizations();
});
