// Matcher functionality - COMPLETE VERSION
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
                    document.querySelector('#question-' + currentQuestion).classList.add('active');
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
        
        resultDentist.innerHTML = '<h4>' + rankBadge + ' ' + dentist.name + (dentist.isPremium ? ' <span class="premium-badge">Preferred</span>' : '') + '</h4>' +
            '<p><strong>Specialties:</strong> ' + dentist.type + '</p>' +
            '<p><strong>Why this match:</strong> ' + match.reasons.slice(0, 2).join(', ') + '</p>' +
            '<p><strong>Location:</strong> ' + dentist.address + '</p>' +
            (dentist.phone !== "Contact via website" ? '<p><strong>Phone:</strong> ' + dentist.phone + '</p>' : '') +
            '<a href="' + dentist.website + '" target="_blank" class="btn">Visit Website</a>';
        
        resultContent.appendChild(resultDentist);
    });
}
