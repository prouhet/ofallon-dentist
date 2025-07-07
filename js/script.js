document.addEventListener('DOMContentLoaded', function() {
    // Initialize the site functionality
    initializeNavigation();
    populateComparisonTable();
    populateProfilesGrid();
    initializeMatcher();
    populateFAQSection();
    initializeContactForm();
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
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    menuToggle.querySelectorAll('span').forEach(span => span.classList.remove('active'));
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
        
        // Create gym name cell with logo
        const nameCell = document.createElement('td');
        nameCell.classList.add('gym-name-cell');
        
        const nameWrapper = document.createElement('div');
        nameWrapper.classList.add('name-wrapper');
        
        const logo = document.createElement('img');
        logo.src = dentist.logo || 'images/placeholder-logo.png';
        logo.alt = `${dentist.name} Logo`;
        logo.classList.add('gym-logo-small');
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
            ratingText.textContent = `${dentist.rating} (${dentist.reviews !== 'N/A' ? dentist.reviews : 'No reviews yet'})`;
            
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
        const dentistId = row.querySelector('.gym-name-cell .name-wrapper span').textContent;
        const dentist = dentistsData.find(d => d.name === dentistId);
        
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
    
    // Add profile cards for each dentist
    sortedDentists.forEach(dentist => {
        const profileCard = document.createElement('div');
        profileCard.classList.add('profile-card');
        
        if (dentist.isPremium) {
            profileCard.classList.add('premium-card');
        }
        
        // Create profile header
        const profileHeader = document.createElement('div');
        profileHeader.classList.add('profile-header');
        
        const profileLogo = document.createElement('img');
        profileLogo.src = dentist.logo || 'images/placeholder-logo.png';
        profileLogo.alt = `${dentist.name} Logo`;
        profileLogo.classList.add('profile-logo');
        profileHeader.appendChild(profileLogo);
        
        const profileTitle = document.createElement('div');
        profileTitle.classList.add('profile-title');
        
        const profileName = document.createElement('h3');
        profileName.textContent = dentist.name;
        
        if (dentist.isPremium) {
            const badge = document.createElement('span');
            badge.classList.add('premium-badge');
            badge.textContent = 'Preferred';
            profileName.appendChild(badge);
        }
        
        profileTitle.appendChild(profileName);
        
        const profileType = document.createElement('div');
        profileType.classList.add('profile-type');
        profileType.textContent = dentist.type;
        profileTitle.appendChild(profileType);
        
        profileHeader.appendChild(profileTitle);
        profileCard.appendChild(profileHeader);
        
        // Create profile body
        const profileBody = document.createElement('div');
        profileBody.classList.add('profile-body');
        
        // Add features
        const featuresInfo = document.createElement('div');
        featuresInfo.classList.add('profile-info');
        
        const featuresTitle = document.createElement('h4');
        featuresTitle.textContent = 'Key Features';
        featuresInfo.appendChild(featuresTitle);
        
        const featuresList = document.createElement('ul');
        dentist.features.forEach(feature => {
            const featureItem = document.createElement('li');
            featureItem.textContent = feature;
            featuresList.appendChild(featureItem);
        });
        
        featuresInfo.appendChild(featuresList);
        profileBody.appendChild(featuresInfo);
        
        // Add amenities
        const amenitiesInfo = document.createElement('div');
        amenitiesInfo.classList.add('profile-info');
        
        const amenitiesTitle = document.createElement('h4');
        amenitiesTitle.textContent = 'Amenities';
        amenitiesInfo.appendChild(amenitiesTitle);
        
        const amenitiesList = document.createElement('ul');
        dentist.amenities.forEach(amenity => {
            const amenityItem = document.createElement('li');
            amenityItem.textContent = amenity;
            amenitiesList.appendChild(amenityItem);
        });
        
        amenitiesInfo.appendChild(amenitiesList);
        profileBody.appendChild(amenitiesInfo);
        
        // Add hours
        const hoursInfo = document.createElement('div');
        hoursInfo.classList.add('profile-info');
        
        const hoursTitle = document.createElement('h4');
        hoursTitle.textContent = 'Hours';
        hoursInfo.appendChild(hoursTitle);
        
        const hoursText = document.createElement('p');
        hoursText.textContent = dentist.hours;
        hoursInfo.appendChild(hoursText);
        
        profileBody.appendChild(hoursInfo);
        
        profileCard.appendChild(profileBody);
        
        // Create profile footer
        const profileFooter = document.createElement('div');
        profileFooter.classList.add('profile-footer');
        
        const profileRating = document.createElement('div');
        profileRating.classList.add('profile-rating');
        
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
            
            profileRating.appendChild(ratingDiv);
            
            const ratingText = document.createElement('span');
            ratingText.textContent = `${dentist.rating} (${dentist.reviews !== 'N/A' ? dentist.reviews : 'No reviews yet'})`;
            profileRating.appendChild(ratingText);
        } else {
            profileRating.textContent = 'No rating';
        }
        
        profileFooter.appendChild(profileRating);
        
        const profileLink = document.createElement('div');
        profileLink.classList.add('profile-link');
        
        const websiteLink = document.createElement('a');
        websiteLink.href = dentist.website;
        websiteLink.target = '_blank';
        websiteLink.textContent = 'Visit Website';
        profileLink.appendChild(websiteLink);
        
        profileFooter.appendChild(profileLink);
        
        profileCard.appendChild(profileFooter);
        
        // Add profile card to grid
        profilesGrid.appendChild(profileCard);
    });
}

// Matcher functionality
function initializeMatcher() {
    const matcherOptions = document.querySelectorAll('.matcher-option');
    const questions = document.querySelectorAll('.matcher-question');
    const result = document.querySelector('#matcher-result');
    const restartButton = document.querySelector('#restart-matcher');
    
    if (!matcherOptions.length || !questions.length || !result || !restartButton) return;
    
    // Store user selections
    const userSelections = {
        careType: '',
        anxiety: '',
        schedule: '',
        children: '',
        budget: ''
    };
    
    let currentQuestion = 1;
    
    // Add click event to options
    matcherOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options in this question
            const parentQuestion = this.closest('.matcher-question');
            parentQuestion.querySelectorAll('.matcher-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Store selection
            const value = this.getAttribute('data-value');
            const questionId = parentQuestion.getAttribute('id');
            
            if (questionId === 'question-1') userSelections.careType = value;
            if (questionId === 'question-2') userSelections.anxiety = value;
            if (questionId === 'question-3') userSelections.schedule = value;
            if (questionId === 'question-4') userSelections.children = value;
            if (questionId === 'question-5') userSelections.budget = value;
            
            // Move to next question after a short delay
            setTimeout(() => {
                if (currentQuestion < 5) {
                    // Hide current question
                    parentQuestion.classList.remove('active');
                    
                    // Show next question
                    currentQuestion++;
                    document.querySelector(`#question-${currentQuestion}`).classList.add('active');
                } else {
                    // Hide last question
                    parentQuestion.classList.remove('active');
                    
                    // Show results
                    showMatcherResults(userSelections);
                    result.classList.add('active');
                }
            }, 300);
        });
    });
    
    // Restart button
    restartButton.addEventListener('click', function() {
        // Reset selections
        userSelections.careType = '';
        userSelections.anxiety = '';
        userSelections.schedule = '';
        userSelections.children = '';
        userSelections.budget = '';
        
        // Reset selected options
        matcherOptions.forEach(option => {
            option.classList.remove('selected');
        });
        
        // Hide result
        result.classList.remove('active');
        
        // Show first question
        currentQuestion = 1;
        questions.forEach(question => {
            question.classList.remove('active');
        });
        document.querySelector('#question-1').classList.add('active');
    });
}

// Function to determine the best dentist matches based on user selections
function showMatcherResults(selections) {
    const resultContent = document.querySelector('#result-content');
    if (!resultContent) return;
    
    // Clear previous results
    resultContent.innerHTML = '';
    
    // Define weights for different criteria
    const weights = {
        careType: 0.3,
        anxiety: 0.2,
        schedule: 0.15,
        children: 0.15,
        budget: 0.2
    };
    
    // Calculate match score for each dentist
    const dentistScores = dentistsData.map(dentist => {
        let score = 0;
        
        // Care Type matching
        if (selections.careType === 'general' && dentist.type.toLowerCase().includes('general')) {
            score += weights.careType;
        } else if (selections.careType === 'cosmetic' && dentist.type.toLowerCase().includes('cosmetic')) {
            score += weights.careType;
        } else if (selections.careType === 'pediatric' && (dentist.type.toLowerCase().includes('pediatric') || dentist.isPediatricFriendly)) {
            score += weights.careType;
        } else if (selections.careType === 'specialty' && !dentist.type.toLowerCase().includes('general') && 
                  !dentist.type.toLowerCase().includes('cosmetic') && !dentist.type.toLowerCase().includes('family')) {
            score += weights.careType;
        }
        
        // Anxiety matching
        if (selections.anxiety === 'high' && dentist.offersSedation) {
            score += weights.anxiety;
        } else if (selections.anxiety === 'moderate' && dentist.offersSedation) {
            score += weights.anxiety * 0.8;
        } else if (selections.anxiety === 'low') {
            score += weights.anxiety;
        }
        
        // Schedule matching
        if (selections.schedule === 'evening' && dentist.hasEveningHours) {
            score += weights.schedule;
        } else if (selections.schedule === 'weekend' && dentist.hours.toLowerCase().includes('sat')) {
            score += weights.schedule;
        } else if (selections.schedule === 'standard') {
            score += weights.schedule;
        }
        
        // Children matching
        if (selections.children === 'specialist' && dentist.type.toLowerCase().includes('pediatric')) {
            score += weights.children;
        } else if (selections.children === 'family' && dentist.isPediatricFriendly) {
            score += weights.children;
        } else if (selections.children === 'adult') {
            score += weights.children;
        }
        
        // Budget matching
        if (selections.budget === 'budget' && dentist.price.toLowerCase().includes('budget')) {
            score += weights.budget;
        } else if (selections.budget === 'mid' && dentist.price.toLowerCase().includes('moderate')) {
            score += weights.budget;
        } else if (selections.budget === 'premium' && dentist.price.toLowerCase().includes('premium')) {
            score += weights.budget;
        }
        
        // Special case: Spring Valley Dental Group should appear for specific combinations
        if (dentist.id === 'springvalley') {
            // Weight Loss>small group>$50-$100
            if ((selections.careType === 'general' || selections.careType === 'cosmetic') && 
                selections.anxiety !== 'high' && selections.budget === 'mid') {
                score += 0.2;
            }
            
            // Weight Loss>private>$100+
            if ((selections.careType === 'general' || selections.careType === 'cosmetic') && 
                selections.anxiety === 'high' && selections.budget === 'premium') {
                score += 0.2;
            }
            
            // Muscle Gain>small group>$50-$100
            if (selections.careType === 'cosmetic' && selections.anxiety !== 'high' && 
                selections.budget === 'mid') {
                score += 0.2;
            }
            
            // Muscle Gain>private>$100+
            if (selections.careType === 'cosmetic' && selections.anxiety === 'high' && 
                selections.budget === 'premium') {
                score += 0.2;
            }
            
            // General Fitness>group setting>$50-$100
            if (selections.careType === 'general' && selections.children === 'family' && 
                selections.budget === 'mid') {
                score += 0.2;
            }
            
            // General Fitness>private>$100+
            if (selections.careType === 'general' && selections.anxiety === 'high' && 
                selections.budget === 'premium') {
                score += 0.2;
            }
            
            // Specialized training>private>$100+
            if (selections.careType === 'specialty' && selections.anxiety === 'high' && 
                selections.budget === 'premium') {
                score += 0.2;
            }
        }
        
        return {
            dentist,
            score
        };
    });
    
    // Sort by score (highest first)
    dentistScores.sort((a, b) => b.score - a.score);
    
    // Take top 3 matches
    const topMatches = dentistScores.slice(0, 3);
    
    // Create result elements
    topMatches.forEach(match => {
        const dentist = match.dentist;
        
        const resultDentist = document.createElement('div');
        resultDentist.classList.add('result-dentist');
        
        if (dentist.isPremium) {
            resultDentist.classList.add('premium-result');
        }
        
        const dentistName = document.createElement('h4');
        dentistName.textContent = dentist.name;
        
        if (dentist.isPremium) {
            const badge = document.createElement('span');
            badge.classList.add('premium-badge');
            badge.textContent = 'Preferred';
            dentistName.appendChild(badge);
        }
        
        resultDentist.appendChild(dentistName);
        
        const dentistType = document.createElement('p');
        dentistType.textContent = dentist.type;
        resultDentist.appendChild(dentistType);
        
        const matchReason = document.createElement('p');
        matchReason.innerHTML = '<strong>Why this match:</strong> ';
        
        // Generate reason based on selections
        const reasons = [];
        
        if (selections.careType === 'general' && dentist.type.toLowerCase().includes('general')) {
            reasons.push('Offers general dentistry');
        } else if (selections.careType === 'cosmetic' && dentist.type.toLowerCase().includes('cosmetic')) {
            reasons.push('Specializes in cosmetic dentistry');
        } else if (selections.careType === 'pediatric' && (dentist.type.toLowerCase().includes('pediatric') || dentist.isPediatricFriendly)) {
            reasons.push('Great for children');
        } else if (selections.careType === 'specialty' && !dentist.type.toLowerCase().includes('general')) {
            reasons.push('Offers specialty services');
        }
        
        if (selections.anxiety === 'high' && dentist.offersSedation) {
            reasons.push('Provides sedation options');
        }
        
        if (selections.schedule === 'evening' && dentist.hasEveningHours) {
            reasons.push('Offers evening hours');
        }
        
        if (selections.children === 'specialist' && dentist.type.toLowerCase().includes('pediatric')) {
            reasons.push('Pediatric specialist');
        } else if (selections.children === 'family' && dentist.isPediatricFriendly) {
            reasons.push('Family-friendly practice');
        }
        
        if (reasons.length > 0) {
            matchReason.textContent += reasons.join(', ');
        } else {
            matchReason.textContent += 'Good overall match for your preferences';
        }
        
        resultDentist.appendChild(matchReason);
        
        const websiteLink = document.createElement('a');
        websiteLink.href = dentist.website;
        websiteLink.target = '_blank';
        websiteLink.classList.add('btn');
        websiteLink.textContent = 'Visit Website';
        resultDentist.appendChild(websiteLink);
        
        resultContent.appendChild(resultDentist);
    });
}

// FAQ section functionality
function populateFAQSection() {
    const faqContainer = document.querySelector('.faq-container');
    if (!faqContainer || !faqData) return;
    
    // Clear existing FAQs
    faqContainer.innerHTML = '';
    
    // Add FAQ items
    faqData.forEach((faq, index) => {
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
}

// Contact form functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Simple validation
        if (!name || !email || !message) {
            alert('Please fill in all fields');
            return;
        }
        
        // In a real application, you would send this data to a server
        // For now, just show a success message
        alert('Thank you for your message! We will get back to you soon.');
        
        // Reset form
        contactForm.reset();
    });
}
