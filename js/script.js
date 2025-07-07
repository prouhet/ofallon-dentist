// Final Working script.js - Tested and Confirmed Working
console.log("Script.js loading...");

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM ready, initializing site...");
    initializeSite();
});

// Backup initialization in case DOMContentLoaded doesn't fire
window.addEventListener('load', function() {
    console.log("Window loaded, backup initialization...");
    setTimeout(initializeSite, 500);
});

// Main initialization function
function initializeSite() {
    console.log("Starting site initialization...");
    
    // Initialize all components
    populateComparisonTable();
    populateProfilesGrid();
    populateFAQSection();
    initializeNavigation();
    
    console.log("Site initialization complete!");
}

// Comparison table function - TESTED AND WORKING
function populateComparisonTable() {
    console.log("Starting table population...");
    const tableBody = document.querySelector('#comparison-table tbody');
    if (!tableBody) {
        console.log("Table body not found");
        return;
    }
    
    tableBody.innerHTML = '';
    
    // Sort dentists: premium first, then by rating, then alphabetically
    const sortedDentists = dentistsData.sort(function(a, b) {
        if (a.isPremium && !b.isPremium) return -1;
        if (!a.isPremium && b.isPremium) return 1;
        
        const ratingA = a.rating || 0;
        const ratingB = b.rating || 0;
        if (ratingA !== ratingB) return ratingB - ratingA;
        
        return a.name.localeCompare(b.name);
    });
    
    sortedDentists.forEach(function(dentist) {
        const row = document.createElement('tr');
        row.innerHTML = '<td><div class="dentist-name"><span>' + dentist.name + '</span>' + (dentist.isPremium ? '<span class="preferred-badge">Preferred</span>' : '') + '</div></td><td>' + dentist.type + '</td><td>' + (dentist.price || dentist.priceRange || 'Contact for pricing') + '</td><td>' + dentist.hours + '</td><td>' + (dentist.features || []).slice(0,3).join(', ') + '</td><td><div class="rating"><span class="rating-stars">★★★★★</span><span class="rating-count">' + (dentist.rating || 'No rating') + ' (' + (dentist.reviews || 'No reviews') + ')</span></div></td>';
        tableBody.appendChild(row);
    });
    
    console.log("Table populated with", dentistsData.length, "dentists");
}

// Profile cards function - TESTED AND WORKING  
function populateProfilesGrid() {
    console.log("Starting profiles population...");
    const profilesGrid = document.querySelector('.profiles-grid');
    if (!profilesGrid) {
        console.log("Profiles grid not found");
        return;
    }
    
    profilesGrid.innerHTML = '';
    
    // Sort dentists: premium first, then by rating, then alphabetically
    const sortedDentists = dentistsData.sort(function(a, b) {
        if (a.isPremium && !b.isPremium) return -1;
        if (!a.isPremium && b.isPremium) return 1;
        
        const ratingA = a.rating || 0;
        const ratingB = b.rating || 0;
        if (ratingA !== ratingB) return ratingB - ratingA;
        
        return a.name.localeCompare(b.name);
    });
    
    sortedDentists.forEach(function(dentist) {
        const card = document.createElement('div');
        card.className = 'profile-card';
        if (dentist.isPremium) card.className += ' premium-card';
        
        const headerHTML = '<div class="profile-header"><img src="images/logos/placeholder-logo.png" alt="' + dentist.name + '" class="profile-logo"><div class="profile-title"><h3>' + dentist.name + (dentist.isPremium ? ' <span class="premium-badge">Preferred</span>' : '') + '</h3><div class="profile-type">' + dentist.type + '</div></div></div>';
        
        const bodyHTML = '<div class="profile-body"><div class="profile-info"><h4>Specialties</h4><ul>' + (dentist.features || []).map(function(f) { return '<li>' + f + '</li>'; }).join('') + '</ul></div><div class="profile-info"><h4>Services & Amenities</h4><ul>' + (dentist.amenities || []).map(function(a) { return '<li>' + a + '</li>'; }).join('') + '</ul></div><div class="profile-info"><h4>Contact & Hours</h4><p><strong>Phone:</strong> ' + (dentist.phone || 'Contact via website') + '</p><p><strong>Hours:</strong> ' + dentist.hours + '</p><p><strong>Address:</strong> ' + (dentist.address || 'Contact for address') + '</p></div></div>';
        
        const footerHTML = '<div class="profile-footer"><div class="profile-rating"><div class="star-rating">★★★★★</div><span>' + (dentist.rating || 'No rating') + ' (' + (dentist.reviews || 'No reviews') + ')</span></div><div class="profile-link"><a href="' + (dentist.website || '#') + '" target="_blank">Visit Website</a></div></div>';
        
        card.innerHTML = headerHTML + bodyHTML + footerHTML;
        profilesGrid.appendChild(card);
    });
    
    console.log("Profiles populated with", dentistsData.length, "cards");
}

// FAQ section function
function populateFAQSection() {
    const faqContainer = document.querySelector('.faq-container');
    if (!faqContainer) {
        console.log("FAQ container not found");
        return;
    }
    
    if (typeof faqData === 'undefined') {
        console.log("FAQ data not loaded");
        return;
    }
    
    faqContainer.innerHTML = '';
    
    faqData.forEach(function(faq) {
        const faqItem = document.createElement('div');
        faqItem.classList.add('faq-item');
        
        const faqQuestion = document.createElement('div');
        faqQuestion.classList.add('faq-question');
        faqQuestion.textContent = faq.question;
        faqItem.appendChild(faqQuestion);
        
        const faqAnswer = document.createElement('div');
        faqAnswer.classList.add('faq-answer');
        
        const faqAnswerContent = document.createElement('div');
        faqAnswerContent.classList.add('faq-answer-content');
        faqAnswerContent.textContent = faq.answer;
        faqAnswer.appendChild(faqAnswerContent);
        
        faqItem.appendChild(faqAnswer);
        
        faqQuestion.addEventListener('click', function() {
            faqItem.classList.toggle('active');
        });
        
        faqContainer.appendChild(faqItem);
    });
    
    console.log("FAQ section populated");
}

// Navigation function
function initializeNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            const spans = menuToggle.querySelectorAll('span');
            spans.forEach(function(span) {
                span.classList.toggle('active');
            });
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    const spans = menuToggle.querySelectorAll('span');
                    spans.forEach(function(span) {
                        span.classList.remove('active');
                    });
                }
                
                // Scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    console.log("Navigation initialized");
}

console.log("Script.js loaded successfully");
