import React, { useState, useMemo } from 'react';
import { 
  Clock, 
  Hotel, 
  Plane, 
  CheckCircle2, 
  XCircle, 
  X, 
  MapPin, 
  Sparkles, 
  Star, 
  Calendar, 
  Users, 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  Compass, 
  Utensils
} from 'lucide-react';
import nainitalLakeImg from '../../images/nainital-lake.jpg';

export type TourCategory = 'all' | 'royal' | 'spiritual' | 'himalayan' | 'wellness' | 'workcation' | 'family';

export type TourPackage = {
  id: string;
  title: string;
  subtitle: string;
  category: 'royal' | 'spiritual' | 'himalayan' | 'wellness' | 'workcation' | 'family';
  duration: string;
  days: number;
  nights: number;
  hotel: string;
  transport: string;
  meals: string;
  pricePerPerson: number;
  rating: number;
  reviewCount: number;
  image: string;
  badge: string;
  placesCovered: string[];
  includes: string[];
  excludes: string[];
  itinerary: {
    day: number;
    title: string;
    description: string;
    highlights: string[];
  }[];
};

export const PACKAGES_DATA: TourPackage[] = [
  // --- 1. WELLNESS & AYURVEDA ---
  {
    id: 'kerala-ayurveda-wellness',
    title: 'Kerala Ayurvedic Rejuvenation & Yoga Sanctuary',
    subtitle: 'Doctor-supervised daily herbal therapies, sunrise yoga, and organic Sattvic dining',
    category: 'wellness',
    duration: '5 Days / 4 Nights',
    days: 5,
    nights: 4,
    hotel: 'Heritage Ayurvedic Wellness Retreat & Backwater Eco-Resort',
    transport: 'Private Dedicated AC Sedan',
    meals: 'Curated Daily Organic Sattvic Ayurvedic Cuisine & Detox Teas',
    pricePerPerson: 21500,
    rating: 4.97,
    reviewCount: 310,
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&auto=format&fit=crop&q=80',
    badge: 'Holistic Wellness',
    placesCovered: ['Kumarakom', 'Marari Beach', 'Vembanad Lake', 'Kochi'],
    includes: [
      'Daily 90-min Doctor-Prescribed Abhyanga & Shirodhara Therapies',
      'Morning Sunset Pranayama & Asana Sessions with Master Yogi',
      'Herbal Oil Treatments & Consultation with Chief Vaidya',
      'Quiet Canoe Boat Meditation on Vembanad Lotus Canals',
      'Exclusive Ayurvedic Wellness Gift Kit with Certified Herbal Oils'
    ],
    excludes: [
      'Flights to Cochin International Airport',
      'Optional personalized Panchakarma extended kits',
      'Personal laundry & dry cleaning'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Kumarakom & Initial Vaidya (Doctor) Consultation',
        description: 'Warm herbal welcome. Personalized pulse diagnosis (Nadi Pariksha) by the chief Ayurvedic doctor to curate your customized dosha diet and therapy plan.',
        highlights: ['Nadi Pariksha Pulse Diagnosis', 'Herbal Welcome Ritual', 'Evening Yoga Nidra']
      },
      {
        day: 2,
        title: 'Abhyanga Oil Massage & Backwater Meditation',
        description: 'Morning sunrise yoga on the wooden lake deck. Full-body herbal oil Abhyanga massage followed by therapeutic steam bath and quiet canoe meditation.',
        highlights: ['Full-body Abhyanga', 'Herbal Steam Bath', 'Canoe Canal Meditation']
      },
      {
        day: 3,
        title: 'Shirodhara Mind Relaxation & Organic Cooking Workshop',
        description: 'Experience authentic Shirodhara (warm medicated oil poured gently over the third eye) for deep nervous relaxation. Afternoon Satvik culinary workshop.',
        highlights: ['Authentic Shirodhara Therapy', 'Satvik Cooking Masterclass', 'Sunset Herbal Tea']
      },
      {
        day: 4,
        title: 'Marari Beach Walk & Sound Healing Session',
        description: 'Drive to secluded Marari Beach for a mindful barefoot sandy walk. Evening crystal singing bowl sound healing session under palm groves.',
        highlights: ['Marari Barefoot Beach Walk', 'Crystal Bowl Sound Healing', 'Rejuvenation Dinner']
      },
      {
        day: 5,
        title: 'Final Health Debrief & Departure',
        description: 'Morning yoga, personalized take-home lifestyle regimen by your Vaidya, and private transfer to Cochin Airport.',
        highlights: ['Personalized Wellness Chart', 'Airport Departure']
      }
    ]
  },
  {
    id: 'rishikesh-yoga-retreat',
    title: 'Rishikesh Himalayan Yoga & Ganga Meditation Retreat',
    subtitle: 'Vedic chanting, sound healing, beach meditation, and Parmarth Niketan aarti',
    category: 'wellness',
    duration: '4 Days / 3 Nights',
    days: 4,
    nights: 3,
    hotel: 'Luxury Riverfront Himalayan Ashrams & Boutique Stay',
    transport: 'Private AC Innova / SUV',
    meals: 'Daily Satvik Vegetarian Feasts & Herbal Immunity Drinks',
    pricePerPerson: 15800,
    rating: 4.93,
    reviewCount: 260,
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
    badge: 'Spiritual Wellness',
    placesCovered: ['Rishikesh', 'Shivpuri', 'Triveni Ghat', 'Beatles Ashram'],
    includes: [
      'Daily 2x Hatha & Vinyasa Yoga Sessions with certified Himalayan gurus',
      'VIP Seating at Parmarth Niketan Ganga Maha Aarti',
      'Tibetan Singing Bowl Sound Bath & Chakra Alignment',
      'Private Sunrise Meditation on White Sand Ganga Beach',
      'Guided Beatles Ashram Heritage & Graffiti Walk'
    ],
    excludes: [
      'Travel to Dehradun Airport / Haridwar Station',
      'Optional White Water Rafting charges',
      'Personal astrology consultations'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Rishikesh & Triveni Ghat Aarti',
        description: 'Check-in to riverside sanctuary with panoramic views of Shivalik hills. Evening participation in the soul-stirring Ganga Aarti at Triveni Ghat.',
        highlights: ['Ghatside Welcome', 'Triveni Ghat Aarti', 'Satvik Thali Dinner']
      },
      {
        day: 2,
        title: 'White Sand Beach Meditation & Sound Bath',
        description: 'Morning silent walking meditation on Shivpuri white sand beach. Afternoon sound healing therapy with Himalayan bronze bowls.',
        highlights: ['Beach Sunrise Yoga', 'Sound Healing Bath', 'Chakra Alignment']
      },
      {
        day: 3,
        title: 'Beatles Ashram & Parmarth Niketan Celebration',
        description: 'Explore the iconic Maharishi Mahesh Yogi ashram where the Beatles meditated in 1968. Evening Parmarth Niketan Ganga Aarti with Vedic chanting.',
        highlights: ['Beatles Ashram Domes', 'Parmarth Niketan Aarti', 'Himalayan Herbal Tea']
      },
      {
        day: 4,
        title: 'Kunjapuri Sunrise Panorama & Departure',
        description: 'Dawn drive to Kunjapuri Temple (1,645m) for 360-degree snow peaks sunrise view. Breakfast and transfer to Dehradun Jolly Grant Airport.',
        highlights: ['Kunjapuri Himalayan View', 'Dehradun Transfer']
      }
    ]
  },

  // --- 2. ROYAL & PALACES ---
  {
    id: 'rajasthan-royal',
    title: 'Royal Rajasthan Heritage & Desert Odyssey',
    subtitle: 'Palaces of Jaipur, blue alleyways of Jodhpur, and shimmering lakes of Udaipur',
    category: 'royal',
    duration: '6 Days / 5 Nights',
    days: 6,
    nights: 5,
    hotel: 'Heritage Haveli & Desert Luxury Swiss Tent',
    transport: 'Private AC Sedan / SUV',
    meals: 'Daily Breakfast & Traditional Rajasthani Thali Feasts',
    pricePerPerson: 24999,
    rating: 4.92,
    reviewCount: 420,
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&auto=format&fit=crop&q=80',
    badge: 'Heritage Classic',
    placesCovered: ['Jaipur', 'Jodhpur', 'Udaipur', 'Pushkar', 'Osian Desert'],
    includes: [
      'Amber Fort Royal Jeep Ascent & Guided Walk',
      'Lake Pichola Sunset Boat Cruise in Udaipur',
      'Desert Safari & Folk Kalbelia Dance Camp',
      'Mehrangarh Fort Audio-Guided Heritage Tour',
      'Royal Rajasthani Gatte ki Sabzi & Dal Baati Feast'
    ],
    excludes: [
      'Inter-state Flight tickets',
      'Camera & Video Drone licenses at monuments',
      'Personal tipping and monument entry fees'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Jaipur Pink City Check-in & Hawa Mahal Walk',
        description: 'Arrival in Jaipur, transfer to a restored royal haveli. Evening stroll through Johari Bazaar and illumination photography at Hawa Mahal.',
        highlights: ['Haveli Check-in', 'Johari Bazaar Gems', 'Hawa Mahal Night View']
      },
      {
        day: 2,
        title: 'Amber Fort, City Palace & Jantar Mantar',
        description: 'Full day exploring Amber Fort’s Sheesh Mahal, royal courtyards of City Palace, and UNESCO astronomical observatory Jantar Mantar.',
        highlights: ['Sheesh Mahal Mirror Hall', 'City Palace Museum', 'Panna Meena Kund']
      },
      {
        day: 3,
        title: 'Sacred Pushkar Lake to Jodhpur Sun City',
        description: 'Drive via sacred Brahma Temple in Pushkar to Jodhpur. Sunset photography over the indigo-blue lanes of the old city.',
        highlights: ['Brahma Temple Pushkar', 'Blue City Rooftop Views', 'Clock Tower Market']
      },
      {
        day: 4,
        title: 'Mehrangarh Citadel & Desert Dune Camp',
        description: 'Tour the invincible Mehrangarh Fort. Evening camel ride and desert camp with live manganiyar folk singers under starry skies.',
        highlights: ['Mehrangarh Fort', 'Jaswant Thada', 'Desert Folk Camp']
      },
      {
        day: 5,
        title: 'Udaipur City of Lakes & Lake Pichola Cruise',
        description: 'Scenic Aravalli drive to Udaipur. Sunset boat ride on Lake Pichola passing Taj Lake Palace and Jag Mandir Island.',
        highlights: ['Ranakpur Jain Temples', 'Lake Pichola Boat Cruise', 'Bagore Ki Haveli Dance']
      },
      {
        day: 6,
        title: 'City Palace Museum & Departure',
        description: 'Morning walk through Udaipur City Palace complex and Saheliyon Ki Bari garden before private transfer to Udaipur Airport.',
        highlights: ['Udaipur City Palace', 'Saheliyon Ki Bari', 'Airport Departure']
      }
    ]
  },
  {
    id: 'golden-triangle',
    title: 'Golden Triangle Classic Cultural Trail',
    subtitle: 'Delhi Mughal monuments, Agra Taj Mahal sunrise, and Jaipur Amber Fort',
    category: 'royal',
    duration: '5 Days / 4 Nights',
    days: 5,
    nights: 4,
    hotel: '5-Star Heritage & Luxury City Hotels',
    transport: 'Private Luxury AC Sedan / SUV',
    meals: 'Daily Gourmet Breakfast & Curated Dinner Tastings',
    pricePerPerson: 17900,
    rating: 4.96,
    reviewCount: 680,
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80',
    badge: 'World Wonder',
    placesCovered: ['Delhi', 'Agra', 'Fatehpur Sikri', 'Jaipur'],
    includes: [
      'Sunrise Skip-the-Line Entry to Taj Mahal with Historian',
      'Agra Fort & Mughal Marble Inlay Craft Workshop',
      'Fatehpur Sikri Buland Darwaza Guided Exploration',
      'Old Delhi Chandni Chowk Rickshaw Food Trail',
      'Jaipur Hawa Mahal & Amber Palace Royal Entry'
    ],
    excludes: [
      'International / Domestic Airfare',
      'Personal shopping and laundry',
      'Alcoholic beverages'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Delhi Heritage: Qutub Minar & Chandni Chowk',
        description: 'Tour UNESCO Qutub Minar and Humayun’s Tomb. Take a cycle rickshaw ride through bustling spice alleys of Old Delhi Chandni Chowk.',
        highlights: ['Qutub Minar', 'Humayun’s Tomb', 'Chandni Chowk Rickshaw']
      },
      {
        day: 2,
        title: 'Expressway to Agra & Sunset over Mehtab Bagh',
        description: 'Morning drive via Yamuna Expressway to Agra. Visit monumental Agra Fort and view Taj Mahal across the river during twilight at Mehtab Bagh.',
        highlights: ['Yamuna Expressway', 'Agra Fort Red Sandstone', 'Mehtab Bagh Sunset']
      },
      {
        day: 3,
        title: 'Sunrise at Taj Mahal & Fatehpur Sikri to Jaipur',
        description: 'Breathtaking sunrise tour of the Taj Mahal. Drive to Jaipur stopping at Emperor Akbar’s deserted red stone capital Fatehpur Sikri.',
        highlights: ['Sunrise Taj Mahal Wonder', 'Fatehpur Sikri Buland Darwaza', 'Jaipur Arrival']
      },
      {
        day: 4,
        title: 'Jaipur Forts, City Palace & Johari Bazaar',
        description: 'Explore the grand ramparts of Amber Fort, City Palace royal armory museum, and Jantar Mantar observatory.',
        highlights: ['Amber Fort Jeep Ride', 'City Palace Museum', 'Johari Bazaar Gems']
      },
      {
        day: 5,
        title: 'Hawa Mahal & Departure to Delhi Airport',
        description: 'Morning photo stop at iconic Honeycombed Hawa Mahal, Jal Mahal lake palace, and return transfer to Delhi IGI Airport.',
        highlights: ['Hawa Mahal Palace of Winds', 'Jal Mahal Lake', 'Delhi Airport Transfer']
      }
    ]
  },

  // --- 3. HIMALAYAN EXPEDITIONS ---
  {
    id: 'kashmir-paradise',
    title: 'Kashmir Paradise & Houseboat Expedition',
    subtitle: 'Snow-capped peaks, shikara twilight, and authentic pine valley retreats',
    category: 'himalayan',
    duration: '5 Days / 4 Nights',
    days: 5,
    nights: 4,
    hotel: 'Boutique Resort & Luxury Nigeen Houseboat',
    transport: 'Private Dedicated AC Innova',
    meals: 'Daily Royal Breakfast & Authentic Kashmiri Dinners',
    pricePerPerson: 18500,
    rating: 4.95,
    reviewCount: 340,
    image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=800&auto=format&fit=crop&q=80',
    badge: 'Bestseller',
    placesCovered: ['Srinagar', 'Gulmarg', 'Pahalgam', 'Sonamarg', 'Dal Lake'],
    includes: [
      'Deluxe Houseboat Stay with Shikara Cruise',
      'Gulmarg Gondola Phase 1 Fast-track Pass',
      'Pahalgam Betaab Valley Sightseeing',
      'Traditional Wazwan 4-Course Dinner Experience',
      'All Tolls, Fuel, Driver Allowances & Permits'
    ],
    excludes: [
      'Domestic Airfare to Srinagar',
      'Gondola Phase 2 High Altitude Peak Ride',
      'Pony rides or personal shopping expenses'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Srinagar & Sunset Shikara on Dal Lake',
        description: 'Warm Kashmiri welcome at Srinagar Airport. Check-in to heritage houseboat on Nigeen Lake followed by a sunset Shikara ride across floating gardens.',
        highlights: ['Nigeen Lake Houseboat', 'Char Chinar Shikara Cruise', 'Kahwa Welcome Drink']
      },
      {
        day: 2,
        title: 'Gulmarg Meadow of Flowers & Gondola Ride',
        description: 'Scenic pine drive to Gulmarg (2,730m). Experience Asia’s highest cable car gondola ride to Apharwat peak and alpine meadows.',
        highlights: ['Gondola Cable Car', 'Apharwat Alpine Snow', 'St. Mary’s Church']
      },
      {
        day: 3,
        title: 'Pahalgam Valley of Shepherds & Lidder River',
        description: 'Drive through saffron fields of Pampore to Pahalgam. Explore Lidder river banks, Aru valley views, and Betaab valley pine trails.',
        highlights: ['Pampore Saffron Farms', 'Lidder River Rapids', 'Betaab Valley']
      },
      {
        day: 4,
        title: 'Mughal Gardens & Old City Artisan Walks',
        description: 'Heritage exploration of Shalimar Bagh, Nishat Bagh, and Old Srinagar papier-mâché and pashmina weaving artisan quarters.',
        highlights: ['Shalimar Royal Gardens', 'Pashmina Weavers Walk', 'Jamia Masjid Srinagar']
      },
      {
        day: 5,
        title: 'Morning Floating Market & Departure',
        description: 'Early morning vegetable floating market shikara ride, breakfast, and private transfer to Srinagar Airport for departure.',
        highlights: ['Floating Vegetable Market', 'Airport Transfer']
      }
    ]
  },
  {
    id: 'ladakh-high-passes',
    title: 'Leh–Ladakh High Passes & Monasteries Odyssey',
    subtitle: 'Khardung La, starry skies over Pangong Tso, and ancient Buddhist Gompas',
    category: 'himalayan',
    duration: '6 Days / 5 Nights',
    days: 6,
    nights: 5,
    hotel: 'Premium Hotel in Leh & Luxury Swiss Geodesic Camp at Pangong',
    transport: 'Private 4x4 Luxury Scorp / Innova',
    meals: 'Daily Breakfast & Tibetan Butter Tea / Buffet Dinners',
    pricePerPerson: 26800,
    rating: 4.96,
    reviewCount: 390,
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=800&auto=format&fit=crop&q=80',
    badge: 'Trans-Himalaya',
    placesCovered: ['Leh', 'Nubra Valley', 'Pangong Tso', 'Khardung La', 'Thiksey'],
    includes: [
      'Inner Line Permits for Nubra Valley & Pangong Tso',
      'High-Altitude Geodesic Dome Camp Stay with Stargazing Telescopes',
      'Double-Humped Bactrian Camel Ride in Hunder Sand Dunes',
      'Thiksey & Diskit Monastery Morning Prayer Ceremonies',
      'Oxygen Cylinder Equipped Dedicated Vehicle'
    ],
    excludes: [
      'Flights into Leh Kushok Bakula Airport',
      'Personal altitude medication & warm gear',
      'Rafting on Zanskar River'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Leh & Essential Acclimatization',
        description: 'Arrival at Leh (3,500m). Full day of gentle rest and hydration for altitude acclimatization. Evening sunset walk to Shanti Stupa.',
        highlights: ['Leh Acclimatization', 'Shanti Stupa Sunset', 'Leh Main Bazaar']
      },
      {
        day: 2,
        title: 'Sham Valley: Hall of Fame & Magnetic Hill',
        description: 'Drive along Indus-Zanskar confluence (Sangam), Magnetic Hill optical illusion, and sacred Gurdwara Pathar Sahib.',
        highlights: ['Sangam Confluence', 'Magnetic Hill', 'Pathar Sahib Gurdwara']
      },
      {
        day: 3,
        title: 'Khardung La Pass to Nubra Valley Dunes',
        description: 'Cross the world’s legendary motorable pass Khardung La (17,982 ft). Descend to Nubra Valley and ride double-humped camels in Hunder white dunes.',
        highlights: ['Khardung La Pass', 'Hunder Camel Safari', 'Diskit Giant Buddha']
      },
      {
        day: 4,
        title: 'Shyok River Route to Pangong Tso Shimmering Lake',
        description: 'Drive through dramatic river gorges to Pangong Tso (14,270 ft). Watch the lake shift 7 shades of blue during twilight from your luxury dome.',
        highlights: ['Pangong Tso 7-Color Lake', 'Stargazing Milky Way Camp']
      },
      {
        day: 5,
        title: 'Chang La Pass to Thiksey Monastery & Leh',
        description: 'Sunrise photography at Pangong. Return to Leh crossing Chang La pass (17,590 ft) visiting Thiksey Monastery, replica of Tibet’s Potala Palace.',
        highlights: ['Thiksey Monastery', 'Shey Palace', 'Chang La Pass']
      },
      {
        day: 6,
        title: 'Leh Airport Departure',
        description: 'Morning breakfast and farewell transfer to Leh Airport with unforgettable Himalayan memories.',
        highlights: ['Leh Airport Transfer']
      }
    ]
  },

  // --- 4. WORKCATION & SOLO ESCAPES ---
  {
    id: 'goa-heritage-workcation',
    title: 'Goa Portuguese Heritage & High-Speed Co-Living',
    subtitle: 'Restored Latin Quarter villas, dedicated 300 Mbps workspace, and quiet Mandrem beaches',
    category: 'workcation',
    duration: '6 Days / 5 Nights',
    days: 6,
    nights: 5,
    hotel: 'Boutique Heritage Villa & Co-Living Beach Studio',
    transport: 'Complimentary Rental Scooter / AC Cab Transfers',
    meals: 'Daily Healthy Breakfast Bowls, Artisanal Coffee & Goan Dinners',
    pricePerPerson: 16900,
    rating: 4.88,
    reviewCount: 195,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80',
    badge: 'Nomad Favorite',
    placesCovered: ['Fontainhas Panaji', 'Mandrem', 'Divar Island', 'Anjuna'],
    includes: [
      'Guaranteed 300 Mbps Fiber Wifi with Power Backup Desk Space',
      'Fontainhas Latin Quarter Guided Architectural Walk & Bakery Trail',
      'Divar Island Sunset E-Bike Ride across Mango Groves',
      'Curated Co-Working Networking Mixers with Global Nomads',
      'Scooter / Electric Vehicle Rental for entire stay'
    ],
    excludes: [
      'Travel to Goa Dabolim / MOPA Airport',
      'Alcohol and nightclub covers',
      'Fuel for rental scooter'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Check-in to Fontainhas Latin Villa & Workspace Setup',
        description: 'Arrival in Panaji. Check-in to your vibrant colonial villa, ergonomic desk setup, and evening bakery walk for fresh pasteis de nata.',
        highlights: ['Fontainhas Colorful Alleys', 'Ergonomic Desk Setup', 'Artisanal Coffee Bar']
      },
      {
        day: 2,
        title: 'Focused Work Hours & Sunset Kayaking',
        description: 'High-speed productive morning work hours. Late afternoon backwater kayaking through serene Nerul mangrove river.',
        highlights: ['Superfast Fiber Work Hours', 'Nerul Mangrove Kayaking']
      },
      {
        day: 3,
        title: 'Divar Island E-Bike Heritage Expedition',
        description: 'Work from a charming island cafe followed by an evening electric bike ride through ancient Portuguese churches and sluice gates.',
        highlights: ['Divar Island E-Biking', 'Goan Fish Curry Lunch']
      },
      {
        day: 4,
        title: 'Mandrem Beach Co-Working & Sound Bath',
        description: 'Relocate to beachside co-working pavilion in North Goa. Enjoy sunset swim and evening acoustic music by the beach.',
        highlights: ['Mandrem Beach Pavilion', 'Sunset Swim', 'Acoustic Bonfire']
      },
      {
        day: 5,
        title: 'Flea Market, Artisan Roasters & Community Dinner',
        description: 'Productivity sprints, specialty coffee tasting at local micro-roasters, and farewell Goan community seafood feast.',
        highlights: ['Artisan Coffee Trail', 'Goan Community Dinner']
      },
      {
        day: 6,
        title: 'Morning Dip & Airport Departure',
        description: 'Morning swim, breakfast, and private transfer to MOPA / Dabolim Airport.',
        highlights: ['Airport Transfer']
      }
    ]
  },
  {
    id: 'bir-billing-himalayan-nomad',
    title: 'Bir Billing & Dharamshala Himalayan Nomad Trail',
    subtitle: 'Mountain view co-working, tandem paragliding take-off, and Tibetan monastery trails',
    category: 'workcation',
    duration: '5 Days / 4 Nights',
    days: 5,
    nights: 4,
    hotel: 'Co-Living Mountain Villa & Cloud Eco-Cabins',
    transport: 'Private Local Transfers',
    meals: 'Daily Organic Breakfast, Tibetan Thukpa & Herbal Mountain Teas',
    pricePerPerson: 14800,
    rating: 4.91,
    reviewCount: 220,
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop&q=80',
    badge: 'Mountain Nomad',
    placesCovered: ['Bir Colony', 'Billing Take-off', 'McLeodganj', 'Dharamkot'],
    includes: [
      'Dedicated Ergonomic Workstations with 200 Mbps Fiber Internet',
      'Tandem Paragliding Flight from Billing (2,400m) with Go-Pro Video',
      'Chokling & Sherabling Monastery Monk Chanting Experience',
      'Kangra Valley Organic Tea Garden Tasting Pass',
      'Guided Pine Forest Sunset Trek to Bangoru Waterfall'
    ],
    excludes: [
      'Travel to Kangra Airport / Pathankot Station',
      'Personal cafe hopping bills',
      'Extra extreme adventure add-ons'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Bir Tibetan Colony & Villa Check-in',
        description: 'Arrival in scenic Bir valley. Check into mountain villa, test high-speed wifi, and stroll through Buddhist prayer flag alleyways.',
        highlights: ['Tibetan Colony Check-in', 'Prayer Flag Walk', 'Himalayan Thukpa']
      },
      {
        day: 2,
        title: 'Focused Work Sprint & Tandem Paragliding from Billing',
        description: 'Morning productive work session. Afternoon drive to Billing for a thrilling 25-minute tandem paragliding flight over pine forests.',
        highlights: ['Billing Tandem Paragliding', 'GoPro Aerial Footage', 'Sunset Landing']
      },
      {
        day: 3,
        title: 'Sherabling Forest Monastery & Tea Gardens',
        description: 'Remote work from a forest cafe overlooking Kangra valley. Visit the massive Palpung Sherabling monastery tucked inside oak woods.',
        highlights: ['Sherabling Monastery', 'Kangra Green Tea Tasting']
      },
      {
        day: 4,
        title: 'Day Trip to McLeodganj & Dalai Lama Temple',
        description: 'Visit the seat of His Holiness the Dalai Lama in Dharamshala, Norbulingka Tibetan institute, and Dharamkot meditation cafes.',
        highlights: ['Dalai Lama Temple', 'Norbulingka Art Institute', 'Dharamkot Sunset']
      },
      {
        day: 5,
        title: 'Sunrise Walk & Departure',
        description: 'Morning waterfall hike, farewell breakfast, and transfer to Gaggal Airport or Pathankot railway junction.',
        highlights: ['Bangoru Waterfall', 'Airport Transfer']
      }
    ]
  },

  // --- 5. FAMILY & WILDLIFE ---
  {
    id: 'nainital-corbett',
    title: 'Himalayan Nainital Lake & Corbett Wildlife Circuit',
    subtitle: 'Emerald lake sailing, Naina Devi blessings, and thrilling Bengal Tiger safari',
    category: 'family',
    duration: '4 Days / 3 Nights',
    days: 4,
    nights: 3,
    hotel: 'Heritage Lakeview Villa & Jungle Safari Wilderness Resort',
    transport: 'Private AC SUV (Innova / Ertiga)',
    meals: 'Daily Breakfast, Kumaoni Lunch & Campfire Barbeque Dinners',
    pricePerPerson: 16400,
    rating: 4.89,
    reviewCount: 215,
    image: nainitalLakeImg,
    badge: 'Family Favorite',
    placesCovered: ['Nainital', 'Bhimtal', 'Pangot Bird Sanctuary', 'Jim Corbett National Park'],
    includes: [
      'Private Yacht Sailing on Emerald Naini Lake',
      'Exclusive 4x4 Gypsy Tiger Safari in Jim Corbett Reserve',
      'Naina Devi Shaktipeeth VIP Temple Darshan',
      'Pangot Himalayan Bird Watching Sunrise Trek',
      'Kumaoni Bal Mithai & Singori Tasting Box'
    ],
    excludes: [
      'Travel from home city to Kathgodam/Delhi',
      'Camera lens entry permits inside National Park',
      'Optional paragliding at Bhimtal'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Scenic Hill Climb to Nainital & Mall Road Stroll',
        description: 'Ascend through pine forests to Nainital (2,084m). Check-in to lakeview villa. Evening stroll along Mall Road and local candle markets.',
        highlights: ['Naini Lake Sunset', 'Mall Road Tibetan Market', 'Kumaoni Dinner']
      },
      {
        day: 2,
        title: 'Lake Yachting, Naina Devi & Snow View Peak',
        description: 'Sail on traditional wooden boats across Naini Lake. Visit Naina Devi Temple and take aerial ropeway cable car to Snow View Peak for Nanda Devi panorama.',
        highlights: ['Naini Lake Yachting', 'Naina Devi Shaktipeeth', 'Nanda Devi Views']
      },
      {
        day: 3,
        title: 'Pangot Himalayan Ridge to Jim Corbett Jungle',
        description: 'Morning bird watching drive to Pangot. Descend into dense Sal forests of Jim Corbett National Park. Evening wildlife documentary and campfire.',
        highlights: ['Pangot Pine Ridge', 'Corbett Resort Check-in', 'Evening Campfire']
      },
      {
        day: 4,
        title: 'Morning 4x4 Gypsy Tiger Safari & Departure',
        description: 'Early morning open 4x4 Jeep Safari through Corbett Tiger Reserve. Spot wild Asian elephants, deer, and Royal Bengal Tigers before departure.',
        highlights: ['4x4 Gypsy Wildlife Safari', 'Kosi River Crossing', 'Kathgodam/Delhi Transfer']
      }
    ]
  },
  {
    id: 'kerala-backwaters',
    title: 'Kerala Backwaters & Western Ghats Trail',
    subtitle: 'Tea carpeted hills of Munnar, spice plantations, and private luxury houseboat cruise',
    category: 'family',
    duration: '5 Days / 4 Nights',
    days: 5,
    nights: 4,
    hotel: 'Hillside Plantation Resort & Private Luxury Alleppey Houseboat',
    transport: 'Private AC Sedan with English/Hindi speaking Chauffeur',
    meals: 'Daily South Indian Breakfast, Authentic Sadya Lunch & Fresh Seafood Dinners',
    pricePerPerson: 19800,
    rating: 4.94,
    reviewCount: 290,
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800&auto=format&fit=crop&q=80',
    badge: 'Family Delight',
    placesCovered: ['Fort Kochi', 'Munnar', 'Thekkady', 'Alleppey (Alappuzha)'],
    includes: [
      '22-Hour Exclusive Private Houseboat Cruise with Chef on Board',
      'Munnar Kolukkumalai Tea Garden Jeep Trek',
      'Periyar Spice Plantation Guided Aroma Walk',
      'Evening Kathakali & Kalaripayattu Martial Art Show',
      'Kerala Ayurvedic Herbal Rejuvenation Massage Coupon'
    ],
    excludes: [
      'Flight tickets to Kochi Airport',
      'Optional bamboo rafting in Periyar',
      'Extra beverage orders on houseboat'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Kochi Heritage Walk & Drive to Munnar Hills',
        description: 'Explore Chinese Fishing Nets and Jewish Synagogue in Fort Kochi. Ascend misty Western Ghats through Cheeyappara waterfalls to Munnar.',
        highlights: ['Fort Kochi Chinese Nets', 'Cheeyappara Waterfalls', 'Munnar Tea Hills']
      },
      {
        day: 2,
        title: 'Munnar Tea Museum & Eravikulam National Park',
        description: 'Visit Tata Tea Museum to witness tea leaf processing. Spot endangered Nilgiri Tahr mountain goats at Eravikulam National Park.',
        highlights: ['Eravikulam Nilgiri Tahr', 'Mattupetty Dam', 'Echo Point Walk']
      },
      {
        day: 3,
        title: 'Thekkady Spice Trails & Kalaripayattu Show',
        description: 'Drive to Thekkady. Walk through organic cardamom, pepper, and cinnamon plantations. Evening martial arts performance.',
        highlights: ['Spice Plantation Tour', 'Kalaripayattu Martial Show', 'Kathakali Drama']
      },
      {
        day: 4,
        title: 'Alleppey Private Houseboat Backwater Cruise',
        description: 'Board your private AC Kettuvallam houseboat. Glide through palm-fringed canals, paddy fields, and serene lagoons with live cooked meals.',
        highlights: ['Private Houseboat Cruise', 'Vembanad Lake Sunset', 'Karimeen Fish Fry Dinner']
      },
      {
        day: 5,
        title: 'Alleppey Sunrise & Departure from Kochi',
        description: 'Morning backwater tranquility breakfast on deck, check-out, and private transfer to Cochin International Airport (COK).',
        highlights: ['Backwater Village Walk', 'Kochi Airport Transfer']
      }
    ]
  },

  // --- 6. SACRED PILGRIMAGE TRAILS ---
  {
    id: 'varanasi-ayodhya',
    title: 'Spiritual Varanasi & Ayodhya Sacred Heritage Trail',
    subtitle: 'Dawn Ganga rituals, Kashi Vishwanath corridor, and grand Sarayu Deepotsav',
    category: 'spiritual',
    duration: '4 Days / 3 Nights',
    days: 4,
    nights: 3,
    hotel: 'Riverfront Heritage Boutique Hotel & 4-Star Ayodhya Stay',
    transport: 'Private Dedicated AC Vehicle',
    meals: 'Pure Vegetarian Sattvic Meals & Banarasi Lassi Tastings',
    pricePerPerson: 14200,
    rating: 4.98,
    reviewCount: 510,
    image: 'https://images.unsplash.com/photo-1505764706515-aa95265c5abc?w=800&auto=format&fit=crop&q=80',
    badge: 'Spiritual Gem',
    placesCovered: ['Varanasi (Kashi)', 'Sarnath', 'Ayodhya', 'Sarayu River'],
    includes: [
      'Private Hand-Rowed Dawn Boat Ride on River Ganga',
      'VIP Darshan Assistance at Kashi Vishwanath',
      'Dashashwamedh Ghat Evening Ganga Maha Aarti Seats',
      'Ram Janmabhoomi & Hanumangarhi Ayodhya Guided Visit',
      'Authentic Banarasi Paan, Chaat & Malaiyo Food Trail'
    ],
    excludes: [
      'Travel to Varanasi/Ayodhya from origin city',
      'Special personal puja samagri',
      'Souvenirs & Silk saree purchases'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Varanasi & Grand Evening Ganga Aarti',
        description: 'Check-in to ghat-view heritage stay. Evening reserved boat seating to witness the world-famous synchronized Ganga Aarti at Dashashwamedh.',
        highlights: ['Ghatside Welcome', 'Dashashwamedh Maha Aarti', 'Banarasi Street Food']
      },
      {
        day: 2,
        title: 'Subah-e-Banaras Boat Ride & Kashi Vishwanath Corridor',
        description: 'Morning boat ride observing thousands bathing at Manikarnika and Assi Ghat. Walk through Kashi Vishwanath Temple corridor and Sarnath Buddhist ruins.',
        highlights: ['Dawn Boat Rituals', 'Kashi Vishwanath Corridor', 'Sarnath Dhamek Stupa']
      },
      {
        day: 3,
        title: 'Scenic Drive to Ayodhya & Ram Janmabhoomi Darshan',
        description: 'Morning drive to holy city of Ayodhya. Visit the magnificent Shri Ram Janmabhoomi Temple, Hanumangarhi, and Kanak Bhawan.',
        highlights: ['Ram Janmabhoomi Mandir', 'Hanumangarhi 76-Step Temple', 'Kanak Bhawan']
      },
      {
        day: 4,
        title: 'Sarayu River Aarti & Departure',
        description: 'Morning prayers at Ram Ki Paidi on the banks of Sarayu river. Transfer to Ayodhya Maharishi Valmiki Airport or Varanasi Junction.',
        highlights: ['Sarayu Ram Ki Paidi', 'Guptar Ghat', 'Airport Transfer']
      }
    ]
  },
  {
    id: 'south-temple-grand-trail',
    title: 'Grand Dravidian Temple Trail (Madurai, Thanjavur & Rameswaram)',
    subtitle: 'Towering thousand-pillar gopurams, 22 sacred wells, and Chola architectural wonders',
    category: 'spiritual',
    duration: '5 Days / 4 Nights',
    days: 5,
    nights: 4,
    hotel: 'Heritage Boutique Stays in Chettinad & 4-Star Temple Hotels',
    transport: 'Private Dedicated AC Innova',
    meals: 'Traditional Chettinad Banana Leaf Feasts & Pure South Indian Filter Coffee',
    pricePerPerson: 17500,
    rating: 4.95,
    reviewCount: 380,
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
    badge: 'Dravidian Sacred',
    placesCovered: ['Madurai', 'Rameswaram', 'Dhanushkodi', 'Thanjavur'],
    includes: [
      'Madurai Meenakshi Amman Temple VIP Darshan & Night Chariot Ceremony',
      'Rameswaram Ramanathaswamy 22 Sacred Well Bathing Ritual with Priest',
      'Thanjavur UNESCO Brihadeeswarar Temple Architectural Heritage Walk',
      'Ghost Town of Dhanushkodi & Ram Setu Vantage Point 4x4 Ride',
      'Chettinad Palace Heritage Lunch on Fresh Banana Leaf'
    ],
    excludes: [
      'Travel to Madurai Airport / Station',
      'Special personal archana fees',
      'Souvenir bronze / Tanjore paintings'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Madurai & Meenakshi Amman Temple',
        description: 'Check-in to Madurai. Evening tour of the 14-towered Meenakshi Amman Temple and witness the royal bedchamber procession.',
        highlights: ['Meenakshi Amman Gopuram', 'Thousand Pillar Hall', 'Night Procession']
      },
      {
        day: 2,
        title: 'Scenic Sea Bridge to Holy Rameswaram Island',
        description: 'Drive across Pamban Sea Bridge to Rameswaram. Experience the 22 holy teerthams and Ramanathaswamy Temple’s longest pillared corridor in the world.',
        highlights: ['Pamban Bridge Views', '22 Holy Wells Bath', 'Ramanathaswamy Corridor']
      },
      {
        day: 3,
        title: 'Dhanushkodi Ram Setu & Chettinad Mansions',
        description: 'Morning drive to the tip of India at Dhanushkodi where the Indian Ocean meets the Bay of Bengal. Afternoon drive to grand Chettinad palaces.',
        highlights: ['Dhanushkodi Ram Setu Point', 'Chettinad 100-Room Mansions', 'Chettinad Feast']
      },
      {
        day: 4,
        title: 'Thanjavur Brihadisvara (Big Temple) Wonder',
        description: 'Explore the 1000-year-old UNESCO Chola masterwork Brihadisvara Temple with its monolithic 80-tonne granite dome.',
        highlights: ['Brihadisvara Big Temple', 'Thanjavur Art Gallery', 'Bronze Casting Workshop']
      },
      {
        day: 5,
        title: 'Departure from Trichy / Madurai',
        description: 'Morning South Indian filter coffee, breakfast, and transfer to Tiruchirappalli (TRZ) or Madurai (IXM) Airport.',
        highlights: ['Airport Departure']
      }
    ]
  }
];

interface TourPackagesSectionProps {
  activeCategory?: TourCategory;
  onSelectCategory?: (category: TourCategory) => void;
}

const TourPackagesSection: React.FC<TourPackagesSectionProps> = ({ 
  activeCategory: propActiveCategory,
  onSelectCategory: propOnSelectCategory
}) => {
  const [internalCategory, setInternalCategory] = useState<TourCategory>('all');
  
  // Use prop if passed, otherwise use internal state
  const activeCategory = propActiveCategory || internalCategory;
  const setActiveCategory = (cat: TourCategory) => {
    if (propOnSelectCategory) {
      propOnSelectCategory(cat);
    } else {
      setInternalCategory(cat);
    }
  };

  const [selectedItineraryPackage, setSelectedItineraryPackage] = useState<TourPackage | null>(null);
  
  // Booking Modal State
  const [bookingPackage, setBookingPackage] = useState<TourPackage | null>(null);
  const [travelersCount, setTravelersCount] = useState<number>(2);
  const [travelDate, setTravelDate] = useState<string>('2026-09-15');
  const [selectedAddons, setSelectedAddons] = useState<{ [key: string]: boolean }>({
    guide: true,
    foodWalk: false,
    photoSession: false,
    suvUpgrade: false
  });
  
  // Form State
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string>('');

  // Filtered packages
  const filteredPackages = useMemo(() => {
    if (activeCategory === 'all') return PACKAGES_DATA;
    return PACKAGES_DATA.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  // Pricing calculations
  const calculateTotal = () => {
    if (!bookingPackage) return 0;
    let base = bookingPackage.pricePerPerson * travelersCount;
    if (selectedAddons.guide) base += 1500;
    if (selectedAddons.foodWalk) base += (800 * travelersCount);
    if (selectedAddons.photoSession) base += 2200;
    if (selectedAddons.suvUpgrade) base += 3500;
    
    // Add 5% GST
    const gst = Math.round(base * 0.05);
    return base + gst;
  };

  const handleOpenBooking = (pkg: TourPackage) => {
    setBookingPackage(pkg);
    setBookingConfirmed(false);
    setSelectedItineraryPackage(null);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerPhone) {
      alert('Please fill in your contact information to reserve the package.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const generatedId = `DAR-EXP-${Math.floor(1000 + Math.random() * 9000)}`;
      setConfirmedBookingId(generatedId);
      setIsSubmitting(false);
      setBookingConfirmed(true);

      // Save into localStorage for traveler persistence
      try {
        const existing = JSON.parse(localStorage.getItem('darshana_tour_bookings') || '[]');
        const newBooking = {
          bookingId: generatedId,
          packageTitle: bookingPackage?.title,
          travelers: travelersCount,
          date: travelDate,
          totalAmount: calculateTotal(),
          leadName: customerName,
          email: customerEmail,
          phone: customerPhone,
          timestamp: new Date().toISOString(),
          status: 'Confirmed'
        };
        localStorage.setItem('darshana_tour_bookings', JSON.stringify([newBooking, ...existing]));
      } catch (err) {
        console.warn('Booking storage notice:', err);
      }
    }, 1000);
  };

  return (
    <section id="packages" className="pt-16 pb-12 font-sans">
      
      {/* Section Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-50 border border-amber-200/80 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-2xs">
          <Sparkles size={13} className="text-amber-600" /> CURATED EXPEDITION BUNDLES
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 font-serif tracking-tight">
          Signature Indian Tour Packages
        </h2>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          Authentic, all-inclusive cultural journeys curated by local heritage scholars. Featuring boutique heritage stays, private AC transit, certified historians, and curated culinary trails.
        </p>
      </div>

      {/* Category Theme Filter Pills */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
        {[
          { id: 'all', label: 'All Expeditions' },
          { id: 'wellness', label: '🌿 Wellness & Ayurveda' },
          { id: 'royal', label: '👑 Royal & Palaces' },
          { id: 'himalayan', label: '🏔️ Himalayan Expeditions' },
          { id: 'workcation', label: '💻 Workcation & Solo' },
          { id: 'family', label: '🐅 Family & Wildlife' },
          { id: 'spiritual', label: '🪔 Sacred Pilgrimage' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id as TourCategory)}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer border ${
              activeCategory === tab.id
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm scale-105'
                : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400 hover:bg-stone-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Filter Result Counter */}
      <div className="mt-4 text-center">
        <span className="text-xs text-stone-500 font-medium">
          Showing <strong>{filteredPackages.length}</strong> {filteredPackages.length === 1 ? 'curated package' : 'curated packages'}
          {activeCategory !== 'all' && (
            <button 
              onClick={() => setActiveCategory('all')}
              className="ml-2 text-amber-700 underline font-semibold hover:text-amber-800"
            >
              (Show all)
            </button>
          )}
        </span>
      </div>

      {/* Packages Grid */}
      <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredPackages.map((pkg) => (
          <article 
            key={pkg.id} 
            className="rounded-3xl border border-stone-200/80 bg-white shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
          >
            {/* Image Header */}
            <div className="relative h-60 overflow-hidden">
              <img 
                src={pkg.image} 
                alt={pkg.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              
              {/* Badge & Rating */}
              <div className="absolute top-3.5 left-3.5 right-3.5 flex justify-between items-center">
                <span className="px-3 py-1 bg-amber-500 text-white text-[11px] font-bold rounded-full shadow-sm flex items-center gap-1">
                  <Sparkles size={12} /> {pkg.badge}
                </span>
                <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-semibold rounded-full flex items-center gap-1 border border-white/20">
                  <Star size={12} className="text-amber-400 fill-amber-400" /> {pkg.rating} ({pkg.reviewCount})
                </span>
              </div>

              {/* Title & Duration Overlay */}
              <div className="absolute bottom-3.5 left-4 right-4 text-white">
                <span className="inline-block text-[11px] font-semibold text-amber-300 mb-0.5 tracking-wider uppercase">
                  {pkg.duration}
                </span>
                <h3 className="text-xl font-bold font-serif leading-tight drop-shadow-xs">
                  {pkg.title}
                </h3>
              </div>
            </div>

            {/* Package Details Body */}
            <div className="p-5 sm:p-6 flex-grow flex flex-col justify-between space-y-4">
              
              {/* Places Covered Pills */}
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                {pkg.placesCovered.map((place) => (
                  <span key={place} className="bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded-md font-medium flex items-center gap-1">
                    <MapPin size={10} className="text-amber-700" /> {place}
                  </span>
                ))}
              </div>

              {/* Amenity Highlights */}
              <div className="space-y-2 text-xs text-stone-600 bg-stone-50/80 p-3.5 rounded-2xl border border-stone-200/60">
                <div className="flex items-center gap-2">
                  <Hotel size={14} className="text-amber-700 shrink-0" />
                  <span className="line-clamp-1">{pkg.hotel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Plane size={14} className="text-teal-700 shrink-0" />
                  <span className="line-clamp-1">{pkg.transport}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Utensils size={14} className="text-orange-700 shrink-0" />
                  <span className="line-clamp-1">{pkg.meals}</span>
                </div>
              </div>

              {/* Inclusions checklist (Top 3) */}
              <div className="space-y-1.5 text-xs">
                <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Package Highlights</p>
                {pkg.includes.slice(0, 3).map((inc, i) => (
                  <div key={i} className="flex items-start gap-2 text-stone-700">
                    <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{inc}</span>
                  </div>
                ))}
              </div>

              {/* Price & Action CTA */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-stone-400 block font-medium">All-Inclusive Starting At</span>
                  <p className="text-xl font-extrabold text-stone-900 font-serif">
                    ₹{pkg.pricePerPerson.toLocaleString('en-IN')}
                    <span className="text-xs font-normal text-stone-500 font-sans"> /person</span>
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => setSelectedItineraryPackage(pkg)}
                    className="px-3 py-2 rounded-xl border border-stone-300 text-stone-700 font-medium text-xs hover:bg-stone-50 transition cursor-pointer"
                    title="View Day-by-Day Itinerary"
                  >
                    Itinerary
                  </button>

                  <button 
                    onClick={() => handleOpenBooking(pkg)}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition shadow-xs flex items-center gap-1 cursor-pointer"
                  >
                    <span>Reserve</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>

            </div>
          </article>
        ))}
      </div>

      {/* 1. ITINERARY PREVIEW MODAL */}
      {selectedItineraryPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative shadow-2xl border border-stone-200">
            <button 
              onClick={() => setSelectedItineraryPackage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition cursor-pointer"
            >
              <X size={20} />
            </button>
            
            <div className="pr-8">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
                {selectedItineraryPackage.duration}
              </span>
              <h3 className="text-2xl font-bold font-serif text-stone-900 mt-1">
                {selectedItineraryPackage.title}
              </h3>
              <p className="text-xs text-stone-500 mt-1">{selectedItineraryPackage.subtitle}</p>
            </div>
            
            {/* Day by Day Plan */}
            <div className="mt-6 space-y-6">
              <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                <Calendar size={15} className="text-teal-700" /> Day-Wise Cultural Narrative
              </h4>

              <div className="space-y-4">
                {selectedItineraryPackage.itinerary.map((item) => (
                  <div key={item.day} className="flex gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      D{item.day}
                    </div>
                    <div className="space-y-1.5">
                      <h5 className="text-sm font-bold text-stone-900">{item.title}</h5>
                      <p className="text-xs text-stone-600 leading-relaxed">{item.description}</p>
                      
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {item.highlights.map((h) => (
                          <span key={h} className="text-[10px] font-medium bg-white px-2 py-0.5 rounded-md border border-stone-200 text-stone-700">
                            ✨ {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Inclusions & Exclusions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-200 text-xs">
                <div className="space-y-2">
                  <span className="font-bold text-emerald-800 uppercase tracking-wider block">Inclusions</span>
                  {selectedItineraryPackage.includes.map((inc, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-stone-700">
                      <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-rose-800 uppercase tracking-wider block">Exclusions</span>
                  {selectedItineraryPackage.excludes.map((exc, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-stone-700">
                      <XCircle size={13} className="text-rose-500 shrink-0 mt-0.5" />
                      <span>{exc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="pt-4 flex justify-between items-center">
                <div>
                  <span className="text-[11px] text-stone-400 block">Total Package Base</span>
                  <span className="text-xl font-bold font-serif text-stone-900">
                    ₹{selectedItineraryPackage.pricePerPerson.toLocaleString('en-IN')} <span className="text-xs font-normal text-stone-500 font-sans">/person</span>
                  </span>
                </div>

                <button 
                  onClick={() => handleOpenBooking(selectedItineraryPackage)}
                  className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm shadow-md transition cursor-pointer"
                >
                  Proceed to Book Package
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 2. INTERACTIVE PACKAGE BOOKING & CUSTOMIZATION MODAL */}
      {bookingPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-7 relative shadow-2xl border border-stone-200/80">
            <button 
              onClick={() => setBookingPackage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition cursor-pointer"
            >
              <X size={18} />
            </button>

            {!bookingConfirmed ? (
              <form onSubmit={handleConfirmBooking} className="space-y-5">
                
                {/* Header with Selected Package Info */}
                <div className="border-b border-stone-100 pb-4 pr-8">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                    Expedition Reservation
                  </span>
                  <h3 className="text-xl font-bold font-serif text-stone-900 mt-1">
                    {bookingPackage.title}
                  </h3>
                  <p className="text-xs text-stone-500 flex items-center gap-2 mt-1">
                    <span>🗓️ {bookingPackage.duration}</span>
                    <span>•</span>
                    <span>🏨 {bookingPackage.hotel}</span>
                  </p>
                </div>

                {/* Step 1: Travelers & Date Configuration */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Travelers Count */}
                  <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200/70">
                    <label className="text-xs font-semibold text-stone-700 block mb-1.5">
                      Number of Travelers
                    </label>
                    <div className="flex items-center justify-between bg-white px-3 py-1.5 rounded-xl border border-stone-200">
                      <button 
                        type="button"
                        onClick={() => setTravelersCount(Math.max(1, travelersCount - 1))}
                        className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-sm flex items-center justify-center cursor-pointer"
                      >
                        -
                      </button>
                      <span className="font-bold text-sm text-stone-900">{travelersCount} {travelersCount === 1 ? 'Person' : 'People'}</span>
                      <button 
                        type="button"
                        onClick={() => setTravelersCount(travelersCount + 1)}
                        className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-sm flex items-center justify-center cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Travel Start Date */}
                  <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200/70">
                    <label className="text-xs font-semibold text-stone-700 block mb-1.5">
                      Preferred Departure Date
                    </label>
                    <input 
                      type="date"
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="w-full bg-white px-3 py-1.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-medium text-stone-800 outline-none focus:border-amber-600"
                      required
                    />
                  </div>
                </div>

                {/* Step 2: Cultural Add-ons */}
                <div className="space-y-2 bg-stone-50 p-3.5 rounded-2xl border border-stone-200/70">
                  <span className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                    Optional Cultural Add-Ons
                  </span>
                  
                  <div className="space-y-2 text-xs">
                    <label className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-stone-200/80 cursor-pointer hover:border-stone-300">
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          checked={selectedAddons.guide}
                          onChange={(e) => setSelectedAddons({ ...selectedAddons, guide: e.target.checked })}
                          className="accent-amber-600" 
                        />
                        <span className="font-medium text-stone-800">Certified Local Historian / Guide</span>
                      </div>
                      <span className="font-semibold text-stone-600">+₹1,500</span>
                    </label>

                    <label className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-stone-200/80 cursor-pointer hover:border-stone-300">
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          checked={selectedAddons.foodWalk}
                          onChange={(e) => setSelectedAddons({ ...selectedAddons, foodWalk: e.target.checked })}
                          className="accent-amber-600" 
                        />
                        <span className="font-medium text-stone-800">Heritage Food Tasting Walk Pass</span>
                      </div>
                      <span className="font-semibold text-stone-600">+₹800/person</span>
                    </label>

                    <label className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-stone-200/80 cursor-pointer hover:border-stone-300">
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          checked={selectedAddons.photoSession}
                          onChange={(e) => setSelectedAddons({ ...selectedAddons, photoSession: e.target.checked })}
                          className="accent-amber-600" 
                        />
                        <span className="font-medium text-stone-800">Professional Travel Photography Session (50 HD Photos)</span>
                      </div>
                      <span className="font-semibold text-stone-600">+₹2,200</span>
                    </label>
                  </div>
                </div>

                {/* Step 3: Traveler Contact Info */}
                <div className="space-y-2.5">
                  <span className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                    Lead Traveler Information
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                    <input 
                      type="text"
                      placeholder="Full Name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-stone-200 bg-stone-50/50 outline-none focus:border-amber-600 focus:bg-white text-xs"
                      required
                    />
                    <input 
                      type="email"
                      placeholder="Gmail / Email Address"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-stone-200 bg-stone-50/50 outline-none focus:border-amber-600 focus:bg-white text-xs"
                      required
                    />
                    <input 
                      type="tel"
                      placeholder="Phone / WhatsApp"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-stone-200 bg-stone-50/50 outline-none focus:border-amber-600 focus:bg-white text-xs"
                      required
                    />
                  </div>
                </div>

                {/* Live Invoice Summary & CTA */}
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={16} className="text-emerald-700" />
                      <span className="text-xs font-bold text-stone-900">Total Payable (incl. 5% GST)</span>
                    </div>
                    <span className="text-2xl font-extrabold font-serif text-stone-900 block mt-0.5">
                      ₹{calculateTotal().toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-stone-500">
                      ₹{bookingPackage.pricePerPerson.toLocaleString('en-IN')} × {travelersCount} travelers + selected add-ons
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs sm:text-sm transition shadow-sm cursor-pointer whitespace-nowrap"
                  >
                    {isSubmitting ? 'Confirming Reservation...' : 'Confirm & Reserve Package'}
                  </button>
                </div>

              </form>
            ) : (
              /* SUCCESS CONFIRMATION STATE */
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <Check size={32} />
                </div>

                <div>
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
                    BOOKING RESERVED SUCCESSFULLY
                  </span>
                  <h3 className="text-2xl font-bold font-serif text-stone-900 mt-2">
                    Pack Your Bags, {customerName}!
                  </h3>
                  <p className="text-xs text-stone-600 max-w-md mx-auto mt-1">
                    Your reservation for <strong className="text-stone-900">{bookingPackage.title}</strong> has been confirmed for <strong>{travelersCount} travelers</strong> departing on <strong>{travelDate}</strong>.
                  </p>
                </div>

                {/* Booking Voucher Card */}
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-left max-w-md mx-auto space-y-2 text-xs">
                  <div className="flex justify-between items-center border-b border-stone-200 pb-2">
                    <span className="text-stone-500 font-medium">Booking Reference ID</span>
                    <span className="font-mono font-bold text-stone-900 bg-white px-2 py-0.5 rounded border border-stone-200">
                      {confirmedBookingId}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-500 font-medium">Amount Confirmed</span>
                    <span className="font-bold text-emerald-800">₹{calculateTotal().toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-500 font-medium">Confirmation Email</span>
                    <span className="text-stone-800 font-medium">{customerEmail}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-500 font-medium">Emergency Assistance</span>
                    <span className="text-amber-800 font-bold">24/7 YatraSahayak Active</span>
                  </div>
                </div>

                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => setBookingPackage(null)}
                    className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition cursor-pointer"
                  >
                    Done & Explore More
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </section>
  );
};

export default TourPackagesSection;
