// src/data/culturalTripData.ts

export interface CulturalPlan {
  destination: string;
  state: string;
  tagline: string;
  bestMonths: string;
  bgImage: string;
  festivals: {
    name: string;
    dates: string;
    description: string;
    insiderTip: string;
    significance: string;
  }[];
  hiddenGems: {
    title: string;
    category: 'Artisans & Crafts' | 'Secret Trails' | 'Ancient Architecture' | 'Village Life';
    location: string;
    description: string;
    bestTimeToVisit: string;
  }[];
  seasonalFoods: {
    name: string;
    type: 'Must-Try Specialty' | 'Winter Delicacy' | 'Street Food Legend' | 'Royal Heritage Dish';
    famousSpot: string;
    priceRange: string;
    description: string;
  }[];
  budgetStays: {
    name: string;
    type: 'Heritage Haveli' | 'Eco-Homestay' | 'Backwater Lodge' | 'Riverside Villa';
    pricePerNight: number;
    rating: number;
    ecoScore: string;
    amenities: string[];
  }[];
  safety: {
    score: number; // out of 10
    crowdLevel: 'Low (Peaceful)' | 'Moderate (Pleasant)' | 'High (Festive Rush)';
    emergencyContacts: { service: string; number: string }[];
    insiderSafetyTips: string[];
  }[];
  sustainability: {
    co2SavedKg: number;
    ecoRewardPoints: number;
    greenRoute: string;
    recommendedTransit: string;
    localInitiative: string;
  };
}

export const INDIAN_CULTURAL_DATABASE: Record<string, CulturalPlan> = {
  'lucknow': {
    destination: 'Lucknow',
    state: 'Uttar Pradesh',
    tagline: 'The Heart of Tehzeeb, Royal Awadhi Flavors & Architectural Wonders',
    bestMonths: 'October to March (Winter months are magical with morning mist & Makhan Malai)',
    bgImage: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1200&auto=format&fit=crop&q=80',
    festivals: [
      {
        name: 'Lucknow Mahotsav',
        dates: 'Late November – Early December',
        description: 'A 10-day grand cultural extravaganza showcasing Awadhi classical music, Kathak recitals, handcrafted Chikankari, and royal culinary competitions.',
        insiderTip: 'Visit the Shilp Gram pavilion in the evening to buy authentic Zardozi shawls directly from master artisans.',
        significance: 'Celebrates the syncretic Ganga-Jamuni Tehzeeb of Awadh.'
      },
      {
        name: 'Sham-e-Awadh Heritage Evenings',
        dates: 'Year-Round (Best on Weekends)',
        description: 'Traditional musical baithaks, ghazals, and storytelling (Dastangoi) around the lit-up courtyards of Rumi Darwaza and Husainabad.',
        insiderTip: 'Take the late afternoon walking tour starting from Teele Wali Masjid down to the clock tower.',
        significance: 'Preserves the centuries-old art of Persian-Urdu oral storytelling.'
      }
    ],
    hiddenGems: [
      {
        title: 'Chowk Chikankari & Zardozi Weavers Alley',
        category: 'Artisans & Crafts',
        location: 'Old Chowk Bazaar, Nazirabad Lane',
        description: 'Generations of master needleworkers handcrafting 32 distinct shadow-work embroidery stitches on fine mulmul cotton.',
        bestTimeToVisit: '11:00 AM – 4:00 PM (Natural daytime light)'
      },
      {
        title: 'Bara Imambara Whispering Labyrinth (Bhool Bhulaiya)',
        category: 'Ancient Architecture',
        location: 'Machchhi Bhavan',
        description: 'An arched maze with 489 identical doorways and hollow acoustic walls where a matchstick struck at one end can be heard 50 meters away.',
        bestTimeToVisit: 'Early morning 8:30 AM before tourist crowds arrive'
      },
      {
        title: 'The British Residency Gardens & Bullet-Scarred Ruins',
        category: 'Secret Trails',
        location: 'River Gomti Bank',
        description: 'Quiet green gardens preserving original 1857 memorial walls with preserved cannonball marks and peaceful sunset lawns.',
        bestTimeToVisit: '4:30 PM – 6:00 PM (Golden hour photography)'
      }
    ],
    seasonalFoods: [
      {
        name: 'Original Galouti Kebabs & Mughlai Paratha',
        type: 'Royal Heritage Dish',
        famousSpot: 'Tundey Kababi (Original 1905 Outlet, Old Chowk)',
        priceRange: '₹120 – ₹220 for two',
        description: 'Melt-in-mouth kebabs prepared using 160 secret spices originally crafted for Nawab Asaf-ud-Daula.'
      },
      {
        name: 'Makhan Malai (Nimish Cloud Dessert)',
        type: 'Winter Delicacy',
        famousSpot: 'Chowk Gol Darwaza & Aminabad Square',
        priceRange: '₹50 per kulhad',
        description: 'Airy, saffron-infused dew-whipped milk foam topped with edible silver vark and crushed pistachios, available only in winter mornings.'
      },
      {
        name: 'Kashmiri Chai (Gulabi Tea) with Khatai',
        type: 'Street Food Legend',
        famousSpot: 'Akbari Gate Night Market',
        priceRange: '₹30 per cup',
        description: 'Naturally pink slow-brewed salted-sweet tea spiced with cardamom, topped with thick clotted malai.'
      }
    ],
    budgetStays: [
      {
        name: 'Gomti Heritage Courtyard B&B',
        type: 'Heritage Haveli',
        pricePerNight: 1450,
        rating: 4.8,
        ecoScore: 'A+ (Solar Powered & Plastic-Free)',
        amenities: ['Awadhi Home-Cooked Breakfast', 'Free Walking Tour Guide', 'High-Speed WiFi', 'Lawn Garden']
      },
      {
        name: 'Habibullah Estate Colonial Villa',
        type: 'Riverside Villa',
        pricePerNight: 2100,
        rating: 4.9,
        ecoScore: 'A (Organic Kitchen Garden)',
        amenities: ['Antique Four-Poster Beds', 'Heritage Library', 'Bicycle Rentals']
      }
    ],
    safety: [
      {
        score: 9.4,
        crowdLevel: 'Moderate (Pleasant)',
        emergencyContacts: [
          { service: 'UP Police Emergency', number: '112' },
          { service: 'Women Power Helpline', number: '1090' },
          { service: 'Tourist Police Helpdesk (Charbagh)', number: '0522-2635678' }
        ],
        insiderSafetyTips: [
          'Old Chowk lanes are best navigated on foot or via electric e-rickshaws; avoid large cars in heritage alleys.',
          'Always negotiate handicraft prices or purchase from certified SEWA embroidery centers for genuine artisan support.',
          'Public transport (Lucknow Metro) is exceptionally clean, well-policed, and connected directly to the airport and railway station.'
        ]
      }
    ],
    sustainability: {
      co2SavedKg: 4.8,
      ecoRewardPoints: 95,
      greenRoute: 'Lucknow Metro Red Line + Electric E-Rickshaw Heritage Circuit',
      recommendedTransit: 'Electric Metro + Guided Walking Trails in Chowk',
      localInitiative: 'Supports 250+ women weavers under the One District One Product (ODOP) Chikankari mission.'
    }
  },
  'varanasi': {
    destination: 'Varanasi (Kashi)',
    state: 'Uttar Pradesh',
    tagline: 'The World’s Oldest Living Spiritual City on the Sacred Ganga',
    bestMonths: 'October to March (Dev Deepawali in Nov is a once-in-a-lifetime sight)',
    bgImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1200&auto=format&fit=crop&q=80',
    festivals: [
      {
        name: 'Dev Deepawali (Festival of the Gods)',
        dates: 'Kartik Purnima (November)',
        description: 'All 84 stone ghats lit with more than 1.5 million earthen clay diyas as millions chant Vedic mantras under fireworks.',
        insiderTip: 'Book a hand-rowed wooden boat 3 weeks in advance to watch the aarti illuminate the river crescent.',
        significance: 'Commemorates Lord Shiva’s victory over the demon Tripurasura.'
      },
      {
        name: 'Daily Maha Ganga Aarti',
        dates: 'Every Evening at Sunset (6:30 PM)',
        description: 'Synchronized brass lamp rituals conducted by Vedic priests at Dashashwamedh and Assi Ghats.',
        insiderTip: 'Arrive at Assi Ghat for Subah-e-Banaras at 5:30 AM for morning classical sitar and yoga.',
        significance: 'Sacred worship offering gratitude to Mother Ganga.'
      }
    ],
    hiddenGems: [
      {
        title: 'Sarai Mohana Banarasi Silk Weavers Village',
        category: 'Artisans & Crafts',
        location: '8 km North of Varanasi Old City',
        description: 'Centuries-old pit-loom handlooms weaving pure gold Zari thread into world-famous Katan silk bridal sarees.',
        bestTimeToVisit: '10:00 AM – 2:00 PM'
      },
      {
        title: 'Lolark Kund Ancient Solar Stepwell',
        category: 'Ancient Architecture',
        location: 'Near Bhadaini Ghat',
        description: 'A 1,200-year-old stone stepwell dedicated to the Sun God with a 50-step steep subterranean descent.',
        bestTimeToVisit: 'Early morning when sunbeams hit the water reservoir'
      },
      {
        title: 'Kabir Chaura Math & Sitar Heritage Quarter',
        category: 'Secret Trails',
        location: 'Kabir Chaura',
        description: 'The historic neighbourhood where saint-poet Kabir lived, home to classical Hindustani musicians & tabla makers.',
        bestTimeToVisit: '3:00 PM – 5:30 PM'
      }
    ],
    seasonalFoods: [
      {
        name: 'Kashi Tamatar Chaat & Chooda Matar',
        type: 'Street Food Legend',
        famousSpot: 'Kashi Chaat Bhandar (Godowlia Chowk)',
        priceRange: '₹40 – ₹80',
        description: 'Hot spicy tomato puree stewed in desi ghee with hing, cashews, and lemon juice served in earthen clay pots.'
      },
      {
        name: 'Original Banarasi Thandai with Kesar & Pista',
        type: 'Must-Try Specialty',
        famousSpot: 'Mishrambu Thandai (Since 1895, Godowlia)',
        priceRange: '₹60 per glass',
        description: 'Rich almond-fennel milk cooled in clay pots, enriched with saffron strands and dry fruits.'
      },
      {
        name: 'Banarasi Maghai Meetha Paan',
        type: 'Must-Try Specialty',
        famousSpot: 'Keshav Tambool Bhandar (Near BHU Gate)',
        priceRange: '₹30 per paan',
        description: 'Fragrant beetle leaf folded with gulkand, natural rose petals, clove, and cardamom that dissolves instantly.'
      }
    ],
    budgetStays: [
      {
        name: 'Kedareswar Ganga Heritage Homestay',
        type: 'Heritage Haveli',
        pricePerNight: 1200,
        rating: 4.9,
        ecoScore: 'A+ (Direct Ghat View & Solar Water)',
        amenities: ['Direct Ganga Balcony View', 'Rooftop Yoga', 'Organic Chai & Breakfast']
      },
      {
        name: 'Kashi Vedic Eco B&B',
        type: 'Eco-Homestay',
        pricePerNight: 890,
        rating: 4.8,
        ecoScore: 'A (Zero-Plastic Commitment)',
        amenities: ['Quiet Courtyard', 'Clean RO Water', 'Luggage Assistance']
      }
    ],
    safety: [
      {
        score: 9.2,
        crowdLevel: 'High (Festive Rush)',
        emergencyContacts: [
          { service: 'Varanasi Police Control', number: '112' },
          { service: 'Ganga Ghat Tourist Police Booth', number: '0542-2508000' },
          { service: 'Boat Safety & Lifeguard Desk', number: '1070' }
        ],
        insiderSafetyTips: [
          'Stick to registered life-jacket compliant boats operated by verified boatmen cooperatives.',
          'Beware of touts offering "special vantage rooftop passes" for cremation ghats; photography at Manikarnika is strictly prohibited.',
          'Alleys (galis) are narrow — keep offline GPS maps saved on your phone.'
        ]
      }
    ],
    sustainability: {
      co2SavedKg: 6.2,
      ecoRewardPoints: 120,
      greenRoute: 'Ganga Heritage Ghat Walking Trail + Electric CNG Solar Boat',
      recommendedTransit: 'Walking the 84 Ghats on foot + Electric CNG Boat',
      localInitiative: 'Clean Ganga Mission support with 100% biodegradable floral waste recycling into holy incense sticks.'
    }
  },
  'jaipur': {
    destination: 'Jaipur',
    state: 'Rajasthan',
    tagline: 'The Royal Pink City of Palaces, Fortresses & Block-Print Wonders',
    bestMonths: 'October to March (Warm sunny days and cool pleasant evenings)',
    bgImage: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1200&auto=format&fit=crop&q=80',
    festivals: [
      {
        name: 'Jaipur Literature Festival (JLF)',
        dates: 'Late January',
        description: 'The world’s largest free literary festival hosted at Diggi Palace with Nobel laureates, poets, and live folk concerts.',
        insiderTip: 'Register early online for delegate access to evening music stages at Clarks Amer.',
        significance: 'Global celebration of literature, cinema, and South Asian culture.'
      },
      {
        name: 'Teej & Gangaur Royal Processions',
        dates: 'March / August (Monsoon & Spring)',
        description: 'Centuries-old royal brass palanquin parade of Goddess Parvati through Tripoliya Bazaar accompanied by camels and Kalbelia dancers.',
        insiderTip: 'Secure a rooftop cafe spot on Tripoliya Bazaar 2 hours before the 4:30 PM procession.',
        significance: 'Traditional celebration of marital devotion and the onset of monsoons.'
      }
    ],
    hiddenGems: [
      {
        title: 'Panna Meena Ka Kund Stepwell',
        category: 'Ancient Architecture',
        location: 'Near Amer Fort, Kheri Gate',
        description: 'A symmetrical 16th-century criss-cross geometric stepwell where no two steps share the same shadow footprint.',
        bestTimeToVisit: '8:00 AM – 9:30 AM before morning sun glare'
      },
      {
        title: 'Sanganer & Bagru Hand Block Print Workshops',
        category: 'Artisans & Crafts',
        location: 'Sanganer Town (12 km south)',
        description: 'Watch Chippa artisan families hand-carve teakwood blocks and stamp natural indigo and turmeric dyes on pure cotton.',
        bestTimeToVisit: '10:00 AM – 3:00 PM (Live printing workshops)'
      },
      {
        title: 'Nahargarh Fort Sunset Secret Ridge Walk',
        category: 'Secret Trails',
        location: 'Aravalli Hills Summit',
        description: 'Walk along the outer fortified ramparts overlooking the lit-up Pink City skyline 600 meters below.',
        bestTimeToVisit: '5:15 PM – 6:30 PM'
      }
    ],
    seasonalFoods: [
      {
        name: 'Dal Baati Churma with Gatte Ki Sabzi',
        type: 'Royal Heritage Dish',
        famousSpot: 'Laxmi Misthan Bhandar (LMB, Johari Bazaar)',
        priceRange: '₹350 – ₹600 for full thali',
        description: 'Clay-oven baked wheat dumplings drowned in desi ghee, paired with 5-lentil panchmel dal and sweet jaggery churma.'
      },
      {
        name: 'Rawat Pyaaz Ki Kachori & Mawa Kachori',
        type: 'Street Food Legend',
        famousSpot: 'Rawat Misthan Bhandar (Station Road)',
        priceRange: '₹50 per kachori',
        description: 'Crispy flaky deep-fried pastry stuffed with spiced caramelised onions and garlic, served with tamarind chutney.'
      },
      {
        name: 'Pandit Kulfi & Masala Chai',
        type: 'Street Food Legend',
        famousSpot: 'Gulab Ji Chai Wale (MI Road)',
        priceRange: '₹30 per cup',
        description: 'Famous bun maska paired with rich ginger-cardamom tea brewed with buffalo milk.'
      }
    ],
    budgetStays: [
      {
        name: 'Samode Haveli Courtyard Lodge',
        type: 'Heritage Haveli',
        pricePerNight: 1650,
        rating: 4.9,
        ecoScore: 'A+ (Heritage Restoration & Solar Heating)',
        amenities: ['Frescoed Ceilings', 'Complimentary Rajasthani Chai', 'Pink City Walking Map']
      },
      {
        name: 'Pink City Eco Homestay',
        type: 'Eco-Homestay',
        pricePerNight: 950,
        rating: 4.8,
        ecoScore: 'A (Rainwater Harvesting)',
        amenities: ['Terrace View of Nahargarh', 'Home Cooked Meals', 'Bicycle Tours']
      }
    ],
    safety: [
      {
        score: 9.3,
        crowdLevel: 'Moderate (Pleasant)',
        emergencyContacts: [
          { service: 'Rajasthan Tourist Assistance Police', number: '1364' },
          { service: 'State Emergency Response', number: '112' },
          { service: 'Pink City Heritage Helpdesk', number: '0141-2601900' }
        ],
        insiderSafetyTips: [
          'Purchase composite tickets online to skip queues at Amer Fort, Hawa Mahal, and Jantar Mantar.',
          'Government approved guides wear official Ministry of Tourism badges with photo ID.'
        ]
      }
    ],
    sustainability: {
      co2SavedKg: 5.5,
      ecoRewardPoints: 110,
      greenRoute: 'Jaipur Metro + Electric E-Rickshaws inside Old Walled City',
      recommendedTransit: 'Solar-powered E-Rickshaws & Heritage Walk Trails',
      localInitiative: 'UNESCO World Heritage sustainable conservation protocol for ancient pink limestone facades.'
    }
  },
  'goa': {
    destination: 'Goa',
    state: 'Goa',
    tagline: 'Susegad Coastlines, Portuguese Heritage Quarters & Organic Spice Trails',
    bestMonths: 'November to February (Breezy sunny days and vibrant festive nights)',
    bgImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&auto=format&fit=crop&q=80',
    festivals: [
      {
        name: 'Goa Carnival (Viva Carnival)',
        dates: 'February (4 Days Before Lent)',
        description: 'Vibrant street parades with King Momo, brass marching bands, colorful costumes, and open-air food fiestas in Panaji and Margao.',
        insiderTip: 'Watch the Panaji float parade from the riverside promenade near DB Marg.',
        significance: 'Century-old Portuguese-Goan cultural tradition celebrating music and joy.'
      },
      {
        name: 'Shigmo Street Festival',
        dates: 'March (Spring)',
        description: 'Traditional Goan Hindu spring celebration featuring massive mythological floats, Ghode Modni horse dances, and Romat music.',
        insiderTip: 'Head to Ponda to experience authentic rural temple celebrations.',
        significance: 'Welcomes the spring harvest and honors warriors returning from battle.'
      }
    ],
    hiddenGems: [
      {
        title: 'Fontainhas Latin Quarter Heritage Walk',
        category: 'Ancient Architecture',
        location: 'Panaji Old City',
        description: '18th-century Portuguese villas painted in pastel yellow, terracotta and indigo with oyster-shell windows and wrought-iron balconies.',
        bestTimeToVisit: '7:30 AM – 9:30 AM before road traffic begins'
      },
      {
        title: 'Netravali Bubbling Lake & Organic Spice Sanctuary',
        category: 'Secret Trails',
        location: 'Sanguem, South Goa',
        description: 'A sacred step-pond where clean continuous natural methane bubbles rise to the surface when you clap hands.',
        bestTimeToVisit: '10:00 AM – 1:00 PM'
      },
      {
        title: 'Chorão Island Mangrove Canoe Sanctuary',
        category: 'Village Life',
        location: 'Mandovi River Estuary',
        description: 'Take a free government solar ferry to paddle through dense silent mangrove channels filled with kingfishers and otters.',
        bestTimeToVisit: '6:30 AM Sunrise canoe tour'
      }
    ],
    seasonalFoods: [
      {
        name: 'Authentic Goan Fish Curry Thali with Poi',
        type: 'Must-Try Specialty',
        famousSpot: 'Ritz Classic (Panaji) / Kokni Kanteen',
        priceRange: '₹220 – ₹380 per thali',
        description: 'Fresh Kingfish (Surmai) cooked in coconut, kashmiri chilli and tart kokum gravy, served with hot local crusty poi bread.'
      },
      {
        name: 'Traditional Bebinca (7-Layer Indo-Portuguese Cake)',
        type: 'Royal Heritage Dish',
        famousSpot: 'Confeitaria 31 De Janeiro (Fontainhas)',
        priceRange: '₹120 per slice',
        description: 'Slow-baked caramelized multi-layer pudding made of coconut milk, egg yolk, nutmeg, and pure ghee.'
      },
      {
        name: 'Prawn Balchão & Ros Omelette',
        type: 'Street Food Legend',
        famousSpot: 'Sandeep Gaddo Street Stall (Panaji Church Square)',
        priceRange: '₹70 – ₹130',
        description: 'Fluffy masala omelette drenched in rich spicy chicken xacuti gravy with fresh lime.'
      }
    ],
    budgetStays: [
      {
        name: 'Olaulim Backwater Eco Sanctuary',
        type: 'Backwater Lodge',
        pricePerNight: 1800,
        rating: 4.9,
        ecoScore: 'A+ (Solar Powered, Natural Water Springs)',
        amenities: ['Kayaks & Canoes', 'Pet Friendly', 'Organic Goan Meals', 'River Deck']
      },
      {
        name: 'Fontainhas Portuguese Villa Homestay',
        type: 'Heritage Haveli',
        pricePerNight: 1400,
        rating: 4.8,
        ecoScore: 'A (Heritage Restoration)',
        amenities: ['Antique Teak Furniture', 'French Balcony', 'High-Speed Fiber WiFi']
      }
    ],
    safety: [
      {
        score: 9.5,
        crowdLevel: 'Moderate (Pleasant)',
        emergencyContacts: [
          { service: 'Goa Coastal Lifeguard (Drishti Marine)', number: '0832-2419400' },
          { service: 'State Emergency Response', number: '112' },
          { service: 'Tourist Safety Helpline', number: '1364' }
        ],
        insiderSafetyTips: [
          'Swim only in designated lifeguard-patrolled safe beach zones; red flags indicate hazardous rip currents.',
          'Rent helmets and check vehicle documents when hiring self-drive scooters.'
        ]
      }
    ],
    sustainability: {
      co2SavedKg: 7.4,
      ecoRewardPoints: 140,
      greenRoute: 'Solar River Ferry + Electric Bicycle Trail along Mandovi & Zuari',
      recommendedTransit: 'Government Electric Solar Ferries & Geared Bicycles',
      localInitiative: 'Community-led Coastal Mangrove Reforestation and Olive Ridley Turtle Nesting Protection.'
    }
  }
};

/**
 * Helper to fetch or dynamically build authentic plan for ANY city in India
 */
export function getCulturalTripPlan(destination: string, dates?: string): CulturalPlan {
  const normalized = destination.trim().toLowerCase();

  for (const key of Object.keys(INDIAN_CULTURAL_DATABASE)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return INDIAN_CULTURAL_DATABASE[key];
    }
  }

  const cityName = destination.trim() || 'India Cultural Hub';
  return {
    destination: cityName,
    state: 'India',
    tagline: `Authentic Cultural Heritage, Sacred Traditions & Local Treasures in ${cityName}`,
    bestMonths: 'October to March (Pleasant weather across most Indian regions)',
    bgImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&auto=format&fit=crop&q=80',
    festivals: [
      {
        name: `${cityName} Heritage Cultural Utsav`,
        dates: dates || 'Upcoming Season',
        description: `Traditional folk performances, regional craft exhibitions, and community celebrations unique to ${cityName}.`,
        insiderTip: 'Visit the local municipal heritage complex in early evenings for open-air folk recitals.',
        significance: `Celebrates the indigenous history, folklore, and craft traditions of ${cityName}.`
      },
      {
        name: 'Evening Temple Aarti & Riverfront Rituals',
        dates: 'Daily at Sunset',
        description: 'Vedic chants, holy brass lamps, and community prayers at ancient neighborhood sanctums.',
        insiderTip: 'Arrive 30 minutes before sunset for peaceful seating.',
        significance: 'Centuries-old spiritual tradition offering gratitude to nature.'
      }
    ],
    hiddenGems: [
      {
        title: `${cityName} Old Town Artisan Quarter`,
        category: 'Artisans & Crafts',
        location: `Old Bazaar Area, ${cityName}`,
        description: 'Generations of local craftsmen producing handmade brassware, pottery, and regional handloom textiles.',
        bestTimeToVisit: '10:00 AM – 2:00 PM'
      },
      {
        title: 'Historic Fort & Panoramic Hilltop Trail',
        category: 'Ancient Architecture',
        location: `Heritage Ridge, ${cityName}`,
        description: 'Ancient stonework viewpoints offering magnificent 360-degree sunset panoramas.',
        bestTimeToVisit: '4:30 PM – 6:00 PM'
      },
      {
        title: 'Secret Stepwell & Shaded Banyan Courtyard',
        category: 'Secret Trails',
        location: `Village Outskirts, ${cityName}`,
        description: 'A centuries-old natural water harvesting monument surrounded by traditional peacocks and village homes.',
        bestTimeToVisit: 'Morning sunrise'
      }
    ],
    seasonalFoods: [
      {
        name: `Authentic ${cityName} Royal Thali`,
        type: 'Royal Heritage Dish',
        famousSpot: 'Old Town Heritage Dining Hall',
        priceRange: '₹180 – ₹320 per thali',
        description: 'Slow-cooked regional seasonal curries served with freshly baked bread and pure desi ghee.'
      },
      {
        name: 'Famous Regional Street Chaat & Sweet Lassi',
        type: 'Street Food Legend',
        famousSpot: 'Clock Tower Main Square',
        priceRange: '₹40 – ₹70',
        description: 'Spiced crispy savories served with chilled thick clay-pot lassi.'
      },
      {
        name: 'Traditional Hot Jalebi with Rabdi',
        type: 'Must-Try Specialty',
        famousSpot: 'Bazaar Sweet Mart (Since 1948)',
        priceRange: '₹60 per plate',
        description: 'Crispy golden saffron spirals dipped in sugar nectar and served with thickened clotted milk.'
      }
    ],
    budgetStays: [
      {
        name: `${cityName} Heritage Garden Homestay`,
        type: 'Eco-Homestay',
        pricePerNight: 1250,
        rating: 4.8,
        ecoScore: 'A+ (Solar Powered & Plastic-Free)',
        amenities: ['Traditional Home Breakfast', 'Free Walking Tour Guide', 'Clean RO Water', 'WiFi']
      },
      {
        name: `${cityName} Haveli Guesthouse`,
        type: 'Heritage Haveli',
        pricePerNight: 1650,
        rating: 4.9,
        ecoScore: 'A (Local Sourced Materials)',
        amenities: ['Carved Balconies', 'Rooftop Cafe', 'Bicycle Rentals']
      }
    ],
    safety: [
      {
        score: 9.3,
        crowdLevel: 'Moderate (Pleasant)',
        emergencyContacts: [
          { service: 'National All-in-One Emergency', number: '112' },
          { service: 'Tourist Police Helpline', number: '1364' },
          { service: 'Women Power Helpline', number: '1090' }
        ],
        insiderSafetyTips: [
          'Verify taxi rates or use meter/app-based electric e-rickshaws for short intra-city trips.',
          'Keep your hotel address card in both English and Hindi for smooth local navigation.'
        ]
      }
    ],
    sustainability: {
      co2SavedKg: 4.5,
      ecoRewardPoints: 85,
      greenRoute: 'Electric Train Transit + Guided Neighborhood Walking Circuit',
      recommendedTransit: 'Electric Rail + Local E-Rickshaw Trails',
      localInitiative: 'Support for local village artisans and heritage conservation under the Digital India Tourism Mission.'
    }
  };
}
