document.addEventListener('DOMContentLoaded', function() {
    console.log('FAQ Debug:');
    console.log('faqData exists:', typeof faqData !== 'undefined');
    console.log('faqData length:', faqData ? faqData.length : 'undefined');
    console.log('FAQ container exists:', !!document.querySelector('.faq-container'));
});
















// Initialize the site functionality
document.addEventListener('DOMContentLoaded', function() {
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
        logo.alt = `${dentist.name} Logo`;
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
            ratingText.textContent = `${dentist.rating} (${dentist.reviews !== 'N/A' ? dentist.reviews + ' reviews' : 'New practice'})`;
            
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
            description: "Spring Valley Dental Group has earned its reputation as O'Fallon's premier family dental practice through genuine care and personalized attention. What sets them apart? They actually listen. Instead of rushing through appointments, they take time to understand your concerns, explain treatments clearly, and create custom care plans that fit your family's needs and budget. Their approach addresses the core needs of the 'Busy Parent/Family' profile - reliable, comprehensive care with a personal touch.",
            perfectFor: "Families wanting comprehensive care under one roof, patients seeking personalized attention over assembly-line dentistry, those who value long-term dental relationships",
            standoutFeature: "Personalized patient education approach - you'll leave understanding exactly what's happening with your dental health and why"
        },
        "innovationdental": {
            title: "The Technology & Implant Leaders", 
            description: "Innovation Dental lives up to their name with cutting-edge technology and specialized expertise, especially in dental implants and sedation dentistry. Dr. Schillinger's Fellowship in the International Congress of Oral Implantologists sets them apart from general practitioners. Their Insight Avenue location features state-of-the-art equipment including same-day crown technology. With over 1,000 patient reviews maintaining high satisfaction, they've proven their technology-forward approach delivers results.",
            perfectFor: "Patients needing complex procedures like implants, anyone wanting the latest dental technology, those requiring IV sedation, the 'Cosmetic Seeker' profile",
            standoutFeature: "Fellowship-trained implant specialist with same-day crown technology and licensed IV sedation capabilities"
        },
        "bollmeierdental": {
            title: "The Comfort & Anxiety Specialists",
            description: "Bollmeier Dental has mastered the art of making dental visits actually pleasant, directly addressing the 'Anxious Patient' profile. Their Highway 50 location features massage chairs, a comfort dog on staff, and nitrous oxide for nervous patients. With 312 Google reviews averaging 4.9 stars, patients consistently praise the spa-like amenities and genuine warmth. This unique combination makes them especially popular with families and anyone who dreads dental visits.",
            perfectFor: "Anxious patients seeking comfort-focused care, families with children, anyone wanting a spa-like dental experience, evening appointment needs",
            standoutFeature: "Only practice in O'Fallon with certified comfort dog therapy, plus massage chairs and extended evening hours"
        },
        "parkplacedental": {
            title: "The Flexible Family Option",
            description: "Park Place Dental Group in Shiloh offers the perfect balance of quality care and convenience for busy O'Fallon families. Their extended Monday-Thursday hours, comprehensive family services, and flexible payment options address the core needs of the 'Busy Parent/Family' profile. With in-house payment plans and multiple sedation options, they've built a reputation for being accommodating with both scheduling and financial arrangements.",
            perfectFor: "Busy families needing flexible scheduling, patients wanting comprehensive care with payment plans, those preferring Shiloh location convenience",
            standoutFeature: "Most flexible scheduling in the area with extended weekday hours and comprehensive in-house payment plans"
        },
        "greenmountfamily": {
            title: "The Cosmetic & Evening Hours Focus",
            description: "Green Mount Family Dentistry on North Greenmount Road specializes in creating beautiful smiles while maintaining family practice convenience. As a certified Invisalign provider with extensive cosmetic services, they appeal to the 'Cosmetic Seeker' profile. Their modern facility with evening hours makes cosmetic care convenient for working professionals who want to improve their smile without disrupting their schedule.",
            perfectFor: "Patients wanting cosmetic improvements, certified Invisalign candidates, those needing evening appointments, smile makeover consultations",
            standoutFeature: "Certified Invisalign specialist with extensive cosmetic dentistry experience and convenient evening hours"
        },
        "lakepointedental": {
            title: "The Emergency & Comprehensive Care",
            description: "Lake Pointe Dental Group excels at comprehensive dental care with particular strength in emergency availability, addressing the 'Problem-Solver' patient profile. Their Monday and Thursday extended hours, combined with same-day emergency appointments and sedation options, make them a solid choice for both routine and urgent care needs. With 285 Google reviews and strong community trust, they've proven reliable for families wanting quality care with convenience.",
            perfectFor: "Patients needing emergency care availability, those wanting thorough comprehensive care, Monday/Thursday evening appointment needs, sedation candidates",
            standoutFeature: "Exceptional emergency care availability with same-day appointments and extended hours twice weekly"
        },
        "shilohdentalgroup": {
            title: "The Advanced Restorative Specialists",
            description: "Shiloh Dental Group brings specialized prosthodontic expertise to the O'Fallon area, addressing complex dental needs that go beyond general practice capabilities. Their focus on advanced restorative procedures and comprehensive dental rehabilitation makes them ideal for patients with complex clinical needs requiring specialized treatment. With a perfect 5.0 rating from 263 reviews, they've demonstrated exceptional outcomes in challenging cases.",
            perfectFor: "Patients needing complex restorative work, prosthodontic procedures requiring specialist expertise, comprehensive dental rehabilitation cases",
            standoutFeature: "Prosthodontic specialty expertise for complex restorative and reconstructive dental needs beyond general practice scope"
        },
        "softtouchdentistry": {
            title: "The Gentle Anxiety Management",
            description: "Soft Touch Dentistry lives up to their name with an especially gentle approach specifically designed for the 'Anxious Patient' profile. They specialize in making nervous patients comfortable with both oral and IV sedation options in a spa-like environment, while maintaining high clinical standards for comprehensive family care. Their anxiety-focused philosophy addresses the emotional barriers that prevent many people from seeking needed dental care.",
            perfectFor: "Patients with severe dental anxiety, those who've had negative dental experiences, families wanting gentle care for all ages, IV sedation candidates",
            standoutFeature: "Specializes in gentle, anxiety-free care with comprehensive sedation options in a spa-like environment"
        },
        "aspendental": {
            title: "The Transparent Budget Option",
            description: "Aspen Dental on West Highway 50 offers standardized care at competitive prices with transparent pricing - a rarity in the O'Fallon market. As a national chain, they provide consistency and convenience with extended hours and streamlined processes. Their Peace of Mind Promise® and upfront pricing discussions make them appealing to budget-conscious patients who value predictable costs and convenient scheduling over premium amenities.",
            perfectFor: "Budget-conscious patients, those needing dentures or basic restorative services, patients wanting transparent pricing discussions, extended hours and convenient scheduling",
            standoutFeature: "Most transparent pricing in O'Fallon with Peace of Mind Promise warranty and national chain reliability"
        },
        "allgrins4kids": {
            title: "The Pediatric Specialists",
            description: "All Grins 4 Kids on Tamarack Lane is O'Fallon's dedicated pediatric dental practice, featuring board-certified pediatric dentists with specialized training in child development and behavior management. Their child-friendly environment, specialized training in pediatric dentistry, and experience with special needs patients make them the definitive choice for parents wanting expert care designed specifically for children rather than adapted adult care.",
            perfectFor: "Children needing specialized pediatric care, kids with special needs requiring expert management, parents wanting board-certified pediatric specialists",
            standoutFeature: "Only dedicated pediatric dental specialist in O'Fallon area with board certification and special needs expertise"
        },
        "dreamdentist": {
            title: "The Luxury Cosmetic & Sedation Specialists",
            description: "Dream Dentist on West Highway 50 has built their practice around the unique combination of high-end cosmetic dentistry and licensed IV sedation, creating a category of one in the O'Fallon market. Dr. Thompson's reputation as an award-winning cosmetic dentist combined with her licensing for IV sedation makes them the definitive choice for the 'Cosmetic Seeker' who also fits the 'Anxious Patient' profile. Their spa-like environment and perfect Google rating validate their premium positioning.",
            perfectFor: "Patients with severe dental anxiety seeking cosmetic procedures, those wanting premium aesthetic results, anyone needing IV sedation for complex work",
            standoutFeature: "Only practice combining licensed IV sedation with award-winning cosmetic dentistry in a luxury spa-like environment"
        },
        "hometowndental": {
            title: "The Transparent Hometown Approach",
            description: "Hometown Dental on Talon Drive offers personalized, small-town dental care with transparent pricing and clear treatment communication - addressing patients who feel overwhelmed by complex treatment presentations and hidden costs. Their friendly, no-pressure approach and commitment to honest communication makes them popular with patients who want straightforward dental care without surprises or high-pressure sales tactics.",
            perfectFor: "Patients wanting honest, transparent care without sales pressure, those preferring small-practice personal relationships, budget-conscious families seeking clear pricing",
            standoutFeature: "Transparent pricing philosophy with no-pressure treatment discussions and honest communication"
        },
        "markmedder": {
            title: "The Personal Relationship Focus",
            description: "Mark Medder DMD provides personalized dental care with flexible scheduling including evening appointments, addressing patients who want to build a personal relationship with their dentist rather than feeling like a number in a large practice. Dr. Medder's individualized approach and willingness to accommodate unique scheduling needs makes this practice ideal for patients wanting personal attention and accessibility.",
            perfectFor: "Patients wanting personal relationships with their dentist, those needing evening appointments, individuals seeking highly personalized care and attention",
            standoutFeature: "Highly personalized care with flexible evening scheduling and individual attention from Dr. Medder"
        },
        "cambridgedental": {
            title: "The Community Trust Leaders",
            description: "Cambridge Dental Care offers dependable, comprehensive dental services with exceptional community trust, evidenced by their outstanding 4.9 rating from 943 reviews - one of the highest volumes in O'Fallon. Their advanced capabilities including Laser Assisted Periodontal Therapy (LAPT) and established reputation make them a trusted choice for families seeking reliable dental services with advanced treatment options when needed.",
            perfectFor: "Families wanting consistent, reliable care backed by massive community trust, patients seeking general and cosmetic services with advanced periodontal capabilities",
            standoutFeature: "Exceptional community trust with 943 Google reviews averaging 4.9 stars, plus advanced laser dentistry capabilities"
        },
        "frankscottdental": {
            title: "The Greater O'Fallon Area Option",
            description: "Frank Scott Parkway Dental serves the greater O'Fallon area from their Swansea location, providing convenient access for patients in the broader region. With Thursday evening hours and a focus on quality general and cosmetic care, they offer reliable dental services for patients who prefer the Swansea area or need Thursday evening availability that's limited elsewhere.",
            perfectFor: "Patients in Swansea/Belleville area, those needing Thursday evening appointments specifically, general and cosmetic dental needs for greater O'Fallon region",
            standoutFeature: "Convenient Swansea location with Thursday evening hours serving the greater O'Fallon area"
        },
        "azarorthodontics": {
            title: "The Orthodontic Transformation Specialists",
            description: "Azar Orthodontics specializes exclusively in orthodontic treatment, offering comprehensive braces and aligner therapy for patients of all ages. As board-certified orthodontic specialists, their focused expertise in smile transformation and comprehensive bite correction makes them the definitive choice for complex orthodontic cases that require specialist-level expertise beyond what general dentists can provide with basic aligner therapy.",
            perfectFor: "Patients needing comprehensive orthodontic treatment, teenagers and adults wanting complex smile transformation, cases requiring specialist-level orthodontic expertise",
            standoutFeature: "Board-certified orthodontic specialists with exclusive focus on comprehensive smile transformation beyond basic aligner therapy"
        },
        "dentalstudio": {
            title: "The Modern Comprehensive Studio",
            description: "The Dental Studio combines general dentistry with cosmetic services in a modern, comfortable studio environment. Their in-house payment plans, family-friendly approach, and comprehensive services make them a versatile choice for families wanting quality care with flexible payment options in a contemporary setting that feels more like a modern studio than a traditional dental office.",
            perfectFor: "Families wanting comprehensive services in a modern environment, patients needing in-house payment plans, those seeking contemporary dental studio atmosphere",
            standoutFeature: "Modern dental studio atmosphere with comprehensive services and flexible in-house payment plans for family accessibility"
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
        
        profileCard.innerHTML = `
            <div class="profile-header">
                <img src="${dentist.logo}" alt="${dentist.name} Logo" class="profile-logo" onerror="this.style.display='none'">
                <div class="profile-title">
                    <h3>${dentist.name} ${dentist.isPremium ? '<span class="premium-badge">Preferred</span>' : ''}</h3>
                    <div class="profile-type">${enhanced.title}</div>
                </div>
            </div>
            
            <div class="profile-body">
                <div class="profile-info">
                    <h4>What Makes Them Special</h4>
                    <p>${enhanced.description}</p>
                </div>
                
                <div class="profile-info">
                    <h4>Perfect For</h4>
                    <p>${enhanced.perfectFor}</p>
                </div>
                
                <div class="profile-info">
                    <h4>Standout Feature</h4>
                    <p>${enhanced.standoutFeature}</p>
                </div>
                
                <div class="profile-info">
                    <h4>Hours & Contact</h4>
                    <p><strong>Hours:</strong> ${dentist.hours}</p>
                    <p><strong>Address:</strong> ${dentist.address}</p>
                    ${dentist.phone !== "Contact via website" ? `<p><strong>Phone:</strong> ${dentist.phone}</p>` : ''}
                </div>
            </div>
            
            <div class="profile-footer">
                <div class="profile-rating">
                    ${dentist.rating ? `
                        <div class="star-rating">
                            ${Array(Math.floor(dentist.rating)).fill('<i class="fas fa-star"></i>').join('')}
                            ${dentist.rating % 1 >= 0.5 ? '<i class="fas fa-star-half-alt"></i>' : ''}
                            ${Array(5 - Math.ceil(dentist.rating)).fill('<i class="far fa-star"></i>').join('')}
                        </div>
                        <span>${dentist.rating} (${dentist.reviews !== 'N/A' ? dentist.reviews + ' reviews' : 'New practice'})</span>
                    ` : 'No rating available'}
                </div>
                
                <div class="profile-link">
                    <a href="${dentist.website}" target="_blank">Visit Website</a>
                </div>
            </div>
        `;
        
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
        Object.keys(userSelections).forEach(key => userSelections[key] = '');
        
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
        anxiety: 0.25,
        schedule: 0.15,
        children: 0.15,
        budget: 0.15
    };
    
    // Calculate match score for each dentist
    const dentistScores = dentistsData.map(dentist => {
        let score = 0;
        const reasons = [];
        
        // Care Type matching
        if (selections.careType === 'general' && dentist.type.toLowerCase().includes('general')) {
            score += weights.careType;
            reasons.push('Excellent general dentistry');
        } else if (selections.careType === 'cosmetic' && dentist.type.toLowerCase().includes('cosmetic')) {
            score += weights.careType;
            reasons.push('Specializes in cosmetic services');
        } else if (selections.careType === 'pediatric' && (dentist.type.toLowerCase().includes('pediatric') || dentist.isPediatricFriendly)) {
            score += weights.careType;
            reasons.push('Great with children');
        } else if (selections.careType === 'specialty' && (dentist.type.toLowerCase().includes('implant') || dentist.type.toLowerCase().includes('orthodontic'))) {
            score += weights.careType;
            reasons.push('Offers specialty services');
        }
        
        // Anxiety matching
        if (selections.anxiety === 'high' && dentist.offersSedation) {
            score += weights.anxiety;
            reasons.push('Provides sedation options for anxiety');
        } else if (selections.anxiety === 'moderate' && dentist.offersSedation) {
            score += weights.anxiety * 0.8;
            reasons.push('Offers nitrous oxide for comfort');
        } else if (selections.anxiety === 'low') {
            score += weights.anxiety;
        }
        
        // Schedule matching
        if (selections.schedule === 'evening' && dentist.hasEveningHours) {
            score += weights.schedule;
            reasons.push('Offers evening appointments');
        } else if (selections.schedule === 'standard') {
            score += weights.schedule;
        }
        
        // Children matching
        if (selections.children === 'specialist' && dentist.type.toLowerCase().includes('pediatric')) {
            score += weights.children;
            reasons.push('Pediatric specialist');
        } else if (selections.children === 'family' && dentist.isPediatricFriendly) {
            score += weights.children;
            reasons.push('Family-friendly environment');
        } else if (selections.children === 'adult') {
            score += weights.children;
        }
        
        // Budget matching
        if (selections.budget === 'budget' && dentist.price.toLowerCase().includes('moderate')) {
            score += weights.budget;
            reasons.push('Reasonable pricing');
        } else if (selections.budget === 'mid' && (dentist.price.toLowerCase().includes('moderate') || dentist.hasInHousePlan)) {
            score += weights.budget;
            reasons.push('Good value with payment options');
        } else if (selections.budget === 'premium' && dentist.price.toLowerCase().includes('premium')) {
            score += weights.budget;
            reasons.push('Premium care available');
        }
        
        // Special boost for Spring Valley based on comprehensive care
        if (dentist.id === 'springvalley') {
            if (selections.careType === 'general' || selections.children === 'family') {
                score += 0.1;
                reasons.push('Excellent comprehensive family care');
            }
        }
        
        return {
            dentist,
            score,
            reasons: reasons.length > 0 ? reasons : ['Good overall match for your needs']
        };
    });
    
    // Sort by score (highest first)
    dentistScores.sort((a, b) => b.score - a.score);
    
    // Take top 3 matches
    const topMatches = dentistScores.slice(0, 3);
    
    // Create result elements
    topMatches.forEach((match, index) => {
        const dentist = match.dentist;
        
        const resultDentist = document.createElement('div');
        resultDentist.classList.add('result-dentist');
        
        if (dentist.isPremium) {
            resultDentist.classList.add('premium-result');
        }
        
        const rankBadge = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
        
        resultDentist.innerHTML = `
            <h4>${rankBadge} ${dentist.name} ${dentist.isPremium ? '<span class="premium-badge">Preferred</span>' : ''}</h4>
            <p><strong>Specialties:</strong> ${dentist.type}</p>
            <p><strong>Why this match:</strong> ${match.reasons.slice(0, 2).join(', ')}</p>
            <p><strong>Location:</strong> ${dentist.address}</p>
            ${dentist.phone !== "Contact via website" ? `<p><strong>Phone:</strong> ${dentist.phone}</p>` : ''}
            <a href="${dentist.website}" target="_blank" class="btn">Visit Website</a>
        `;
        
        resultContent.appendChild(resultDentist);
    });
}

// FAQ section functionality
function populateFAQSection() {
    const faqContainer = document.querySelector('.faq-container');
    if (!faqContainer || !window.faqData) return;
    
    // Clear existing FAQs
    faqContainer.innerHTML = '';
    
    // Add FAQ items
    window.faqData.forEach((faq, index) => {
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
