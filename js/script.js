// Fixed profile grid functionality - matches ofallongyms.com style
function populateProfilesGrid() {
    const profilesGrid = document.querySelector('.profiles-grid');
    if (!profilesGrid) return;
    
    // Clear existing profiles
    profilesGrid.innerHTML = '';
    
    // Sort dentists: 1) By rating (highest first), 2) By facility name (alphabetical)
    const sortedDentists = [...dentistsData].sort((a, b) => {
        // First sort by rating (highest first)
        const ratingA = a.rating || 0;
        const ratingB = b.rating || 0;
        
        if (ratingA !== ratingB) {
            return ratingB - ratingA; // Higher rating first
        }
        
        // If ratings are equal, sort alphabetically by name
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
        // Use the correct logo path structure
        const logoFileName = dentist.name.toLowerCase()
            .replace(/[^a-z0-9\s]/g, '') // Remove special characters
            .replace(/\s+/g, '-'); // Replace spaces with hyphens
        profileLogo.src = `images/logos/${logoFileName}.png`;
        profileLogo.alt = `${dentist.name} Logo`;
        profileLogo.classList.add('profile-logo');
        
        // Handle image loading errors
        profileLogo.onerror = function() {
            this.src = 'images/logos/placeholder-logo.png';
        };
        
        profileHeader.appendChild(profileLogo);
        
        const profileTitle = document.createElement('div');
        profileTitle.classList.add('profile-title');
        
        const profileName = document.createElement('h3');
        profileName.textContent = dentist.name;
        profileTitle.appendChild(profileName);
        
        const profileType = document.createElement('div');
        profileType.classList.add('profile-type');
        profileType.textContent = dentist.type;
        profileTitle.appendChild(profileType);
        
        if (dentist.isPremium) {
            const badge = document.createElement('div');
            badge.classList.add('premium-badge');
            badge.textContent = 'Preferred Choice';
            profileTitle.appendChild(badge);
        }
        
        profileHeader.appendChild(profileTitle);
        profileCard.appendChild(profileHeader);
        
        // Create profile body
        const profileBody = document.createElement('div');
        profileBody.classList.add('profile-body');
        
        // Add specialties
        const specialtiesInfo = document.createElement('div');
        specialtiesInfo.classList.add('profile-info');
        
        const specialtiesTitle = document.createElement('h4');
        specialtiesTitle.textContent = 'Specialties';
        specialtiesInfo.appendChild(specialtiesTitle);
        
        const specialtiesList = document.createElement('ul');
        (dentist.specialties || dentist.features || []).forEach(specialty => {
            const specialtyItem = document.createElement('li');
            specialtyItem.textContent = specialty;
            specialtiesList.appendChild(specialtyItem);
        });
        
        specialtiesInfo.appendChild(specialtiesList);
        profileBody.appendChild(specialtiesInfo);
        
        // Add amenities
        const amenitiesInfo = document.createElement('div');
        amenitiesInfo.classList.add('profile-info');
        
        const amenitiesTitle = document.createElement('h4');
        amenitiesTitle.textContent = 'Services & Amenities';
        amenitiesInfo.appendChild(amenitiesTitle);
        
        const amenitiesList = document.createElement('ul');
        (dentist.amenities || []).forEach(amenity => {
            const amenityItem = document.createElement('li');
            amenityItem.textContent = amenity;
            amenitiesList.appendChild(amenityItem);
        });
        
        amenitiesInfo.appendChild(amenitiesList);
        profileBody.appendChild(amenitiesInfo);
        
        // Add hours and contact info
        const contactInfo = document.createElement('div');
        contactInfo.classList.add('profile-info');
        
        const contactTitle = document.createElement('h4');
        contactTitle.textContent = 'Hours & Contact';
        contactInfo.appendChild(contactTitle);
        
        const hoursText = document.createElement('p');
        hoursText.innerHTML = `<strong>Hours:</strong> ${dentist.hours}`;
        contactInfo.appendChild(hoursText);
        
        if (dentist.address) {
            const addressText = document.createElement('p');
            addressText.innerHTML = `<strong>Address:</strong> ${dentist.address}`;
            contactInfo.appendChild(addressText);
        }
        
        if (dentist.phone) {
            const phoneText = document.createElement('p');
            phoneText.innerHTML = `<strong>Phone:</strong> ${dentist.phone}`;
            contactInfo.appendChild(phoneText);
        }
        
        profileBody.appendChild(contactInfo);
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
            // Handle both 'reviews' and 'reviewCount' properties
            const reviewCount = dentist.reviews || dentist.reviewCount || 'No reviews yet';
            ratingText.textContent = `${dentist.rating} (${reviewCount})`;
            profileRating.appendChild(ratingText);
        } else {
            profileRating.textContent = 'No rating available';
        }
        
        profileFooter.appendChild(profileRating);
        
        const profileLink = document.createElement('div');
        profileLink.classList.add('profile-link');
        
        const websiteLink = document.createElement('a');
        websiteLink.href = dentist.website || '#';
        websiteLink.target = '_blank';
        websiteLink.textContent = 'Visit Website';
        
        if (!dentist.website || dentist.website === '#') {
            websiteLink.style.opacity = '0.5';
            websiteLink.style.pointerEvents = 'none';
            websiteLink.textContent = 'Website Coming Soon';
        }
        
        profileLink.appendChild(websiteLink);
        profileFooter.appendChild(profileLink);
        
        profileCard.appendChild(profileFooter);
        
        // Add profile card to grid
        profilesGrid.appendChild(profileCard);
    });
}