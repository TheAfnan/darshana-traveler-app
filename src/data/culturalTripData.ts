// src/data/culturalTripData.ts

export interface CulturalPlan {
  destination: string;
  origin?: string;
  state: string;
  tagline: string;
  bestMonths: string;
  bgImage: string;
  currentMonthHighlight?: {
    title: string;
    badge: string;
    description: string;
    whereToExperience: string;
    whySpecial: string;
  };
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
    type: 'Must-Try Specialty' | 'Winter Delicacy' | 'Street Food Legend' | 'Royal Heritage Dish' | 'Summer Refresher';
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

export interface MonthRadar {
  monthName: string;
  monthNum: number;
  highlightTheme: string;
  topDestinations: {
    city: string;
    event: string;
    description: string;
    badge: string;
    icon: string;
    targetDate: string;
  }[];
}

export const MONTHLY_EVENT_RADAR: Record<number, MonthRadar> = {
  11: {
    monthName: 'November',
    monthNum: 11,
    highlightTheme: 'Sacred Illumination & Grand Deepotsav Season',
    topDestinations: [
      {
        city: 'Ayodhya',
        event: 'Grand Deepotsav & Ram Mandir Illumination',
        description: 'Over 2.5 million earthen diyas lit along Ram Ki Paidi & Saryu riverbanks with Ramayana drone & laser show.',
        badge: '🌟 Top Pick for Nov',
        icon: '🪔',
        targetDate: '2026-11-01'
      },
      {
        city: 'Varanasi',
        event: 'Dev Deepawali on 84 Ghats',
        description: 'All 84 stone ghats lit with 1.5M diyas on Kartik Purnima under midnight fireworks.',
        badge: 'Spiritual Wonder',
        icon: '🕉️',
        targetDate: '2026-11-15'
      },
      {
        city: 'Pushkar',
        event: 'Pushkar Camel Fair & Desert Carnival',
        description: 'World famous camel trading, hot air ballooning, and sacred lake dip under full moon.',
        badge: 'Desert Heritage',
        icon: '🐪',
        targetDate: '2026-11-20'
      }
    ]
  },
  5: {
    monthName: 'May',
    monthNum: 5,
    highlightTheme: 'Living Ganga-Jamuni Feasts & High Himalayan Passes',
    topDestinations: [
      {
        city: 'Lucknow',
        event: 'Bada Mangal (Jyeshtha Festival)',
        description: '400-year-old communal feast festival with 10,000+ free street bhandaras and cold sharbat kiosks across Lucknow.',
        badge: '🌟 Top Pick for May',
        icon: '🍲',
        targetDate: '2026-05-19'
      },
      {
        city: 'Ladakh',
        event: 'High Mountain Pass Openings & Monasteries',
        description: 'Khardung La & Zanskar passes opening with clear high-altitude Himalayan skies.',
        badge: 'Himalayan Wonder',
        icon: '🏔️',
        targetDate: '2026-05-25'
      }
    ]
  },
  10: {
    monthName: 'October',
    monthNum: 10,
    highlightTheme: 'Grand Festive Triumphs & Autumn Colors',
    topDestinations: [
      {
        city: 'Kolkata',
        event: 'UNESCO Durga Puja Pandal Carnival',
        description: 'The City of Joy transforms into an open-air art gallery with 3,000+ architectural pandals and dhak drum beats.',
        badge: '🌟 Top Pick for Oct',
        icon: '🪔',
        targetDate: '2026-10-18'
      },
      {
        city: 'Kullu',
        event: 'Kullu Dussehra & Valley of Gods Gathering',
        description: '300+ village deities arriving at Dhalpur Maidan in traditional wooden palanquins.',
        badge: 'Himalayan Heritage',
        icon: '🏔️',
        targetDate: '2026-10-22'
      }
    ]
  },
  3: {
    monthName: 'March',
    monthNum: 3,
    highlightTheme: 'Colors, Flowers & Royal Spring Feasts',
    topDestinations: [
      {
        city: 'Mathura & Vrindavan',
        event: 'World-Famous Braj Ki Holi & Lathmar Celebrations',
        description: '7-day divine celebration with flower petals, natural tesu flower gulal, and Barsana folk songs.',
        badge: '🌟 Top Pick for March',
        icon: '🎨',
        targetDate: '2026-03-24'
      },
      {
        city: 'Jaipur',
        event: 'Gangaur & Elephant Heritage Procession',
        description: 'Royal palanquin parades through Tripoliya Bazaar with Kalbelia dancers and Ghewar feasts.',
        badge: 'Royal Heritage',
        icon: '🌸',
        targetDate: '2026-03-20'
      }
    ]
  },
  2: {
    monthName: 'February',
    monthNum: 2,
    highlightTheme: 'Vibrant Carnivals & Desert Sand Dunes',
    topDestinations: [
      {
        city: 'Goa',
        event: 'Viva Goa Carnival Street Parade',
        description: 'Four days of open-air brass bands, King Momo floats, street dancing, and seafood fiestas.',
        badge: '🌟 Top Pick for Feb',
        icon: '🎭',
        targetDate: '2026-02-14'
      },
      {
        city: 'Agra',
        event: 'Taj Mahotsav Mughal Art & Craft Fair',
        description: '10-day extravaganza of classical arts, crafts, and Awadhi-Mughlai cuisine near the Taj Mahal.',
        badge: 'Heritage Fair',
        icon: '🏛️',
        targetDate: '2026-02-18'
      }
    ]
  },
  8: {
    monthName: 'August',
    monthNum: 8,
    highlightTheme: 'Monsoon Boat Races & Lush Emerald Backwaters',
    topDestinations: [
      {
        city: 'Kerala',
        event: 'Nehru Trophy Vallam Kali (Snake Boat Race)',
        description: '100-oared snake boats competing on Punnamada Lake to the rhythm of fast Vanchipattu boat songs.',
        badge: '🌟 Top Pick for August',
        icon: '🛶',
        targetDate: '2026-08-10'
      },
      {
        city: 'Jaipur',
        event: 'Monsoon Teej Procession',
        description: 'Goddess Parvati golden palanquin procession celebrating the onset of pleasant rains.',
        badge: 'Monsoon Joy',
        icon: '🌧️',
        targetDate: '2026-08-05'
      }
    ]
  }
};

/**
 * Month-based cultural matcher for top Indian cities
 */
export function getCulturalTripPlan(destination: string, travelDateStr?: string, originCity?: string): CulturalPlan {
  const normalized = destination.trim().toLowerCase();
  
  // Extract month from date (1 = Jan, 5 = May, 11 = Nov, etc.)
  let month = new Date().getMonth() + 1;
  if (travelDateStr) {
    const parsed = new Date(travelDateStr);
    if (!isNaN(parsed.getTime())) {
      month = parsed.getMonth() + 1;
    }
  }

  // -------------------------------------------------------------
  // 1. AYODHYA (Top for November Deepotsav & Ram Mandir)
  // -------------------------------------------------------------
  if (normalized.includes('ayodhya') || normalized.includes('ram mandir') || normalized.includes('saket')) {
    const isNov = month === 11 || month === 10;

    return {
      destination: 'Ayodhya',
      origin: originCity || 'Lucknow',
      state: 'Uttar Pradesh',
      tagline: 'The Sacred City of Lord Rama on the Banks of the Holy Saryu',
      bestMonths: 'October to March (November Deepotsav is a world record phenomenon)',
      bgImage: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=1200&auto=format&fit=crop&q=80',
      currentMonthHighlight: {
        title: isNov ? 'Grand Deepotsav on Saryu Ghats (2.5 Million Diyas)' : 'Ram Mandir Darshan & Evening Saryu Aarti',
        badge: isNov ? '🔥 November Deepotsav Special' : 'Sacred Spiritual Highlight',
        description: isNov 
          ? 'Ayodhya creates a world record with over 2.5 million earthen lamps lit across Ram Ki Paidi, Guptar Ghat, and the entire riverfront, synchronized with a massive 3D Ramayana laser & drone show.'
          : 'Experience the newly consecrated Nagara-style Ram Janmabhoomi temple followed by the divine evening Maha Aarti at Naya Ghat on the river Saryu.',
        whereToExperience: 'Ram Ki Paidi, Naya Ghat & Ram Janmabhoomi Path',
        whySpecial: 'The epicenter of Indian spiritual civilization and the most spectacular festival of lights in human history.'
      },
      festivals: [
        {
          name: 'Ayodhya Deepotsav',
          dates: 'November (Diwali Eve)',
          description: '2.5 million oil lamps lit along Saryu Ghats with international Ramlila troupes from Thailand, Indonesia & Sri Lanka.',
          insiderTip: 'Reach Ram Ki Paidi by 4:00 PM to secure prime viewing for the illuminated riverfront and laser show.',
          significance: 'Celebrates the triumphant return of Lord Rama to Ayodhya after 14 years.'
        },
        {
          name: 'Daily Maha Saryu Aarti',
          dates: 'Every Evening at 6:00 PM',
          description: 'Synchronized multi-tiered brass lamp aarti conducted by Vedic priests with floating floral diyas.',
          insiderTip: 'Take an electric solar boat cruise at sunset right before the aarti starts.',
          significance: 'Sacred worship of the holy Saryu river.'
        }
      ],
      hiddenGems: [
        {
          title: 'Guptar Ghat Sunken Sunset Promenade',
          category: 'Secret Trails',
          location: '7 km downstream from Main City',
          description: 'Serene, clean stone steps surrounded by lush gardens and historic temples where Lord Rama took Jal Samadhi.',
          bestTimeToVisit: '4:30 PM – 6:00 PM (Sunset tranquility)'
        },
        {
          title: 'Kanak Bhawan Gold-Ornamented Palace',
          category: 'Ancient Architecture',
          location: 'Near Hanuman Garhi',
          description: 'A magnificent palace gifted to Devi Sita by Queen Kaikeyi with gilded sanctums and classical Bundeli architecture.',
          bestTimeToVisit: '9:00 AM – 11:30 AM (Morning bhajans)'
        }
      ],
      seasonalFoods: [
        {
          name: 'Ayodhya Peda & Khoya Gujiya',
          type: 'Must-Try Specialty',
          famousSpot: 'Maurya Misthan Bhandar (Hanuman Garhi Chowk)',
          priceRange: '₹60 – ₹120',
          description: 'Slow-caramelized buffalo milk fudge infused with cardamom and topped with slivered almonds.'
        },
        {
          name: 'Saryu Kinare Bedmi Puri with Aloo Dum',
          type: 'Street Food Legend',
          famousSpot: 'Naya Ghat Food Kiosks',
          priceRange: '₹40 – ₹60 per plate',
          description: 'Urad-dal stuffed crispy fried pooris served with spicy hing-infused pumpkin & potato curry.'
        }
      ],
      budgetStays: [
        {
          name: 'Saryu Riverfront Heritage Dharmashala & B&B',
          type: 'Heritage Haveli',
          pricePerNight: 950,
          rating: 4.8,
          ecoScore: 'A+ (Solar Powered & Plastic-Free)',
          amenities: ['Direct Ghat Walking Access', 'Satvik Pure Veg Meals', 'Clean RO Water', 'WiFi']
        }
      ],
      safety: [
        {
          score: 9.6,
          crowdLevel: isNov ? 'High (Festive Rush)' : 'Moderate (Pleasant)',
          emergencyContacts: [
            { service: 'Ayodhya Tourist Police Control', number: '112' },
            { service: 'Ram Janmabhoomi Pilgrim Desk', number: '05278-292000' }
          ],
          insiderSafetyTips: [
            'Book VIP or Sugam Darshan passes on the official trust portal to avoid physical queues.',
            'Direct Vande Bharat Express connects Delhi/Lucknow to Ayodhya in under 2 hours.'
          ]
        }
      ],
      sustainability: {
        co2SavedKg: 5.8,
        ecoRewardPoints: 115,
        greenRoute: 'Lucknow-Ayodhya Vande Bharat Electric + Saryu Solar Electric Ferry',
        recommendedTransit: 'Electric Vande Bharat + Solar River Catamaran + E-Rickshaw',
        localInitiative: 'Zero Carbon Pilgrim Corridor with 100% solar powered street illumination along Ram Path.'
      }
    };
  }

  // -------------------------------------------------------------
  // 2. LUCKNOW
  // -------------------------------------------------------------
  if (normalized.includes('lucknow') || normalized.includes('lko')) {
    const isMayJune = month === 5 || month === 6;
    const isWinter = month >= 10 || month <= 2;

    const monthHighlight = isMayJune
      ? {
          title: 'Bada Mangal (Jyeshtha Mangal) — Lucknow’s Unique Unity Festival',
          badge: 'May / June Special',
          description: 'A 400-year-old festival started by Nawab Asaf-ud-Daula’s mother Begum Janab-e-Aliya. Every Tuesday in Jyeshtha month, thousands of free street bhandaras serve puri-sabzi, chana, and cold Rooh Afza sharbat to everyone with zero religious divide.',
          whereToExperience: 'Old Aliganj Hanuman Mandir & Chowk to Hazratganj Street Bhandaras',
          whySpecial: 'The purest living example of Lucknow’s Ganga-Jamuni Tehzeeb where Hindu and Muslim families organize community feasts together.'
        }
      : isWinter
      ? {
          title: 'Lucknow Mahotsav & Morning Makhan Malai Trails',
          badge: 'Winter Special (Nov - Feb)',
          description: 'Grand cultural evenings at Rumi Darwaza with classical Kathak, Zardozi exhibitions, and early morning fresh dew-whipped Makhan Malai (Nimish).',
          whereToExperience: 'Husainabad Heritage Quarter & Chowk Gol Darwaza',
          whySpecial: 'Royal Nawabi culinary and artisan culture in peak pleasant weather.'
        }
      : {
          title: 'Malihabad Dasheri Mango Harvest & Evening Heritage Baithaks',
          badge: 'Seasonal Highlight',
          description: 'Travel through 30,000 acres of royal mango orchards in Malihabad, tasting heirloom Dasheri mangoes picked right off the trees.',
          whereToExperience: 'Malihabad Orchards (25 km from city)',
          whySpecial: 'Centuries-old mango groves established by the Nawabs of Awadh.'
        };

    return {
      destination: 'Lucknow',
      origin: originCity || 'Delhi',
      state: 'Uttar Pradesh',
      tagline: 'The Heart of Tehzeeb, Royal Awadhi Flavors & Architectural Wonders',
      bestMonths: 'October to March (Plus May/June for Bada Mangal & July for Mango Harvest)',
      bgImage: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1200&auto=format&fit=crop&q=80',
      currentMonthHighlight: monthHighlight,
      festivals: [
        isMayJune ? {
          name: 'Bada Mangal (Jyeshtha Festival)',
          dates: 'Every Tuesday in May & June',
          description: 'Citywide community feast festival with 10,000+ free food kiosks across all streets of Lucknow.',
          insiderTip: 'Start early at Old Aliganj Temple, then walk through Hazratganj and Chowk to experience the communal hospitality.',
          significance: '400-year-old Awadhi tradition started by Nawab Begum Janab-e-Aliya.'
        } : {
          name: 'Lucknow Mahotsav',
          dates: 'Late November – Early December',
          description: 'A 10-day grand cultural festival of classical Awadhi music, Kathak, and master Chikankari stalls.',
          insiderTip: 'Visit the Shilp Gram pavilion to buy authentic Zardozi and Chikankari directly from weavers.',
          significance: 'Celebrates the syncretic Ganga-Jamuni heritage of Awadh.'
        },
        {
          name: 'Sham-e-Awadh Heritage Evenings',
          dates: 'Year-Round (Best on Weekends)',
          description: 'Traditional musical baithaks, ghazals, and Dastangoi (Urdu storytelling) at Rumi Darwaza.',
          insiderTip: 'Take the late afternoon walk starting from Teele Wali Masjid down to the clock tower.',
          significance: 'Preserves the centuries-old art of oral storytelling.'
        }
      ],
      hiddenGems: [
        {
          title: 'Chowk Chikankari & Zardozi Weavers Alley',
          category: 'Artisans & Crafts',
          location: 'Old Chowk Bazaar, Nazirabad Lane',
          description: 'Master artisans handcrafting 32 distinct shadow-work embroidery stitches on fine mulmul cotton.',
          bestTimeToVisit: '11:00 AM – 4:00 PM (Natural light)'
        },
        {
          title: 'Bara Imambara Whispering Labyrinth (Bhool Bhulaiya)',
          category: 'Ancient Architecture',
          location: 'Machchhi Bhavan',
          description: 'An arched maze with 489 identical doorways and hollow acoustic walls where a whisper travels 50 meters.',
          bestTimeToVisit: 'Early morning 8:30 AM before tourist rush'
        },
        {
          title: 'The British Residency Bullet-Scarred Ruins',
          category: 'Secret Trails',
          location: 'River Gomti Bank',
          description: 'Quiet green gardens preserving original 1857 memorial walls with preserved cannonball marks.',
          bestTimeToVisit: '4:30 PM – 6:00 PM (Sunset golden hour)'
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
          name: isWinter ? 'Makhan Malai (Nimish Cloud Dessert)' : 'Royal Kulfi Falooda with Rose Sharbat',
          type: isWinter ? 'Winter Delicacy' : 'Summer Refresher',
          famousSpot: isWinter ? 'Chowk Gol Darwaza' : 'Prakash Kulfi (Aminabad)',
          priceRange: '₹50 – ₹80',
          description: isWinter ? 'Airy, saffron-infused dew-whipped milk foam with silver vark.' : 'Rich thickened rabdi kulfi topped with fragrant rose syrup.'
        },
        {
          name: 'Kashmiri Chai (Gulabi Tea) with Khatai',
          type: 'Street Food Legend',
          famousSpot: 'Akbari Gate Night Market',
          priceRange: '₹30 per cup',
          description: 'Naturally pink slow-brewed salted-sweet tea spiced with cardamom and thick clotted malai.'
        }
      ],
      budgetStays: [
        {
          name: 'Gomti Heritage Courtyard B&B',
          type: 'Heritage Haveli',
          pricePerNight: 1450,
          rating: 4.8,
          ecoScore: 'A+ (Solar Powered)',
          amenities: ['Awadhi Home Breakfast', 'Free Walking Guide', 'WiFi', 'Garden Lawn']
        },
        {
          name: 'Habibullah Estate Colonial Villa',
          type: 'Riverside Villa',
          pricePerNight: 2100,
          rating: 4.9,
          ecoScore: 'A (Organic Kitchen)',
          amenities: ['Antique Teak Beds', 'Heritage Library', 'Bicycles']
        }
      ],
      safety: [
        {
          score: 9.4,
          crowdLevel: isMayJune ? 'High (Festive Rush)' : 'Moderate (Pleasant)',
          emergencyContacts: [
            { service: 'UP Police Emergency', number: '112' },
            { service: 'Women Power Line', number: '1090' },
            { service: 'Tourist Helpdesk (Charbagh)', number: '0522-2635678' }
          ],
          insiderSafetyTips: [
            'Old Chowk lanes are best navigated on foot or via electric e-rickshaws.',
            'Direct Express trains (Vande Bharat / Shatabdi) from Delhi take under 6 hours.'
          ]
        }
      ],
      sustainability: {
        co2SavedKg: 4.8,
        ecoRewardPoints: 95,
        greenRoute: 'Delhi-Lucknow Vande Bharat Electric Express + E-Rickshaw Old City Tour',
        recommendedTransit: 'Electric Vande Bharat + Lucknow Metro + Walking Trails',
        localInitiative: 'Supports 250+ women weavers under the One District One Product (ODOP) Chikankari mission.'
      }
    };
  }

  // -------------------------------------------------------------
  // 2. VARANASI
  // -------------------------------------------------------------
  if (normalized.includes('varanasi') || normalized.includes('kashi') || normalized.includes('banaras')) {
    const isNov = month === 11;
    const isMarch = month === 3;
    const isSawan = month === 7 || month === 8;

    const monthHighlight = isNov
      ? {
          title: 'Dev Deepawali (Festival of the Gods) on the 84 Ghats',
          badge: 'November Kartik Purnima',
          description: 'Over 1.5 million clay diyas lit across all 84 riverfront stone ghats, accompanied by Vedic chants, grand fireworks, and boat processions.',
          whereToExperience: 'Dashashwamedh to Assi Ghat via wooden boat',
          whySpecial: 'The most sacred evening on the Ganges, celebrating Lord Shiva’s victory over Tripurasura.'
        }
      : isMarch
      ? {
          title: 'Maha Shivratri & Rangbhari Ekadashi (Holi with Gulal & Ashes)',
          badge: 'March Shivratri Special',
          description: 'Lord Shiva’s wedding procession through ancient alleys, followed by the unique Masan Holi celebration.',
          whereToExperience: 'Kashi Vishwanath Corridor & Manikarnika Ghat',
          whySpecial: 'A spiritual festival of color and transcendence found nowhere else on earth.'
        }
      : isSawan
      ? {
          title: 'Shravan Month Kashi Vishwanath Sawan Melas',
          badge: 'Monsoon Devotional',
          description: 'Devotees (Kanwariyas) carrying holy Ganga water to Kashi Vishwanath with temple bells resonating 24x7.',
          whereToExperience: 'Kashi Vishwanath Temple & Assi Ghat Morning Aarti',
          whySpecial: 'Peak devotional energy and holy monsoon boat rides.'
        }
      : {
          title: 'Subah-e-Banaras & Ganga Sunset Heritage Aarti',
          badge: 'Daily Spiritual Wonder',
          description: 'Sunrise Vedic chanting, classical sitar recitals, and evening multi-tiered brass lamp aarti on the riverbank.',
          whereToExperience: 'Assi Ghat at 5:30 AM & Dashashwamedh at 6:30 PM',
          whySpecial: 'Unbroken 3,000-year-old living spiritual continuity.'
        };

    return {
      destination: 'Varanasi',
      origin: originCity || 'Lucknow',
      state: 'Uttar Pradesh',
      tagline: 'The World’s Oldest Living Spiritual City on the Sacred Ganga',
      bestMonths: 'October to March (Plus Sawan in July-August)',
      bgImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1200&auto=format&fit=crop&q=80',
      currentMonthHighlight: monthHighlight,
      festivals: [
        {
          name: isNov ? 'Dev Deepawali' : 'Daily Maha Ganga Aarti',
          dates: isNov ? 'Kartik Purnima (Nov)' : 'Daily at 6:30 PM',
          description: 'Synchronized brass lamp rituals conducted by Vedic priests with conch shells and sacred chants.',
          insiderTip: 'Book a hand-rowed boat 30 minutes before sunset for the best crescent river view.',
          significance: 'Ancient Vedic worship offering gratitude to Mother Ganga.'
        }
      ],
      hiddenGems: [
        {
          title: 'Sarai Mohana Banarasi Silk Weavers Village',
          category: 'Artisans & Crafts',
          location: '8 km North of City',
          description: 'Master weavers weaving pure gold Zari thread into world-famous Katan silk bridal sarees on pit looms.',
          bestTimeToVisit: '10:00 AM – 2:00 PM'
        },
        {
          title: 'Lolark Kund Ancient Solar Stepwell',
          category: 'Ancient Architecture',
          location: 'Near Bhadaini Ghat',
          description: 'A 1,200-year-old subterranean sun stepwell with 50 steep stone steps.',
          bestTimeToVisit: 'Early morning sunlight'
        }
      ],
      seasonalFoods: [
        {
          name: 'Kashi Tamatar Chaat & Chooda Matar',
          type: 'Street Food Legend',
          famousSpot: 'Kashi Chaat Bhandar (Godowlia)',
          priceRange: '₹40 – ₹80',
          description: 'Hot spicy tomato puree stewed in desi ghee with hing, cashews, and lemon in clay pots.'
        },
        {
          name: 'Original Banarasi Thandai with Kesar & Pista',
          type: 'Must-Try Specialty',
          famousSpot: 'Mishrambu Thandai (Since 1895, Godowlia)',
          priceRange: '₹60 per glass',
          description: 'Almond-fennel milk cooled in earthen pots, enriched with saffron strands.'
        }
      ],
      budgetStays: [
        {
          name: 'Kedareswar Ganga Heritage Homestay',
          type: 'Heritage Haveli',
          pricePerNight: 1200,
          rating: 4.9,
          ecoScore: 'A+ (Direct Ghat View)',
          amenities: ['Direct Ganga Balcony', 'Rooftop Yoga', 'Organic Chai']
        }
      ],
      safety: [
        {
          score: 9.2,
          crowdLevel: isNov ? 'High (Festive Rush)' : 'Moderate (Pleasant)',
          emergencyContacts: [
            { service: 'Varanasi Police Control', number: '112' },
            { service: 'Ghat Tourist Police', number: '0542-2508000' }
          ],
          insiderSafetyTips: [
            'Stick to registered life-jacket compliant boats operated by verified boatmen.',
            'Photography at Manikarnika cremation steps is strictly prohibited.'
          ]
        }
      ],
      sustainability: {
        co2SavedKg: 6.2,
        ecoRewardPoints: 120,
        greenRoute: 'Vande Bharat Electric Rail + Ganga Heritage Ghat Walk',
        recommendedTransit: 'Electric Rail + Walking the 84 Ghats',
        localInitiative: 'Clean Ganga Mission support with 100% biodegradable floral waste recycling.'
      }
    };
  }

  // -------------------------------------------------------------
  // 3. JAIPUR
  // -------------------------------------------------------------
  if (normalized.includes('jaipur') || normalized.includes('pink city')) {
    const isJan = month === 1;
    const isMonsoon = month === 7 || month === 8;
    const isMarch = month === 3;

    const monthHighlight = isJan
      ? {
          title: 'Jaipur Literature Festival & International Kite Festival',
          badge: 'January Special',
          description: 'The world’s largest free literary festival at Diggi Palace alongside thousands of colorful kites soaring over the Pink City on Makar Sankranti.',
          whereToExperience: 'Diggi Palace & Old City Rooftops',
          whySpecial: 'Nobel laureates, live Sufi concerts, and high-energy rooftop kite battles.'
        }
      : isMonsoon
      ? {
          title: 'Teej Royal Procession & Sawan Ghewar Feasts',
          badge: 'Monsoon Celebration (July - August)',
          description: 'Goddess Parvati’s golden palanquin carried through Tripoliya Bazaar with royal elephants, camel troops, and traditional Ghewar sweet feasts.',
          whereToExperience: 'City Palace to Tripoliya Gate',
          whySpecial: 'Centuries-old royal Rajasthani heritage celebrating the arrival of rain.'
        }
      : isMarch
      ? {
          title: 'Gangaur Royal Heritage Festival',
          badge: 'Spring Festival (March)',
          description: 'Colorful folk dances, Kalbelia performers, and decorated idol processions across the Pink City.',
          whereToExperience: 'Johari Bazaar & Amer Fort',
          whySpecial: 'Authentic celebration of Rajput culture and craftsmanship.'
        }
      : {
          title: 'Amer Fort Tunnel Trails & Sanganer Block-Print Workshops',
          badge: 'Year-Round Heritage',
          description: 'Explore the secret underground escape tunnels of Amer Fort and print your own scarf with natural indigo wooden stamps.',
          whereToExperience: 'Amer Fort & Sanganer Artisan Village',
          whySpecial: 'Direct hands-on interaction with Chippa handloom artisans.'
        };

    return {
      destination: 'Jaipur',
      origin: originCity || 'Delhi',
      state: 'Rajasthan',
      tagline: 'The Royal Pink City of Palaces, Fortresses & Block-Print Wonders',
      bestMonths: 'October to March (Plus July/August for Monsoon Teej & Ghewar)',
      bgImage: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1200&auto=format&fit=crop&q=80',
      currentMonthHighlight: monthHighlight,
      festivals: [
        {
          name: isJan ? 'Jaipur Literature Festival' : isMonsoon ? 'Teej Royal Procession' : 'Gangaur Festival',
          dates: isJan ? 'Late January' : isMonsoon ? 'August' : 'March',
          description: 'Royal processions, folk music, and vibrant bazaars celebrating Rajasthani heritage.',
          insiderTip: 'Book rooftop cafe seating along Tripoliya Bazaar 2 hours before the procession starts.',
          significance: 'Royal Rajput cultural tradition preserved by the City Palace.'
        }
      ],
      hiddenGems: [
        {
          title: 'Panna Meena Ka Kund Stepwell',
          category: 'Ancient Architecture',
          location: 'Near Amer Fort',
          description: 'A 16th-century criss-cross geometric stepwell where no two steps share the same shadow.',
          bestTimeToVisit: '8:00 AM – 9:30 AM'
        },
        {
          title: 'Sanganer Hand Block Print Workshops',
          category: 'Artisans & Crafts',
          location: 'Sanganer Town (12 km south)',
          description: 'Watch artisan families hand-carve teakwood blocks and stamp natural indigo dyes on cotton.',
          bestTimeToVisit: '10:00 AM – 3:00 PM'
        }
      ],
      seasonalFoods: [
        {
          name: 'Dal Baati Churma with Gatte Ki Sabzi',
          type: 'Royal Heritage Dish',
          famousSpot: 'Laxmi Misthan Bhandar (LMB, Johari Bazaar)',
          priceRange: '₹350 – ₹550',
          description: 'Clay-oven baked dumplings in pure ghee with 5-lentil dal and sweet jaggery churma.'
        },
        {
          name: 'Rawat Pyaaz Ki Kachori & Saffron Ghewar',
          type: 'Street Food Legend',
          famousSpot: 'Rawat Misthan Bhandar',
          priceRange: '₹50 – ₹120',
          description: 'Crispy flaky pastry stuffed with spicy caramelized onions.'
        }
      ],
      budgetStays: [
        {
          name: 'Samode Haveli Courtyard Lodge',
          type: 'Heritage Haveli',
          pricePerNight: 1650,
          rating: 4.9,
          ecoScore: 'A+ (Restored Haveli)',
          amenities: ['Frescoed Ceilings', 'Rajasthani Breakfast', 'Pink City Walking Map']
        }
      ],
      safety: [
        {
          score: 9.3,
          crowdLevel: 'Moderate (Pleasant)',
          emergencyContacts: [
            { service: 'Rajasthan Tourist Police', number: '1364' },
            { service: 'Emergency Control', number: '112' }
          ],
          insiderSafetyTips: [
            'Buy composite tickets online to skip long ticket queues at Amer Fort and Hawa Mahal.'
          ]
        }
      ],
      sustainability: {
        co2SavedKg: 5.5,
        ecoRewardPoints: 110,
        greenRoute: 'Delhi-Jaipur Electric Double Decker / Vande Bharat + Pink City EV Tuk-Tuk',
        recommendedTransit: 'Electric Train + Solar E-Rickshaws',
        localInitiative: 'UNESCO World Heritage sustainable conservation for pink limestone facades.'
      }
    };
  }

  // -------------------------------------------------------------
  // 4. GOA
  // -------------------------------------------------------------
  if (normalized.includes('goa')) {
    const isFeb = month === 2;
    const isMarch = month === 3;
    const isMonsoon = month === 6 || month === 7;

    const monthHighlight = isFeb
      ? {
          title: 'Viva Goa Carnival Street Float Extravaganza',
          badge: 'February Carnival Special',
          description: 'Four days of open-air brass bands, King Momo processions, street dancing, and culinary fiestas in Panaji and Margao.',
          whereToExperience: 'DB Marg Riverside Promenade, Panaji',
          whySpecial: 'Century-old Indo-Portuguese carnival celebrating joy, music, and coastal life.'
        }
      : isMarch
      ? {
          title: 'Shigmo Spring Festival Street Parades',
          badge: 'March Spring Celebration',
          description: 'Traditional Goan Hindu float processions with mythological effigies, Ghode Modni horse dances, and Romat folk music.',
          whereToExperience: 'Ponda Temple Quarters & Panaji',
          whySpecial: 'Authentic indigenous Goan folklore celebration.'
        }
      : isMonsoon
      ? {
          title: 'Sao Joao Water Festival & Secret Jungle Waterfalls',
          badge: 'Monsoon Special (June - July)',
          description: 'Villagers wearing palm-leaf crowns (kopel) leaping into overflowing village wells and secret Western Ghats waterfalls.',
          whereToExperience: 'Siolim & Netravali Wildlife Sanctuary',
          whySpecial: 'Emerald green monsoon season with surging fresh waterfalls.'
        }
      : {
          title: 'Fontainhas Heritage Trails & Organic Spice Plantations',
          badge: 'Sunny Coastal Season',
          description: 'Walk through pastel yellow Portuguese villas in Fontainhas and taste fresh poi bread from 100-year-old wood-fired bakeries.',
          whereToExperience: 'Fontainhas Latin Quarter, Panaji',
          whySpecial: 'Living Latin culture with oyster-shell windows and art cafes.'
        };

    return {
      destination: 'Goa',
      origin: originCity || 'Mumbai',
      state: 'Goa',
      tagline: 'Susegad Coastlines, Portuguese Heritage Quarters & Organic Spice Trails',
      bestMonths: 'November to February (Plus June-July for Sao Joao & Waterfalls)',
      bgImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&auto=format&fit=crop&q=80',
      currentMonthHighlight: monthHighlight,
      festivals: [
        {
          name: isFeb ? 'Goa Viva Carnival' : isMarch ? 'Shigmo Street Festival' : 'Feast of St. Francis Xavier',
          dates: isFeb ? 'February' : isMarch ? 'March' : 'December',
          description: 'Vibrant street parades with marching bands, colorful floats, and seafood fiestas.',
          insiderTip: 'Watch the Panaji float parade from the riverside promenade near DB Marg.',
          significance: 'Century-old Portuguese-Goan cultural tradition celebrating music and joy.'
        }
      ],
      hiddenGems: [
        {
          title: 'Fontainhas Latin Quarter Heritage Walk',
          category: 'Ancient Architecture',
          location: 'Panaji Old City',
          description: '18th-century Portuguese villas painted in pastel yellow and indigo with oyster-shell windows.',
          bestTimeToVisit: '7:30 AM – 9:30 AM'
        },
        {
          title: 'Chorão Island Mangrove Canoe Sanctuary',
          category: 'Village Life',
          location: 'Mandovi River Estuary',
          description: 'Take a free government solar ferry to paddle through dense silent mangrove channels.',
          bestTimeToVisit: '6:30 AM Sunrise canoe tour'
        }
      ],
      seasonalFoods: [
        {
          name: 'Authentic Goan Fish Curry Thali with Poi',
          type: 'Must-Try Specialty',
          famousSpot: 'Ritz Classic (Panaji) / Kokni Kanteen',
          priceRange: '₹220 – ₹380',
          description: 'Fresh Kingfish in coconut, kashmiri chilli and kokum gravy with crusty poi bread.'
        },
        {
          name: 'Traditional Bebinca (7-Layer Indo-Portuguese Cake)',
          type: 'Royal Heritage Dish',
          famousSpot: 'Confeitaria 31 De Janeiro (Fontainhas)',
          priceRange: '₹120 per slice',
          description: 'Slow-baked caramelized multi-layer pudding with coconut milk and nutmeg.'
        }
      ],
      budgetStays: [
        {
          name: 'Olaulim Backwater Eco Sanctuary',
          type: 'Backwater Lodge',
          pricePerNight: 1800,
          rating: 4.9,
          ecoScore: 'A+ (Solar Powered)',
          amenities: ['Kayaks & Canoes', 'Organic Goan Meals', 'River Deck']
        }
      ],
      safety: [
        {
          score: 9.5,
          crowdLevel: 'Moderate (Pleasant)',
          emergencyContacts: [
            { service: 'Goa Coastal Lifeguard (Drishti)', number: '0832-2419400' },
            { service: 'Emergency Response', number: '112' }
          ],
          insiderSafetyTips: [
            'Swim only in designated lifeguard-patrolled safe beach zones.'
          ]
        }
      ],
      sustainability: {
        co2SavedKg: 7.4,
        ecoRewardPoints: 140,
        greenRoute: 'Solar River Ferry + Electric Bicycle Trail along Mandovi',
        recommendedTransit: 'Solar Ferries & Geared Bicycles',
        localInitiative: 'Community-led Olive Ridley Turtle Nesting Protection.'
      }
    };
  }

  // -------------------------------------------------------------
  // DEFAULT / ANY OTHER CITY IN INDIA
  // -------------------------------------------------------------
  const cityName = destination.trim() || 'India Heritage Hub';
  return {
    destination: cityName,
    origin: originCity || 'Delhi',
    state: 'India',
    tagline: `Authentic Cultural Heritage, Sacred Traditions & Local Treasures in ${cityName}`,
    bestMonths: 'October to March (Pleasant weather across most Indian regions)',
    bgImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&auto=format&fit=crop&q=80',
    currentMonthHighlight: {
      title: `${cityName} Seasonal Cultural Festivities & Artisan Trails`,
      badge: 'Month-Matched Highlight',
      description: `Experience authentic local traditions, regional folk music, and master artisan workshops happening in ${cityName} during this season.`,
      whereToExperience: `Old City Quarter & Heritage Bazaars of ${cityName}`,
      whySpecial: `Preserves the living cultural identity, indigenous crafts, and folklore of ${cityName}.`
    },
    festivals: [
      {
        name: `${cityName} Heritage Cultural Utsav`,
        dates: travelDateStr || 'Current Season',
        description: `Traditional folk performances, regional craft exhibitions, and community celebrations unique to ${cityName}.`,
        insiderTip: 'Visit the local municipal heritage complex in early evenings for open-air folk recitals.',
        significance: `Celebrates the history and community traditions of ${cityName}.`
      }
    ],
    hiddenGems: [
      {
        title: `${cityName} Old Town Artisan Quarter`,
        category: 'Artisans & Crafts',
        location: `Old Bazaar Area, ${cityName}`,
        description: 'Local craftsmen producing handmade brassware, pottery, and regional handloom textiles.',
        bestTimeToVisit: '10:00 AM – 2:00 PM'
      },
      {
        title: 'Historic Fort & Panoramic Hilltop Trail',
        category: 'Ancient Architecture',
        location: `Heritage Ridge, ${cityName}`,
        description: 'Ancient stonework viewpoints offering magnificent 360-degree sunset panoramas.',
        bestTimeToVisit: '4:30 PM – 6:00 PM'
      }
    ],
    seasonalFoods: [
      {
        name: `Authentic ${cityName} Royal Thali`,
        type: 'Royal Heritage Dish',
        famousSpot: 'Old Town Heritage Dining Hall',
        priceRange: '₹180 – ₹320',
        description: 'Slow-cooked regional seasonal curries served with freshly baked bread and pure desi ghee.'
      },
      {
        name: 'Famous Regional Street Chaat & Sweet Lassi',
        type: 'Street Food Legend',
        famousSpot: 'Clock Tower Main Square',
        priceRange: '₹40 – ₹70',
        description: 'Spiced crispy savories served with chilled thick clay-pot lassi.'
      }
    ],
    budgetStays: [
      {
        name: `${cityName} Heritage Garden Homestay`,
        type: 'Eco-Homestay',
        pricePerNight: 1250,
        rating: 4.8,
        ecoScore: 'A+ (Solar Powered)',
        amenities: ['Traditional Home Breakfast', 'Free Walking Guide', 'Clean RO Water', 'WiFi']
      }
    ],
    safety: [
      {
        score: 9.3,
        crowdLevel: 'Moderate (Pleasant)',
        emergencyContacts: [
          { service: 'National Emergency', number: '112' },
          { service: 'Tourist Police Helpline', number: '1364' }
        ],
        insiderSafetyTips: [
          'Verify taxi rates or use meter/app-based electric e-rickshaws for intra-city trips.'
        ]
      }
    ],
    sustainability: {
      co2SavedKg: 4.5,
      ecoRewardPoints: 85,
      greenRoute: 'Electric Train Transit + Guided Neighborhood Walking Circuit',
      recommendedTransit: 'Electric Rail + Local E-Rickshaws',
      localInitiative: 'Support for local village artisans under the Digital India Tourism Mission.'
    }
  };
}
