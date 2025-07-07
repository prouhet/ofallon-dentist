// Simple map initialization for O'Fallon Dentists
let map;

// Function to initialize the map
function initMap() {
  // Check if map container exists
  const mapContainer = document.getElementById('dentist-map');
  if (!mapContainer) {
    return;
  }
  
  // Check if Leaflet is loaded
  if (typeof L === 'undefined') {
    return;
  }
  
  // Check if dentistsData is loaded
  if (typeof dentistsData === 'undefined') {
    return;
  }
  
  // Initialize the map centered on O'Fallon, IL
  map = L.map('dentist-map').setView([38.5922, -89.9104], 12);
  
  // Add tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
  
  // Add markers for each dental practice
  dentistsData.forEach(function(dentist) {
    if (dentist.coordinates && dentist.coordinates.length === 2) {
      const lat = dentist.coordinates[0];
      const lng = dentist.coordinates[1];
      
      // Create custom marker
      const isPreferred = dentist.name === 'Spring Valley Dental Group';
      const markerColor = isPreferred ? '#8B5CF6' : '#3B82F6';
      
      // Create marker
      const marker = L.circleMarker([lat, lng], {
        radius: 8,
        fillColor: markerColor,
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
      }).addTo(map);
      
      // Create popup content
      const popupContent = `
        <div style="min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; color: #1f2937;">${dentist.name}</h3>
          <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 14px;">${dentist.specialties}</p>
          <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">${dentist.address}</p>
          <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <span style="color: #f59e0b;">★★★★★</span>
            <span style="margin-left: 4px; color: #6b7280; font-size: 14px;">${dentist.rating}</span>
          </div>
          ${isPreferred ? '<span style="background: #8B5CF6; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">Preferred Choice</span>' : ''}
        </div>
      `;
      
      marker.bindPopup(popupContent);
    }
  });
}

// Initialize map when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initMap();
});

// Fallback: Initialize map when window loads
window.addEventListener('load', function() {
  if (!map) {
    initMap();
  }
});

