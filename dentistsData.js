const dentistsData = [
  {
    id: "springvalley",
    name: "Spring Valley Dental Group",
    type: "General/Family/Cosmetic",
    price: "Varies by procedure",
    hours: "Mon-Fri: Standard business hours",
    features: [
      "Comprehensive dental care",
      "Family-friendly environment",
      "Modern dental technology"
    ],
    amenities: [
      "Sedation options available",
      "Accepts most insurance plans",
      "In-house payment plans"
    ],
    rating: 4.9,
    reviews: "N/A",
    bbbRating: "A+",
    address: "O'Fallon, IL 62269",
    phone: "Contact via website",
    website: "https://springvalleydentalgroup.com/",
    logo: "images/logos/springvalley.png",
    isPremium: true,
    acceptsCareCredit: true,
    hasInHousePlan: true,
    offersSedation: true,
    isPediatricFriendly: true,
    hasEveningHours: false
  },
  {
    id: "innovationdental",
    name: "Innovation Dental",
    type: "General/Cosmetic/Implant Focus",
    price: "Premium",
    hours: "Mon-Wed: 8:00 AM - 5:00 PM, Thu: 8:00 AM - 1:00 PM",
    features: [
      "Implant specialists",
      "IV sedation available",
      "Advanced technology"
    ],
    amenities: [
      "Comfortable environment",
      "Comprehensive care",
      "Financing options"
    ],
    rating: 5.0,
    reviews: 1002,
    bbbRating: "A+",
    address: "717 Insight Avenue, Suite 200, O'Fallon, IL 62269",
    phone: "(618) 277-6550",
    website: "https://www.innovationdentalgroup.com/",
    logo: "images/logos/innovationdental.png",
    isPremium: false,
    acceptsCareCredit: true,
    hasInHousePlan: true,
    offersSedation: true,
    isPediatricFriendly: false,
    hasEveningHours: false
  },
  {
    id: "shilohdentalgroup",
    name: "Shiloh Dental Group",
    type: "General/Prosthodontics",
    price: "Premium",
    hours: "Contact for hours",
    features: [
      "Prosthodontic specialty",
      "Comprehensive dental care",
      "Experienced team"
    ],
    amenities: [
      "Modern facility",
      "Patient-centered approach",
      "Financing options"
    ],
    rating: 5.0,
    reviews: 263,
    bbbRating: "A+",
    address: "Shiloh, IL 62269",
    phone: "Contact via website",
    website: "https://shilohdentalgroup.com/",
    logo: "images/logos/shilohdentalgroup.png",
    isPremium: false,
    acceptsCareCredit: true,
    hasInHousePlan: false,
    offersSedation: false,
    isPediatricFriendly: false,
    hasEveningHours: false
  },
  {
    id: "bollmeierdental",
    name: "Bollmeier Dental",
    type: "General/Family/Cosmetic/Pediatric",
    price: "Moderate to Premium",
    hours: "Mon: 8:30 AM - 5:00 PM, Tue: 8:00 AM - 4:30 PM, Wed: 1:30 PM - 7:00 PM, Thu: 9:00 AM - 5:30 PM",
    features: [
      "Comfort dog on staff",
      "Family-friendly environment",
      "Comprehensive care"
    ],
    amenities: [
      "Massage chairs",
      "Nitrous oxide available",
      "Senior discounts"
    ],
    rating: 4.9,
    reviews: 312,
    bbbRating: "A+",
    address: "2010 W US Highway 50, O'Fallon, IL 62269",
    phone: "(618) 622-8888",
    website: "http://bollmeierdental.com/",
    logo: "images/logos/bollmeierdental.png",
    isPremium: false,
    acceptsCareCredit: true,
    hasInHousePlan: false,
    offersSedation: true,
    isPediatricFriendly: true,
    hasEveningHours: true
  },
  {
    id: "parkplacedental",
    name: "Park Place Dental Group",
    type: "General/Family/Cosmetic",
    price: "Moderate to Premium",
    hours: "Extended hours Mon-Thurs",
    features: [
      "Comprehensive dental care",
      "Family-friendly practice",
      "Modern technology"
    ],
    amenities: [
      "Sedation options",
      "In-house payment plans",
      "Accepts most insurance"
    ],
    rating: 4.8,
    reviews: 76,
    bbbRating: "A+",
    address: "Shiloh, IL 62269",
    phone: "Contact via website",
    website: "https://parkplacedentalgroup.com/",
    logo: "images/logos/parkplacedental.png",
    isPremium: false,
    acceptsCareCredit: true,
    hasInHousePlan: true,
    offersSedation: true,
    isPediatricFriendly: true,
    hasEveningHours: true
  },
  {
    id: "greenmountfamily",
    name: "Green Mount Family Dentistry",
    type: "General/Family/Cosmetic",
    price: "Moderate",
    hours: "Mon: 8:00 AM - 6:00 PM, Tue: 8:00 AM - 5:00 PM, Wed: 8:00 AM - 6:00 PM, Thu: 8:00 AM - 6:00 PM, Fri: 8:00 AM - 1:00 PM",
    features: [
      "Family dental care",
      "Cosmetic services",
      "Invisalign provider"
    ],
    amenities: [
      "Modern facility",
      "Extended evening hours",
      "Financing options"
    ],
    rating: 4.89,
    reviews: 9,
    bbbRating: "A+",
    address: "1490 North Greenmount Road, Suite A, O'Fallon, IL 62269",
    phone: "(618) 622-9720",
    website: "https://greenmountfamilydentistry.com/",
    logo: "images/logos/greenmountfamily.png",
    isPremium: false,
    acceptsCareCredit: true,
    hasInHousePlan: false,
    offersSedation: false,
    isPediatricFriendly: false,
    hasEveningHours: true
  },
  {
    id: "lakepointedental",
    name: "Lake Pointe Dental Group",
    type: "General/Family/Cosmetic",
    price: "Moderate",
    hours: "Extended hours Mon/Thurs",
    features: [
      "Comprehensive dental care",
      "Family-friendly practice",
      "Sedation options"
    ],
    amenities: [
      "Modern facility",
      "Financing options",
      "Evening hours"
    ],
    rating: 4.7,
    reviews: 285,
    bbbRating: "A+",
    address: "O'Fallon, IL 62269",
    phone: "Contact via website",
    website: "https://lakepointedentalgroup.com/",
    logo: "images/logos/lakepointedental.png",
    isPremium: false,
    acceptsCareCredit: true,
    hasInHousePlan: false,
    offersSedation: true,
    isPediatricFriendly: false,
    hasEveningHours: true
  },
  {
    id: "softtouchdentistry",
    name: "Soft Touch Dentistry",
    type: "General/Family/Cosmetic",
    price: "Moderate to Premium",
    hours: "Contact for hours",
    features: [
      "Gentle dental care",
      "Oral and IV sedation",
      "Family-friendly practice"
    ],
    amenities: [
      "Comfortable environment",
      "Pediatric services",
      "Financing options"
    ],
    rating: 4.7,
    reviews: 50,
    bbbRating: "N/A",
    address: "O'Fallon, IL 62269",
    phone: "Contact via website",
    website: "https://softtouchdentistry.com/",
    logo: "images/logos/softtouchdentistry.png",
    isPremium: false,
    acceptsCareCredit: true,
    hasInHousePlan: false,
    offersSedation: true,
    isPediatricFriendly: true,
    hasEveningHours: false
  },
  {
    id: "aspendental",
    name: "Aspen Dental",
    type: "General/Cosmetic/Multi-Specialty",
    price: "Budget to Moderate",
    hours: "Extended hours available",
    features: [
      "Denture specialists",
      "Emergency care",
      "Multiple services"
    ],
    amenities: [
      "Convenient scheduling",
      "Peace of Mind Promise®",
      "Financing options"
    ],
    rating: 4.2,
    reviews: 691,
    bbbRating: "N/A",
    address: "1707 West Highway 50, O'Fallon, IL 62269",
    phone: "(618) 206-5488",
    website: "https://www.aspendental.com/dentist/il/o-fallon/",
    logo: "images/logos/aspendental.png",
    isPremium: false,
    acceptsCareCredit: true,
    hasInHousePlan: false,
    offersSedation: true,
    isPediatricFriendly: false,
    hasEveningHours: true
  },
  {
    id: "allgrins4kids",
    name: "All Grins 4 Kids Pediatric Dentistry",
    type: "Pediatric",
    price: "Moderate",
    hours: "Monday - Thursday: 9:00 AM - 5:00 PM",
    features: [
      "Pediatric specialists",
      "Special needs care",
      "Child-friendly environment"
    ],
    amenities: [
      "Nitrous oxide available",
      "Digital X-rays",
      "Refer a Friend program"
    ],
    rating: 4.8,
    reviews: "N/A",
    bbbRating: "N/A",
    address: "317 Tamarack Lane, Shiloh, IL 62269",
    phone: "(618) 628-4400",
    website: "https://www.allgrins4kids.com/",
    logo: "images/logos/allgrins4kids.png",
    isPremium: false,
    acceptsCareCredit: true,
    hasInHousePlan: false,
    offersSedation: true,
    isPediatricFriendly: true,
    hasEveningHours: false
  },
  {
    id: "dreamdentist",
    name: "Dream Dentist",
    type: "General/Cosmetic/Sedation",
    price: "Premium",
    hours: "Contact for hours",
    features: [
      "Sedation specialists",
      "Anxiety-friendly practice",
      "Cosmetic focus"
    ],
    amenities: [
      "Spa-like environment",
      "Oral and IV sedation",
      "Financing options"
    ],
    rating: 4.9,
    reviews: "N/A",
    bbbRating: "A+",
    address: "1646 W Highway 50, O'Fallon, IL 62269",
    phone: "(618) 726-2699",
    website: "https://www.dreamdentist.com/",
    logo: "images/logos/dreamdentist.png",
    isPremium: false,
    acceptsCareCredit: true,
    hasInHousePlan: false,
    offersSedation: true,
    isPediatricFriendly: false,
    hasEveningHours: false
  },
  {
    id: "hometowndental",
    name: "Hometown Dental",
    type: "Family & Cosmetic",
    price: "Moderate",
    hours: "Contact for hours",
    features: [
      "Family dental care",
      "Cosmetic services",
      "Clear treatment plans"
    ],
    amenities: [
      "Friendly environment",
      "Transparent pricing",
      "Financing options"
    ],
    rating: 4.8,
    reviews: "N/A",
    bbbRating: "N/A",
    address: "904 Talon Drive, O'Fallon, IL 62269",
    phone: "618-726-2280",
    website: "https://www.home-towndental.com/",
    logo: "images/logos/hometowndental.png",
    isPremium: false,
    acceptsCareCredit: true,
    hasInHousePlan: false,
    offersSedation: false,
    isPediatricFriendly: false,
    hasEveningHours: false
  },
  {
    id: "markmedder",
    name: "Mark Medder DMD",
    type: "General/Family/Cosmetic",
    price: "Moderate",
    hours: "Evening hours by appointment",
    features: [
      "Family dental care",
      "Cosmetic services",
      "Personalized treatment"
    ],
    amenities: [
      "Nitrous oxide available",
      "Financing options",
      "Flexible scheduling"
    ],
    rating: 4.7,
    reviews: "N/A",
    bbbRating: "A+",
    address: "O'Fallon, IL 62269",
    phone: "Contact via website",
    website: "https://markmedder.com/",
    logo: "images/logos/markmedder.png",
    isPremium: false,
    acceptsCareCredit: true,
    hasInHousePlan: false,
    offersSedation: true,
    isPediatricFriendly: false,
    hasEveningHours: true
  },
  {
    id: "cambridgedental",
    name: "Cambridge Dental Care",
    type: "General/Family/Cosmetic",
    price: "Moderate",
    hours: "Standard business hours",
    features: [
      "Family dental care",
      "Cosmetic services",
      "General dentistry"
    ],
    amenities: [
      "Comfortable environment",
      "Financing options",
      "Insurance accepted"
    ],
    rating: 4.7,
    reviews: "N/A",
    bbbRating: "A+",
    address: "O'Fallon, IL 62269",
    phone: "Contact via website",
    website: "https://cambridgedentalcare.com/",
    logo: "images/logos/cambridgedental.png",
    isPremium: false,
    acceptsCareCredit: true,
    hasInHousePlan: false,
    offersSedation: false,
    isPediatricFriendly: false,
    hasEveningHours: false
  },
  {
    id: "frankscottdental",
    name: "Frank Scott Parkway Dental",
    type: "General/Cosmetic",
    price: "Moderate",
    hours: "Extended hours Thursday",
    features: [
      "General dentistry",
      "Cosmetic services",
      "Quality care"
    ],
    amenities: [
      "Modern facility",
      "Financing options",
      "Evening hours"
    ],
    rating: 4.9,
    reviews: 14,
    bbbRating: "Not Accredited",
    address: "Swansea, IL",
    phone: "Contact via website",
    website: "https://frankscottdental.com/",
    logo: "images/logos/frankscottdental.png",
    isPremium: false,
    acceptsCareCredit: true,
    hasInHousePlan: false,
    offersSedation: false,
    isPediatricFriendly: false,
    hasEveningHours: true
  },
  {
    id: "azarorthodontics",
    name: "Azar Orthodontics",
    type: "Orthodontic",
    price: "Premium",
    hours: "Contact for hours",
    features: [
      "Orthodontic specialists",
      "Braces and aligners",
      "Smile transformation"
    ],
    amenities: [
      "Modern technology",
      "Financing options",
      "Consultation available"
    ],
    rating: 4.8,
    reviews: "N/A",
    bbbRating: "A+",
    address: "O'Fallon, IL 62269",
    phone: "Contact via website",
    website: "https://azarorthodontics.com/",
    logo: "images/logos/azarorthodontics.png",
    isPremium: false,
    acceptsCareCredit: false,
    hasInHousePlan: false,
    offersSedation: false,
    isPediatricFriendly: false,
    hasEveningHours: false
  },
  {
    id: "dentalstudio",
    name: "The Dental Studio",
    type: "General/Cosmetic",
    price: "Moderate to Premium",
    hours: "Standard business hours",
    features: [
      "General dentistry",
      "Cosmetic services",
      "Nitrous oxide available"
    ],
    amenities: [
      "In-house payment plans",
      "Pediatric-friendly",
      "Financing options"
    ],
    rating: 4.7,
    reviews: "N/A",
    bbbRating: "A+ (as Bowman)",
    address: "O'Fallon, IL 62269",
    phone: "Contact via website",
    website: "https://thedentalstudio.com/",
    logo: "images/logos/dentalstudio.png",
    isPremium: false,
    acceptsCareCredit: true,
    hasInHousePlan: true,
    offersSedation: true,
    isPediatricFriendly: true,
    hasEveningHours: false
  }
];

// FAQ Data
const faqData = [
  {
    question: "How do I choose the right dentist for my family?",
    answer: "When choosing a dentist, consider factors like location, office hours, services offered, and whether they treat patients of all ages. Check reviews, ask for recommendations, and consider scheduling a consultation to meet the dentist and staff before making your decision."
  },
  {
    question: "What dental insurance plans are accepted by most O'Fallon dentists?",
    answer: "Most dentists in O'Fallon accept major insurance plans including Delta Dental, MetLife, Cigna, Aetna, and Blue Cross Blue Shield. Many also accept CareCredit and offer in-house payment plans. Always verify coverage with your specific dentist before treatment."
  },
  {
    question: "How often should I visit the dentist?",
    answer: "For most people, dentists recommend checkups and cleanings twice a year (every 6 months). However, your dentist may suggest more frequent visits if you have specific dental health concerns, gum disease, or are at higher risk for dental problems."
  },
  {
    question: "What should I do in case of a dental emergency?",
    answer: "For dental emergencies like severe pain, broken teeth, or infections, contact your dentist immediately for an emergency appointment. Many O'Fallon dentists offer emergency services or can refer you to an emergency dental provider. If you can't reach your dentist and are experiencing severe pain or swelling, visit an urgent care center or emergency room."
  },
  {
    question: "What options are available for dental anxiety?",
    answer: "Many dentists in O'Fallon offer solutions for dental anxiety including nitrous oxide (laughing gas), oral sedation, and IV sedation. Some practices also provide comfort amenities like massage chairs, TVs, or comfort dogs. Discuss your anxiety with potential dentists to find one who specializes in treating anxious patients."
  },
  {
    question: "How do I know if a dentist is good with children?",
    answer: "Look for dentists who specifically mention pediatric services or family dentistry. Check reviews from other parents, and consider whether the practice has child-friendly amenities or a welcoming environment for kids. Pediatric specialists have additional training specifically for treating children."
  },
  {
    question: "What payment options are typically available?",
    answer: "Most O'Fallon dentists accept major credit cards, insurance, and CareCredit. Many offer payment plans, financing options, or in-house dental savings plans. Some practices also offer special promotions for new patients or discounts for seniors or military families."
  },
  {
    question: "How do I know which cosmetic dental procedures are right for me?",
    answer: "The best way to determine appropriate cosmetic procedures is through a consultation with a dentist who offers cosmetic services. They can evaluate your specific needs and goals, explain available options (such as whitening, veneers, or orthodontics), and recommend a personalized treatment plan."
  }
];
