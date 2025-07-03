// Initialize the site functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('FAQ Debug:');
    console.log('faqData exists:', typeof faqData !== 'undefined');
    console.log('faqData length:', faqData ? faqData.length : 'undefined');
    console.log('FAQ container exists:', !!document.querySelector('.faq-container'));
    
    initializeNavigation();
    populateComparisonTable();
    populateProfilesGrid();
    initializeMatcher();
    populateFAQSection();
});

// Navigation functionality
function initializeNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            const spans = menuToggle.querySelectorAll('span');
            spans.forEach(span => span.classList.toggle('active'));
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    if (menuToggle) {
                        menuToggle.querySelectorAll('span').forEach(span => span.classList.remove('active'));
                    }
                }
                
                // Scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Comparison table functionality
function populateComparisonTable() {
    const tableBody = document.querySelector('#comparison-table tbody');
    if (!tableBody) return;
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    // Sort dentists to put premium (Spring Valley) first, then by rating
    const sortedDentists = [...dentistsData].sort((a, b) => {
        if (a.isPremium && !b.isPremium) return -1;
        if (!a.isPremium && b.isPremium) return 1;
        
        // If both are premium or both are not, sort by rating
        const ratingA = a.rating || 0;
        const ratingB = b.rating || 0;
        
        if (ratingA !== ratingB) {
            return ratingB - ratingA; // Higher rating first
        }
        
        // If ratings are equal, sort alphabetically
        return a.name.localeCompare(b.name);
    });
    
    // Add rows for each dentist
    sortedDentists.forEach(dentist => {
        const row = document.createElement('tr');
        if (dentist.isPremium) {
            row.classList.add('premium-row');
        }
        
        // Create dentist name cell with logo
        const nameCell = document.createElement('td');
        nameCell.classList.add('gym-name-cell');
        
        const nameWrapper = document.createElement('div');
        nameWrapper.classList.add('name-wrapper');
        
        const logo = document.createElement('img');
        logo.src = dentist.logo || 'images/placeholder-logo.png';
        logo.alt = dentist.name + ' Logo';
        logo.classList.add('gym-logo-small');
        logo.onerror = function() {
            this.style.display = 'none';
        };
        nameWrapper.appendChild(logo);
        
        const nameSpan = document.createElement('span');
        nameSpan.textContent = dentist.name;
        nameWrapper.appendChild(nameSpan);
        
        if (dentist.isPremium) {
            const badge = document.createElement('span');
            badge.classList.add('premium-badge');
            badge.textContent = 'Preferred';
            nameWrapper.appendChild(badge);
        }
        
        nameCell.appendChild(nameWrapper);
        row.appendChild(nameCell);
        
        // Add type cell
        const typeCell = document.createElement('td');
        typeCell.textContent = dentist.type;
        row.appendChild(typeCell);
        
        // Add price cell
        const priceCell = document.createElement('td');
        priceCell.textContent = dentist.price;
        row.appendChild(priceCell);
        
        // Add hours cell
        const hoursCell = document.createElement('td');
        hoursCell.textContent = dentist.hours;
        row.appendChild(hoursCell);
        
        // Add features cell
        const featuresCell = document.createElement('td');
        const featuresList = document.createElement('ul');
        
        dentist.features.slice(0, 3).forEach(feature => {
            const featureItem = document.createElement('li');
            featureItem.textContent = feature;
            featuresList.appendChild(featureItem);
        });
        
        featuresCell.appendChild(featuresList);
        row.appendChild(featuresCell);
        
        // Add rating cell
        const ratingCell = document.createElement('td');
        
        if (dentist.rating) {
            const ratingDiv = document.createElement('div');
            ratingDiv.classList.add('star-rating');
            
            // Create star rating
            const fullStars = Math.floor(dentist.rating);
            const hasHalfStar = dentist.rating % 1 >= 0.5;
            
            for (let i = 0; i < 5; i++) {
                const star = document.createElement('i');
                
                if (i < fullStars) {
                    star.className = 'fas fa-star';
                } else if (i === fullStars && hasHalfStar) {
                    star.className = 'fas fa-star-half-alt';
                } else {
                    star.className = 'far fa-star';
                }
                
                ratingDiv.appendChild(star);
            }
            
            const ratingText = document.createElement('div');
            ratingText.textContent = dentist.rating + ' (' + (dentist.reviews !== 'N/A' ? dentist.reviews + ' reviews' : 'New practice') + ')';
            
            ratingCell.appendChild(ratingDiv);
            ratingCell.appendChild(ratingText);
        } else {
            ratingCell.textContent = 'No rating';
        }
        
        row.appendChild(ratingCell);
        
        // Add row to table
        tableBody.appendChild(row);
    });
    
    // Initialize filters
    initializeFilters();
}

// Filter functionality
function initializeFilters() {
    const typeFilter = document.getElementById('type-filter');
    const priceFilter = document.getElementById('price-filter');
    const amenityFilter = document.getElementById('amenity-filter');
    
    if (!typeFilter || !priceFilter || !amenityFilter) return;
    
    const filters = [typeFilter, priceFilter, amenityFilter];
    
    filters.forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });
}

function applyFilters() {
    const typeFilter = document.getElementById('type-filter').value;
    const priceFilter = document.getElementById('price-filter').value;
    const amenityFilter = document.getElementById('amenity-filter').value;
    
    const rows = document.querySelectorAll('#comparison-table tbody tr');
    
    rows.forEach(row => {
        const dentistName = row.querySelector('.gym-name-cell .name-wrapper span').textContent;
        const dentist = dentistsData.find(d => d.name === dentistName);
        
        if (!dentist) {
            row.style.display = 'none';
            return;
        }
        
        // Type filter
        let showByType = typeFilter === 'all';
        if (typeFilter === 'general' && dentist.type.toLowerCase().includes('general')) showByType = true;
        if (typeFilter === 'cosmetic' && dentist.type.toLowerCase().includes('cosmetic')) showByType = true;
        if (typeFilter === 'pediatric' && dentist.type.toLowerCase().includes('pediatric')) showByType = true;
        if (typeFilter === 'orthodontic' && dentist.type.toLowerCase().includes('orthodontic')) showByType = true;
        if (typeFilter === 'specialty' && !dentist.type.toLowerCase().includes('general') && 
            !dentist.type.toLowerCase().includes('cosmetic') && !dentist.type.toLowerCase().includes('pediatric')) showByType = true;
        
        // Price filter
        let showByPrice = priceFilter === 'all';
        if (priceFilter === 'budget' && dentist.price.toLowerCase().includes('budget')) showByPrice = true;
        if (priceFilter === 'mid' && dentist.price.toLowerCase().includes('moderate')) showByPrice = true;
        if (priceFilter === 'premium' && dentist.price.toLowerCase().includes('premium')) showByPrice = true;
        
        // Amenity filter
        let showByAmenity = amenityFilter === 'all';
        if (amenityFilter === 'sedation' && dentist.offersSedation) showByAmenity = true;
        if (amenityFilter === 'pediatric' && dentist.isPediatricFriendly) showByAmenity = true;
        if (amenityFilter === 'evening' && dentist.hasEveningHours) showByAmenity = true;
        if (amenityFilter === 'inhouse' && dentist.hasInHousePlan) showByAmenity = true;
        
        // Show or hide row based on filters
        if (showByType && showByPrice && showByAmenity) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Profiles grid functionality  
function populateProfilesGrid() {
    const profilesGrid = document.querySelector('.profiles-grid');
    if (!profilesGrid) return;
    
    // Clear existing profiles
    profilesGrid.innerHTML = '';
    
    // Sort dentists to put premium first, then by rating
    const sortedDentists = [...dentistsData].sort((a, b) => {
        if (a.isPremium && !b.isPremium) return -1;
        if (!a.isPremium && b.isPremium) return 1;
        
        const ratingA = a.rating || 0;
        const ratingB = b.rating || 0;
        
        if (ratingA !== ratingB) {
            return ratingB - ratingA; // Higher rating first
        }
        
        return a.name.localeCompare(b.name);
    });
    
    // Enhanced descriptions using strategic insights and patient psychology
    const enhancedDescriptions = {
        "springvalley": {
            title: "The Family-First Choice",
            description: "Spring Valley Dental Group has earned its reputation as O'Fallon's premier family dental practice through genuine care and personalized attention. What sets them apart? They actually listen. Instead of rushing through appointments, they take time to understand your concerns, explain treatments clearly, and create custom care plans that fit your family's needs and budget.",
            perfectFor: "Families wanting comprehensive care under one roof, patients seeking personalized attention over assembly-line dentistry, those who value long-term dental relationships",
            standoutFeature: "Personalized patient education approach - you'll leave understanding exactly what's happening with your dental health and why"
        },
        "innovationdental": {
            title: "The Technology & Implant Leaders", 
            description: "Innovation Dental lives up to their name with cutting-edge technology and specialized expertise, especially in dental implants and sedation dentistry. Their Insight Avenue location features state-of-the-art equipment including same-day crown technology.",
            perfectFor: "Patients needing complex procedures like implants, anyone wanting the latest dental technology, those requiring IV sedation",
            standoutFeature: "Fellowship-trained implant specialist with same-day crown technology and licensed IV sedation capabilities"
        }
    };
    
    // Add profile cards for each dentist
    sortedDentists.forEach(dentist => {
        const profileCard = document.createElement('div');
        profileCard.classList.add('profile-card');
        
        if (dentist.isPremium) {
            profileCard.classList.add('premium-card');
        }
        
        const enhanced = enhancedDescriptions[dentist.id] || {
            title: "Quality Dental Care",
            description: dentist.features.join(', ') + ". " + dentist.amenities.join(', ') + ".",
            perfectFor: "General dental care needs",
            standoutFeature: dentist.features[0] || "Quality dental services"
        };
        
        profileCard.innerHTML = '<div class="profile-header">' +
            '<img src="' + dentist.logo + '" alt="' + dentist.name + ' Logo" class="profile-logo" onerror="this.style.display=\'none\'">' +
            '<div class="profile-title">' +
                '<h3>' + dentist.name + (dentist.isPremium ? ' <span class="premium-badge">Preferred</span>' : '') + '</h3>' +
                '<div class="profile-type">' + enhanced.title + '</div>' +
            '</div>' +
        '</div>' +
        '<div class="profile-body">' +
            '<div class="profile-info">' +
                '<h4>What Makes Them Special</h4>' +
                '<p>' + enhanced.description + '</p>' +
            '</div>' +
            '<div class="profile-info">' +
                '<h4>Perfect For</h4>' +
                '<p>' + enhanced.perfectFor + '</p>' +
            '</div>' +
            '<div class="profile-info">' +
                '<h4>Standout Feature</h4>' +
                '<p>' + enhanced.standoutFeature + '</p>' +
            '</div>' +
            '<div class="profile-info">' +
                '<h4>Hours & Contact</h4>' +
                '<p><strong>Hours:</strong> ' + dentist.hours + '</p>' +
                '<p><strong>Address:</strong> ' + dentist.address + '</p>' +
                (dentist.phone !== "Contact via website" ? '<p><strong>Phone:</strong> ' + dentist.phone + '</p>' : '') +
            '</div>' +
        '</div>' +
        '<div class="profile-footer">' +
            '<div class="profile-rating">' +
                (dentist.rating ? 
                    '<div class="star-rating">' +
                        Array(Math.floor(dentist.rating)).fill('<i class="fas fa-star"></i>').join('') +
                        (dentist.rating % 1 >= 0.5 ? '<i class="fas fa-star-half-alt"></i>' : '') +
                        Array(5 - Math.ceil(dentist.rating)).fill('<i class="far fa-star"></i>').join('') +
                    '</div>' +
                    '<span>' + dentist.rating + ' (' + (dentist.reviews !== 'N/A' ? dentist.reviews + ' reviews' : 'New practice') + ')</span>'
                : 'No rating available') +
            '</div>' +
            '<div class="profile-link">' +
                '<a href="' + dentist.website + '" target="_blank">Visit Website</a>' +
            '</div>' +
        '</div>';
        
        profilesGrid.appendChild(profileCard);
    });
}

// Matcher functionality - simplified version
function initializeMatcher() {
    const matcherOptions = document.querySelectorAll('.matcher-option');
    const questions = document.querySelectorAll('.matcher-question');
    const result = document.querySelector('#matcher-result');
    const restartButton = document.querySelector('#restart-matcher');
    
    if (!matcherOptions.length || !questions.length || !result || !restartButton) return;
    
    console.log('Matcher initialized successfully');
}

// FAQ section functionality - SIMPLIFIED AND FIXED
function populateFAQSection() {
    console.log('populateFAQSection called');
    
    const faqContainer = document.querySelector('.faq-container');
    console.log('FAQ container found:', !!faqContainer);
    
    if (!faqContainer) {
        console.log('ERROR: FAQ container not found');
        return;
    }
    
    if (!window.faqData) {
        console.log('ERROR: faqData not found');
        return;
    }
    
    console.log('faqData length:', window.faqData.length);
    
    // Clear existing FAQs
    faqContainer.innerHTML = '';
    
    // Add FAQ items
    window.faqData.forEach(function(faq, index) {
        console.log('Adding FAQ item:', index + 1);
        
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
        
        // Add click event
        faqQuestion.addEventListener('click', function() {
            faqItem.classList.toggle('active');
        });
        
        faqContainer.appendChild(faqItem);
    });
    
    console.log('FAQ section populated successfully');
}
