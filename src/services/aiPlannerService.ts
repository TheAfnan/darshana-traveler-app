// src/services/aiPlannerService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getCulturalTripPlan, type CulturalPlan } from "../data/culturalTripData";

// Major City Expansions with Authentic Real-world Data
const EXPANDED_CITY_DATABASE: Record<string, Partial<CulturalPlan>> = {
  'nainital': {
    destination: 'Nainital (Lake District of Kumaon)',
    state: 'Uttarakhand',
    tagline: 'Sacred Emerald Naini Lake, Himalayan Naina Devi Shaktipeeth & Pine Ridge Viewpoints',
    bestMonths: 'March to June & September to January (Pleasant lake breeze, autumn glow & winter snowfall)',
    bgImage: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=1200&auto=format&fit=crop&q=80',
    currentMonthHighlight: {
      title: 'Naini Lake Twilight Yachting & Naina Devi Temple Sacred Aarti',
      badge: 'Kumaon Himalayan Wonder',
      description: 'Sail in traditional wooden rowboats across the emerald crescent-shaped Naini Lake under the reflection of seven surrounding pine peaks (Cheena Peak), followed by evening aarti at the ancient Naina Devi Shaktipeeth.',
      whereToExperience: 'Naini Lake Promenade (Mallital) & Naina Devi Temple Complex',
      whySpecial: 'One of the revered 51 holy Shaktipeeths where Goddess Sati eye (Naina) fell, giving birth to the sacred emerald lake.'
    },
    festivals: [
      {
        name: 'Nanda Devi Mahotsav & Kumaoni Folk Fair',
        dates: 'September / Autumn',
        description: 'Vibrant 7-day fair worshipping Goddess Nanda Devi with Chholiya sword dancers, traditional brass Ransingha horns, and folk theater.',
        insiderTip: 'Visit the temple courtyard during the morning idol decoration for authentic traditional Kumaoni folk chanting.',
        significance: 'State cultural festival celebrating the patron deity and protector of the Kumaon Himalayas.'
      },
      {
        name: 'Nainital Winter Carnival & Lake Festival',
        dates: 'December / January',
        description: 'Heritage yacht races on Naini Lake, photography walks, bird-watching workshops in Pangot, and mountain acoustic concerts.',
        insiderTip: 'Take the cable car to Snow View Point at sunset for clear 360-degree views of Nanda Devi and Trishul peaks.',
        significance: 'Celebrates winter sports, eco-tourism, and mountain artistic culture.'
      }
    ],
    hiddenGems: [
      {
        title: 'Tiffin Top (Dorothy Seat 2292m Panoramic Trail)',
        category: 'Secret Trails',
        location: 'Ayarpatta Hill (4 km from Mallital)',
        description: 'Stonework memorial viewpoint perched on Ayarpatta peak offering sweeping vistas of the Himalayas and Nainital town.',
        bestTimeToVisit: '6:30 AM – 9:30 AM (Crisp mountain sunrise)'
      },
      {
        title: 'Pangot & Kilbury Himalayan Bird Sanctuary',
        category: 'Secret Trails',
        location: 'Kilbury Pine Reserve (15 km above town)',
        description: 'Dense oak, pine, and rhododendron reserve shelter to over 580 Himalayan bird species including Lammergeiers and Cheer Pheasants.',
        bestTimeToVisit: '7:00 AM – 11:00 AM'
      },
      {
        title: 'Gurney House (Jim Corbett Living Heritage Villa)',
        category: 'Ancient Architecture',
        location: 'Ayarpatta Slopes, Nainital',
        description: 'Historic cottage preserving hunter-conservationist Jim Corbett personal furniture, books, and antique trophies.',
        bestTimeToVisit: '11:00 AM – 3:00 PM'
      }
    ],
    seasonalFoods: [
      {
        name: 'Kumaoni Bal Mithai & Singori in Malu Leaf',
        type: 'Must-Try Specialty',
        famousSpot: 'Mamu Bal Mithai (Mallital) & Khairna Sweet Junction',
        priceRange: '₹100 – ₹220',
        description: 'Slow-roasted brown milk fudge (khoa) coated with sugar beads, and Singori cones wrapped in fragrant wild Malu leaves.'
      },
      {
        name: 'Aloo Ke Gutke with Bhang Jeera Chutney & Steamed Momos',
        type: 'Street Food Legend',
        famousSpot: 'Tibetan Market Food Alley (Mallital) & Sonam Fast Food',
        priceRange: '₹60 – ₹130',
        description: 'Boiled mountain potatoes tossed in Himalayan jumboo herb, served with pungent roasted hemp seed chutney.'
      }
    ],
    budgetStays: [
      {
        name: 'Nainital Heritage Pine Lodge Homestay',
        type: 'Eco-Homestay',
        pricePerNight: 1450,
        rating: 4.9,
        ecoScore: 'A+ (Zero Plastic & Rainwater Harvesting)',
        amenities: ['Lake View Balcony', 'Traditional Kumaoni Breakfast', 'Guided Pine Trek', 'WiFi']
      }
    ],
    sustainability: {
      co2SavedKg: 6.4,
      ecoRewardPoints: 120,
      greenRoute: 'Kathgodam Shatabdi Express Rail (Delhi/Lucknow to Kathgodam) + Electric Hill Shuttle',
      recommendedTransit: 'Electric Rail to Kathgodam + Shared E-Cab',
      localInitiative: 'Clean Naini Lake and Himalayan Ridge Afforestation Project.'
    }
  },
  'agra': {
    destination: 'Agra',
    state: 'Uttar Pradesh',
    tagline: 'Imperial Mughal Capital, World Wonder Taj Mahal & Pietra Dura Stone Inlay Crafts',
    bestMonths: 'October to March (Crisp winter sunshine and Taj Mahotsav)',
    bgImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&auto=format&fit=crop&q=80',
    currentMonthHighlight: {
      title: 'Taj Mahotsav Artisan Carnival & Mehtab Bagh Sunset Glow',
      badge: 'UNESCO World Heritage Crown',
      description: 'Witness the iconic ivory-white marble Taj Mahal reflected in the Yamuna River during sunset from Mehtab Bagh, followed by 400+ master craftsmen performances at Shilpgram.',
      whereToExperience: 'Taj Mahal Complex, Mehtab Bagh & Shilpgram Agra',
      whySpecial: 'Undisputed architectural wonder of the world symbolizing eternal Mughal craftsmanship.'
    },
    festivals: [
      {
        name: 'Taj Mahotsav (10-Day Cultural Fair)',
        dates: 'February / March',
        description: 'Grand cultural carnival at Shilpgram near the Eastern Gate of Taj Mahal featuring classical musicians, Ghazal baithaks, and artisan stalls from across India.',
        insiderTip: 'Visit the craft village after 4:00 PM for folk puppet shows and live brass stone-inlay demonstrations.',
        significance: 'Celebrates India rich handloom and classical arts against the backdrop of Mughal heritage.'
      }
    ],
    hiddenGems: [
      {
        title: 'Pachhikari (Pietra Dura) Marble Inlay Ateliers',
        category: 'Artisans & Crafts',
        location: 'Gokulpura & Taj Ganj Artisan Lanes',
        description: 'Generations of master craftsmen cutting semiprecious stones (lapis lazuli, malachite) into fine floral marble inlays.',
        bestTimeToVisit: '10:30 AM – 2:30 PM'
      },
      {
        title: 'Chini Ka Rauza & Tomb of I\'timad-ud-Daulah (Baby Taj)',
        category: 'Ancient Architecture',
        location: 'Eastern Yamuna Riverbank, Agra',
        description: 'Glazed porcelain tile tomb and delicate marble jali screens predating the Taj Mahal.',
        bestTimeToVisit: '3:30 PM – 5:30 PM'
      }
    ],
    seasonalFoods: [
      {
        name: 'Original Agra Petha (Angoori, Kesar & Paan Petha)',
        type: 'Must-Try Specialty',
        famousSpot: 'Panchi Petha (Noori Gate Est. 1950)',
        priceRange: '₹80 – ₹180',
        description: 'Translucent soft candy made of candied ash gourd infused with saffron, kewra, and rose water.'
      },
      {
        name: 'Bedmi Puri with Spiced Aloo Sabzi & Jalebi',
        type: 'Street Food Legend',
        famousSpot: 'Deviram Sweets (Pratappura) & Seth Gali',
        priceRange: '₹50 – ₹90',
        description: 'Crispy urad dal stuffed wheat puris served with fiery fenugreek-spiced potato gravy.'
      }
    ],
    budgetStays: [
      {
        name: 'Agra Heritage Taj Haveli Homestay',
        type: 'Heritage Haveli',
        pricePerNight: 1250,
        rating: 4.8,
        ecoScore: 'A+ (Solar Powered)',
        amenities: ['Taj View Rooftop Terrace', 'Homemade Mughlai Breakfast', 'WiFi', 'RO Water']
      }
    ],
    sustainability: {
      co2SavedKg: 5.2,
      ecoRewardPoints: 100,
      greenRoute: 'Gatimaan / Vande Bharat Express (Delhi to Agra Cantt in 99 mins) + Electric Auto',
      recommendedTransit: 'Direct Electric Express Rail + CNG/Electric Autos',
      localInitiative: 'Taj Trapezium Zone Clean Air and Green Yamuna Mission.'
    }
  },
  'noida': {
    destination: 'Noida (Gautam Buddha Nagar)',
    state: 'Uttar Pradesh',
    tagline: 'Modern NCR Gateway, Yamuna Ecological Sanctuaries & UP Mastercraft Haats',
    bestMonths: 'October to March (Pleasant weather, migratory birds & cultural melas)',
    bgImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&auto=format&fit=crop&q=80',
    currentMonthHighlight: {
      title: 'Noida Shilp Utsav & Okhla Bird Sanctuary Eco-Circuit',
      badge: 'Living Craft & Nature Odyssey',
      description: 'Explore over 300+ master craftsmen showcasing brassware, terracotta, and handloom silks at Noida Haat, followed by sunrise migratory bird watching along Yamuna riverbanks.',
      whereToExperience: 'Noida Haat (Sector 33) & Okhla Bird Sanctuary (Sector 95)',
      whySpecial: 'Blends UP rich rural artisan heritage with contemporary urban green corridors and ecological conservation.'
    },
    festivals: [
      {
        name: 'Noida National Craft Mela & Shilpotsav',
        dates: 'November / February-March',
        description: 'Pan-Indian artisan assembly featuring folk dancers, terracotta potters from Gorakhpur, and live Awadhi musical evenings.',
        insiderTip: 'Visit in the early evening for live open-air Ghazal baithaks and authentic clay-tandoor stalls.',
        significance: 'Celebrates UP State handicraft preservation and direct artisan-to-consumer trade.'
      },
      {
        name: 'Chhath Puja on Yamuna & Hindon Riverfronts',
        dates: 'October / November',
        description: 'Vibrant sunrise and sunset riverfront prayers offering Arghya to Sun God amidst thousands of devotional earthen lamps.',
        insiderTip: 'Visit Kalindi Kunj Ghat at dawn for peaceful devotional hymns and sacred thekua offerings.',
        significance: 'Ancient Vedic festival expressing gratitude to the Sun and nature.'
      }
    ],
    hiddenGems: [
      {
        title: 'Okhla Bird Sanctuary Protected Wetland Trail',
        category: 'Secret Trails',
        location: 'Sector 95 on Yamuna River Canal, Noida',
        description: 'Serene 4 sq km wetland hosting over 300 species of migratory flamingos, pelicans, and Siberian waterfowl.',
        bestTimeToVisit: '6:30 AM – 9:30 AM (Best morning light)'
      },
      {
        title: 'Rashtriya Dalit Prerna Sthal & Stupa Monument',
        category: 'Ancient Architecture',
        location: 'Sector 95, Noida Expressway',
        description: 'Sprawling 84-acre architectural memorial park carved from rare Mirzapur pink sandstone with colossal stone stupas.',
        bestTimeToVisit: '4:30 PM – 6:30 PM'
      },
      {
        title: 'Stupa 18 Contemporary Studio & Ceramic Haat',
        category: 'Artisans & Crafts',
        location: 'Sector 104, Boutique Artisan Alley',
        description: 'Hands-on pottery workshops, studio ceramics, and local tribal handmade jewelry exhibits.',
        bestTimeToVisit: '11:00 AM – 3:00 PM'
      }
    ],
    seasonalFoods: [
      {
        name: 'Sector 29 Brahmaputra Market Street Food Trail',
        type: 'Street Food Legend',
        famousSpot: 'BP Market (Sector 29) & Chanda Food Hub',
        priceRange: '₹80 – ₹200',
        description: 'Famous charcoal-grilled Galouti kebabs, Kathi rolls, spicy momos, and hot saffron kulhad milk.'
      },
      {
        name: 'Amritsari Chur Chur Naan with Shahi Dal Makhani',
        type: 'Must-Try Specialty',
        famousSpot: 'Sector 18 Market & Atta Food Lane',
        priceRange: '₹120 – ₹220',
        description: 'Flaky crushed tandoori naan dripping with desi butter served with slow-simmered black lentils.'
      }
    ],
    budgetStays: [
      {
        name: 'Noida Green City Homestay & Villa',
        type: 'Eco-Homestay',
        pricePerNight: 1350,
        rating: 4.8,
        ecoScore: 'A+ (Solar Powered & Rainwater Harvesting)',
        amenities: ['Home-Cooked North Indian Breakfast', 'Metro Connectivity (Aqua Line)', 'High-Speed WiFi', 'RO Water']
      }
    ],
    sustainability: {
      co2SavedKg: 5.6,
      ecoRewardPoints: 110,
      greenRoute: 'Tejas/Shatabdi Express Rail (Lucknow to Anand Vihar) + Noida Aqua Line Metro Transit',
      recommendedTransit: 'Direct Electric Express Rail + Aqua/Blue Line Metro',
      localInitiative: 'Yamuna Floodplain Eco-Restoration and Clean Riverfront Community Project.'
    }
  },
  'amritsar': {
    destination: 'Amritsar',
    state: 'Punjab',
    tagline: 'The Spiritual Golden City of Devotion, Langar & Living Heritage',
    bestMonths: 'October to March (Pleasant golden sunshine and festive spirit)',
    bgImage: 'https://images.unsplash.com/photo-1595846519845-68e298c2edd8?w=1200&auto=format&fit=crop&q=80',
    currentMonthHighlight: {
      title: 'Sacred Prakash Parv & Golden Temple Divine Illumination',
      badge: 'Divine Spiritual Highlight',
      description: 'Experience the 24/7 world largest community kitchen (Guru Ka Langar serving 100,000+ meals daily) and morning Palki Sahib ceremony around the Amrit Sarovar.',
      whereToExperience: 'Harmandir Sahib (Golden Temple) & Heritage Walk Alleyways',
      whySpecial: 'Core spiritual heartbeat of Sikh culture, selfless service (Seva), and sacred musical Gurbani.'
    },
    festivals: [
      {
        name: 'Baisakhi & Guru Ram Das Jayanti',
        dates: 'April / October-November',
        description: 'Vibrant harvest and devotional processions (Nagar Kirtan) with Gatka martial art demonstrations and sacred illumination.',
        insiderTip: 'Volunteer in the langar roti-making hall for a truly grounding spiritual experience.',
        significance: 'Celebrates foundational Sikh brotherhood and the founding of the sacred city.'
      }
    ],
    hiddenGems: [
      {
        title: 'Partition Museum & Town Hall Archive',
        category: 'Ancient Architecture',
        location: 'Heritage Street, Town Hall, Amritsar',
        description: 'World first museum dedicated to the 1947 partition, preserving real oral history recordings, letters, and artifacts.',
        bestTimeToVisit: '10:30 AM – 1:30 PM'
      },
      {
        title: 'Pul Kanjri Historic Caravanserai',
        category: 'Secret Trails',
        location: 'Near Indo-Pak Border (34 km from city)',
        description: 'Maharaja Ranjit Singh historic fortress and summer pavilion featuring ancient fresco artwork and stepwell tank.',
        bestTimeToVisit: '3:00 PM – 5:30 PM'
      }
    ],
    seasonalFoods: [
      {
        name: 'Amritsari Stuffed Aloo-Pyaz Kulcha with Chole',
        type: 'Must-Try Specialty',
        famousSpot: 'Kulcha Land (Ranjit Avenue) & Bhai Kulwant Singh',
        priceRange: '₹90 – ₹160',
        description: 'Tandoor-crisped multi-layered bread loaded with homemade white butter and tangy tamarind chutney.'
      },
      {
        name: 'Peda Lassi & Hot Jalebi in Desi Ghee',
        type: 'Street Food Legend',
        famousSpot: 'Ahuja Milk Center & Gurdas Ram Jalebiwala',
        priceRange: '₹50 – ₹90',
        description: 'Thick, creamy slow-churned sweet lassi topped with saffron malai and malai peda.'
      }
    ],
    budgetStays: [
      {
        name: 'Amritsar Heritage Haveli Homestay',
        type: 'Heritage Haveli',
        pricePerNight: 1350,
        rating: 4.9,
        ecoScore: 'A+ (Solar Water & Organic Langar Milk)',
        amenities: ['Traditional Punjabi Breakfast', 'Walking Guide to Golden Temple', 'Clean RO Water', 'WiFi']
      }
    ]
  },
  'rishikesh': {
    destination: 'Rishikesh',
    state: 'Uttarakhand',
    tagline: 'Yoga Capital of the World on the Emerald Himalayan Ganges',
    bestMonths: 'September to April (Crisp mountain breeze & crystal clear river)',
    bgImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&auto=format&fit=crop&q=80',
    currentMonthHighlight: {
      title: 'Triveni Ghat Maha Aarti & Sunrise Yoga by the Himalayan River',
      badge: 'Spiritual & Wellness Odyssey',
      description: 'Chanting of Vedic hymns with giant brass lamp aartis on the bank of Holy Ganga surrounded by mist-covered Shivalik hills.',
      whereToExperience: 'Triveni Ghat & Parmarth Niketan Ashram, Swarg Ashram',
      whySpecial: 'Ancient meditation grounds of yogis and sages for over 5,000 years.'
    },
    festivals: [
      {
        name: 'International Yoga Festival & Ganga Dussehra',
        dates: 'March / May-June',
        description: 'Global yogis, meditation masters, and classical sound healers assemble for riverfront masterclasses and spiritual discourses.',
        insiderTip: 'Reach Parmarth Niketan at 5:00 PM for the front-row river steps during sunset aarti.',
        significance: 'Celebrates inner wellness and the descent of holy river Ganga.'
      }
    ],
    hiddenGems: [
      {
        title: 'Beatles Ashram (Chaurasi Kutia)',
        category: 'Artisans & Crafts',
        location: 'Rajaji Tiger Reserve boundary, Swargashram',
        description: 'Abandoned 1960s Transcendental Meditation dome huts covered with psychedelic graffiti and forest birdlife.',
        bestTimeToVisit: '9:00 AM – 1:00 PM'
      },
      {
        title: 'Neer Garh Natural Forest Waterfall Trail',
        category: 'Secret Trails',
        location: '6 km above Laxman Jhula on Badrinath Highway',
        description: 'Two-tier jade-blue limestone waterfall cascading through terraced butterfly groves.',
        bestTimeToVisit: '7:30 AM – 10:30 AM'
      }
    ],
    seasonalFoods: [
      {
        name: 'Traditional Garhwali Thali & Koda Roti',
        type: 'Must-Try Specialty',
        famousSpot: 'Chotiwala (Original Swarg Ashram 1958)',
        priceRange: '₹140 – ₹260',
        description: 'Finger-millet bread served with Gahat ki Dal, Jhangora kheer, and wild mountain herbs.'
      },
      {
        name: 'Ayurvedic Herbal Chai & Fresh Apple Crumble',
        type: 'Street Food Legend',
        famousSpot: 'Beatles Cafe & Little Buddha Tapovan',
        priceRange: '₹80 – ₹180',
        description: 'Fresh ginger-tulsi organic brew with Himalayan honey and cinnamon pastry.'
      }
    ],
    budgetStays: [
      {
        name: 'Ganga Eco Riverfront Homestay',
        type: 'Eco-Homestay',
        pricePerNight: 950,
        rating: 4.8,
        ecoScore: 'A+ (Zero Single-Use Plastic)',
        amenities: ['Morning Riverfront Yoga Session', 'Pure Satvik Organic Meals', 'River View Balcony']
      }
    ]
  },
  'shimla': {
    destination: 'Shimla',
    state: 'Himachal Pradesh',
    tagline: 'Queen of the Hills with British Neo-Gothic Heritage & Pine Ridges',
    bestMonths: 'October to June (Snow in winter, crisp cedar breeze in summer)',
    bgImage: 'https://images.unsplash.com/photo-1568849676085-51415703900f?w=1200&auto=format&fit=crop&q=80',
    currentMonthHighlight: {
      title: 'Pine Forest Heritage Walk & Kalka-Shimla UNESCO Toy Train',
      badge: 'Mountain Living Heritage',
      description: 'Narrow-gauge steam/diesel train ride crossing 102 tunnels and 864 arched stone bridges through deodar forests.',
      whereToExperience: 'The Ridge, Mall Road & Viceregal Lodge Observatory Hill',
      whySpecial: 'Authentic 19th-century hill architecture nestled under the towering Dhauladhar ranges.'
    },
    festivals: [
      {
        name: 'Shimla Summer Festival & Winter Carnival',
        dates: 'May-June / December-January',
        description: 'Himachali folk Nati dances, handicraft stalls, apple wine tasting, and live mountain music on The Ridge.',
        insiderTip: 'Take the morning heritage walk starting from Christ Church to Viceregal Lodge.',
        significance: 'Celebrates rich indigenous Himachali mountain folklore and seasonal harvest.'
      }
    ],
    hiddenGems: [
      {
        title: 'Annandale Heritage & Military Aviation Trail',
        category: 'Secret Trails',
        location: 'Annandale Valley (3 km below Ridge)',
        description: 'Lush green golf meadow surrounded by 150-year-old cedar trees and British army aviation archives.',
        bestTimeToVisit: '10:00 AM – 3:00 PM'
      },
      {
        title: 'Chadwick Cedar Forest Waterfall',
        category: 'Secret Trails',
        location: 'Summer Hill pine reserve',
        description: 'Secluded 100-meter waterfall hidden deep inside fragrant pine trails.',
        bestTimeToVisit: '8:30 AM – 11:30 AM'
      }
    ],
    seasonalFoods: [
      {
        name: 'Himachali Siddu with Desi Ghee & Walnut Chutney',
        type: 'Must-Try Specialty',
        famousSpot: 'Himachali Rasoi (Mall Road)',
        priceRange: '₹120 – ₹200',
        description: 'Steamed wheat dough pocket stuffed with spiced poppy seeds and walnuts, drenched in mountain cow ghee.'
      },
      {
        name: 'Chha Gosht / Madra & Kurkure Jalebi',
        type: 'Royal Heritage Dish',
        famousSpot: 'Baljee & Krishna Bakery The Mall',
        priceRange: '₹60 – ₹120',
        description: 'Slow-cooked spiced yogurt curry and famous hot steamed butter buns.'
      }
    ],
    budgetStays: [
      {
        name: 'Cedar Valley Heritage Cottage Homestay',
        type: 'Heritage Haveli',
        pricePerNight: 1450,
        rating: 4.8,
        ecoScore: 'A+ (Rainwater Harvesting)',
        amenities: ['Pine Valley View', 'Organic Farm Breakfast', 'Fireplace Room']
      }
    ]
  },
  'mysore': {
    destination: 'Mysore (Mysuru)',
    state: 'Karnataka',
    tagline: 'City of Palaces, Royal Silk, Sandalwood & Grand Dasara',
    bestMonths: 'September to March (Pleasant royal weather & illuminated palaces)',
    bgImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&auto=format&fit=crop&q=80',
    currentMonthHighlight: {
      title: 'Grand Mysore Palace 100,000 Golden Bulb Illumination',
      badge: 'Royal Heritage Wonder',
      description: 'The iconic Indo-Saracenic royal palace lit by 100,000 incandescent lamps every Sunday and during festive dusk.',
      whereToExperience: 'Mysore Palace Durbar Courtyard & Devaraja Market',
      whySpecial: '600-year living legacy of the Wadiyar dynasty celebrating royal patronage of classical arts.'
    },
    festivals: [
      {
        name: 'Mysuru Dasara (Nada Habba)',
        dates: 'September / October',
        description: 'Grand royal elephant procession (Jumboo Savari) carrying the Golden Howdah of Goddess Chamundeshwari through decorated streets.',
        insiderTip: 'Book palace exhibition tickets in advance for the torchlight parade at Bannimantap.',
        significance: 'State festival of Karnataka celebrating victory of good over evil.'
      }
    ],
    hiddenGems: [
      {
        title: 'Devaraja 130-Year Heritage Spice & Flower Market',
        category: 'Artisans & Crafts',
        location: 'Sayyaji Rao Road, Central Mysore',
        description: 'Heritage market with rows of hand-carved sandalwood sculptures, incense cones, and mounds of fragrant jasmine garlands.',
        bestTimeToVisit: '8:00 AM – 11:00 AM'
      },
      {
        title: 'Somnathpur Prasanna Chennakesava Hoysala Temple',
        category: 'Ancient Architecture',
        location: 'Somnathpura (35 km from city)',
        description: '13th-century soapstone star-shaped temple carved with thousands of microscopic mythological stone reliefs.',
        bestTimeToVisit: '9:30 AM – 1:30 PM'
      }
    ],
    seasonalFoods: [
      {
        name: 'Original Ghee Mysore Pak (Invented in Royal Kitchen)',
        type: 'Royal Heritage Dish',
        famousSpot: 'Guru Sweets (Founded by royal chef Kakasura Madappa)',
        priceRange: '₹80 – ₹180',
        description: 'Melts-on-tongue sweet made of roasted gram flour, cardamom, and abundant pure melted ghee.'
      },
      {
        name: 'Mysore Masala Dosa with Red Garlic Chutney & Filter Coffee',
        type: 'Street Food Legend',
        famousSpot: 'Mylari Dosa (Nazarbad 1938)',
        priceRange: '₹50 – ₹90',
        description: 'Crispy exterior and pillowy cloud-soft interior smeared with signature spiced red paste and white butter.'
      }
    ],
    budgetStays: [
      {
        name: 'Chamundi Heritage Villa Homestay',
        type: 'Heritage Haveli',
        pricePerNight: 1200,
        rating: 4.8,
        ecoScore: 'A+ (Solar Powered)',
        amenities: ['South Indian Filter Coffee Breakfast', 'Heritage Garden Walk', 'WiFi']
      }
    ]
  }
};

/**
 * Intelligent Dynamic Cultural Trip Generator (Gemini AI + Curated Graph)
 */
export async function getDynamicCulturalPlan(
  destination: string,
  travelDateStr: string,
  originCity: string = 'Delhi'
): Promise<CulturalPlan> {
  const norm = destination.trim().toLowerCase();

  // 1. Check expanded curated knowledge database first
  for (const key of Object.keys(EXPANDED_CITY_DATABASE)) {
    if (norm.includes(key) || key.includes(norm)) {
      const base = getCulturalTripPlan(destination, travelDateStr, originCity);
      const custom = EXPANDED_CITY_DATABASE[key];
      return {
        ...base,
        ...custom,
        origin: originCity,
        destination: custom.destination || destination
      } as CulturalPlan;
    }
  }

  // 2. Try Gemini 1.5 Flash for ANY custom Indian city if API key is present
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (geminiKey && geminiKey.length > 10) {
    try {
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `You are the chief cultural historian for Ministry of Tourism "Incredible India".
Generate a structured JSON travel plan for a traveler visiting "${destination}" from "${originCity}" during "${travelDateStr}".
Respond ONLY with a valid JSON object strictly adhering to this schema:
{
  "destination": "${destination}",
  "state": "State of India",
  "tagline": "A poetic, authentic cultural tagline",
  "bestMonths": "Best season months",
  "bgImage": "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&auto=format&fit=crop&q=80",
  "currentMonthHighlight": {
    "title": "Specific authentic event or tradition happening around ${travelDateStr}",
    "badge": "Month-Matched Highlight",
    "description": "Authentic 2-sentence description of what's happening",
    "whereToExperience": "Exact location in ${destination}",
    "whySpecial": "Historical/cultural reason"
  },
  "festivals": [
    {
      "name": "Authentic regional festival name",
      "dates": "Season/Month",
      "description": "2-sentence celebration details",
      "insiderTip": "Local insider tip",
      "significance": "Cultural meaning"
    }
  ],
  "hiddenGems": [
    {
      "title": "Secret heritage site or artisan workshop",
      "category": "Artisans & Crafts",
      "location": "Local landmark in ${destination}",
      "description": "Why tourists must explore it",
      "bestTimeToVisit": "Time of day"
    }
  ],
  "seasonalFoods": [
    {
      "name": "Iconic authentic local dish",
      "type": "Must-Try Specialty",
      "famousSpot": "Real famous eatery/street lane in ${destination}",
      "priceRange": "₹80 – ₹200",
      "description": "Taste and ingredients description"
    }
  ],
  "budgetStays": [
    {
      "name": "${destination} Heritage Homestay",
      "type": "Heritage Haveli",
      "pricePerNight": 1250,
      "rating": 4.8,
      "ecoScore": "A+ (Eco-Certified)",
      "amenities": ["Traditional Breakfast", "Local Guide", "WiFi"]
    }
  ]
}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      const base = getCulturalTripPlan(destination, travelDateStr, originCity);
      return {
        ...base,
        ...parsed,
        destination: destination,
        origin: originCity
      };
    } catch (e) {
      console.warn("Gemini dynamic generation fallback to curated graph:", e);
    }
  }

  // 3. Fallback to standard cultural trip graph
  return getCulturalTripPlan(destination, travelDateStr, originCity);
}
