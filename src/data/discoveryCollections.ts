export interface DiscoveryItem {
  id?: number | string;
  name: string;
  type?: string;
  aspect?: string;
  era?: string;
  month?: string;
  location?: string;
  desc?: string;
  description?: string;
  img?: string;
  lat?: number;
  lng?: number;
}

export const festivalsData: DiscoveryItem[] = [
  {
    id: 1,
    name: "Diwali (दीपावली)",
    type: "Religious (Hindu, Sikh, Jain)",
    month: "October/November",
    location: "Pan-India",
    desc: "The festival of lights, celebrating the victory of light over darkness and good over evil. Associated with Goddess Lakshmi and Lord Rama's return.",
    img: "https://images.pexels.com/photos/1580085/pexels-photo-1580085.jpeg",
    lat: 20.5937,
    lng: 78.9629
  },
  {
    id: 2,
    name: "Holi (होली)",
    type: "Cultural/Religious (Hindu)",
    month: "March",
    location: "Pan-India, especially North India",
    desc: "The festival of colors, signifying the arrival of spring and the triumph of good over evil (Holika Dahan). People play with dry and wet colors.",
    img: "https://images.pexels.com/photos/15856547/pexels-photo-15856547.jpeg",
    lat: 28.6139,
    lng: 77.209
  },
  {
    id: 3,
    name: "Durga Puja (दुर्गा पूजा)",
    type: "Religious (Hindu)",
    month: "September/October",
    location: "Kolkata, West Bengal",
    desc: "Celebration of Goddess Durga's victory over the buffalo demon Mahishasura. Marked by grand Pandal installations and idol immersion.",
    img: "https://images.pexels.com/photos/7750148/pexels-photo-7750148.jpeg",
    lat: 22.5726,
    lng: 88.3639
  },
  {
    id: 4,
    name: "Pushkar Camel Fair (पुष्कर मेला)",
    type: "Cultural/Livestock",
    month: "November",
    location: "Pushkar, Rajasthan",
    desc: "A vibrant five-day livestock fair featuring camel trading, cultural performances, music, and competitions near the Pushkar Lake.",
    img: "https://images.pexels.com/photos/1707965/pexels-photo-1707965.jpeg",
    lat: 26.4907,
    lng: 74.5539
  },
  {
    id: 5,
    name: "Onam (ओणम)",
    type: "Cultural/Harvest (Hindu)",
    month: "August/September",
    location: "Kerala",
    desc: "Harvest festival marked by elaborate flower carpets (Pookalam), the grand Onam Sadhya feast, and spectacular snake boat races (Vallamkali).",
    img: "https://t4.ftcdn.net/jpg/16/53/15/17/240_F_1653151764_e1jXwVTun9tDX7T86V3mUkSsocNrfF9f.jpg",
    lat: 10.8505,
    lng: 76.2711
  },
  {
    id: 6,
    name: "Ganesh Chaturthi (गणेश चतुर्थी)",
    type: "Religious (Hindu)",
    month: "August/September",
    location: "Mumbai, Maharashtra, Karnataka",
    desc: "A 10-day celebration of the birth of Lord Ganesha, marked by the installation of large idols and a final grand immersion ceremony (Visarjan).",
    img: "https://images.pexels.com/photos/2939023/pexels-photo-2939023.jpeg",
    lat: 19.076,
    lng: 72.8777
  },
  {
    id: 7,
    name: "Eid al-Fitr (ईद उल-फित्र)",
    type: "Religious (Islam)",
    month: "Variable (Lunar)",
    location: "Pan-India",
    desc: "The 'Festival of Breaking the Fast' marks the end of Ramadan. Celebrated with congregational prayers, feasting, and the giving of charity (Zakat al-Fitr).",
    img: "https://images.pexels.com/photos/12049052/pexels-photo-12049052.jpeg",
    lat: 28.7041,
    lng: 77.1025
  },
  {
    id: 8,
    name: "Christmas",
    type: "Religious (Christian)",
    month: "December",
    location: "Goa, Mumbai, Northeast India",
    desc: "Celebration of the birth of Jesus Christ. Marked by midnight mass, carol singing, decorated Christmas trees, and gift-giving.",
    img: "https://images.pexels.com/photos/3149896/pexels-photo-3149896.jpeg",
    lat: 15.2993,
    lng: 74.124
  },
  {
    id: 9,
    name: "Gurupurab (गुरुपर्व)",
    type: "Religious (Sikh)",
    month: "October/November",
    location: "Punjab, Pan-India",
    desc: "Celebration of the birth of the Sikh Gurus. Marked by processions (Nagar Kirtan) and reading of the Guru Granth Sahib.",
    img: "https://www.goldentempleamritsar.org/high-resolution-images/famous-temples/golden-temple/Gurpurab.jpg",
    lat: 30.7333,
    lng: 76.7794
  },
  {
    id: 10,
    name: "Pongal (पोंगल)",
    type: "Harvest (Hindu)",
    month: "January",
    location: "Tamil Nadu",
    desc: "A four-day harvest festival dedicated to the Sun God (Surya). The second day is the main day, where rice is boiled until it spills over.",
    img: "https://images.pexels.com/photos/28820191/pexels-photo-28820191.jpeg",
    lat: 13.0827,
    lng: 80.2707
  },
  {
    id: 11,
    name: "Navratri (नवरात्रि)",
    type: "Religious (Hindu)",
    month: "September/October",
    location: "Gujarat, Maharashtra",
    desc: "A nine-night festival worshipping Goddess Durga. Famous for the traditional folk dances Garba and Dandiya Raas, especially in Gujarat.",
    img: "https://images.pexels.com/photos/9930818/pexels-photo-9930818.jpeg",
    lat: 23.0225,
    lng: 72.5714
  },
  {
    id: 12,
    name: "Kumbh Mela (कुंभ मेला)",
    type: "Religious (Hindu)",
    month: "Variable (Cycle)",
    location: "Allahabad, Haridwar, Ujjain, Nashik",
    desc: "One of the largest peaceful gatherings in the world, held once every three years on a rotating basis at four river-bank pilgrimage sites.",
    img: "https://images.pexels.com/photos/30218192/pexels-photo-30218192.jpeg",
    lat: 25.4358,
    lng: 81.8463
  },
  {
    id: 13,
    name: "Rath Yatra (रथ यात्रा)",
    type: "Religious (Hindu)",
    month: "June/July",
    location: "Puri, Odisha",
    desc: "The annual chariot festival of Lord Jagannath, his brother Balabhadra, and sister Subhadra. The deities are carried in massive, decorated chariots.",
    img: "https://images.pexels.com/photos/27170152/pexels-photo-27170152.jpeg",
    lat: 19.8142,
    lng: 85.831
  },
  {
    id: 14,
    name: "Hornbill Festival",
    type: "Cultural (Tribal)",
    month: "December",
    location: "Nagaland",
    desc: "A week-long annual festival showcasing the rich cultural heritage and traditions of the 16 Naga tribes with folk dances, sports, and crafts.",
    img: "https://images.pexels.com/photos/32656681/pexels-photo-32656681.jpeg",
    lat: 26.1824,
    lng: 94.5714
  },
  {
    id: 15,
    name: "Eid al-Adha (बकरी ईद)",
    type: "Religious (Islam)",
    month: "Variable (Lunar)",
    location: "Pan-India",
    desc: "The 'Festival of Sacrifice,' honoring Prophet Ibrahim's willingness to sacrifice his son. It involves animal sacrifice and distribution of meat.",
    img: "https://images.pexels.com/photos/34123513/pexels-photo-34123513.jpeg",
    lat: 24.5,
    lng: 79.0
  },
  {
    id: 16,
    name: "Ugadi (उगादी)",
    type: "New Year (Hindu)",
    month: "March/April",
    location: "Andhra Pradesh, Telangana, Karnataka",
    desc: "Telugu and Kannada New Year, celebrated with special dishes symbolizing different tastes of life and community rituals.",
    img: "https://data1.ibtimes.co.in/en/full/640477/ugadi-festival.jpg?h=450&l=50&t=40",
    lat: 17.385,
    lng: 78.4867
  },
  {
    id: 17,
    name: "Vishu (विशु)",
    type: "New Year (Hindu)",
    month: "April",
    location: "Kerala",
    desc: "Kerala New Year with Vishukkani (first sight), fireworks, feasts, and giving Vishukkaineetam (token gifts).",
    img: "https://pin.it/6cq4UDSjV",
    lat: 10.8505,
    lng: 76.2711
  },
  {
    id: 18,
    name: "Thaipusam",
    type: "Religious (Hindu)",
    month: "January/February",
    location: "Tamil Nadu",
    desc: "Devotion to Lord Murugan with kavadi processions and acts of penance including body piercings.",
    img: "https://pin.it/CYpQXlsPl",
    lat: 11.1271,
    lng: 78.6569
  },
  {
    id: 19,
    name: "Makara Sankranti",
    type: "Harvest (Hindu)",
    month: "January",
    location: "Karnataka, Andhra Pradesh",
    desc: "Harvest festival marking the sun's northward journey; kite flying, sesame sweets, and sharing ellu-bella.",
    img: "https://pin.it/5X9OCoaUk",
    lat: 15.3173,
    lng: 75.7139
  },
  {
    id: 20,
    name: "Navratri (South India)",
    type: "Religious (Hindu)",
    month: "September/October",
    location: "Tamil Nadu, Karnataka",
    desc: "Nine nights of worship for Goddess Durga; marked by Golu doll displays and vibrant community celebrations.",
    img: "https://pin.it/22fqk5O25",
    lat: 23.0225,
    lng: 72.5714
  },
  {
    id: 21,
    name: "Karaga Festival",
    type: "Cultural (Folk)",
    month: "April/May",
    location: "Bangalore, Karnataka",
    desc: "Ancient Draupadi procession featuring the priest carrying the decorated Karaga on his head through the city at night.",
    img: "https://pin.it/2qAFwxRxJ",
    lat: 12.9716,
    lng: 77.5946
  },
  {
    id: 22,
    name: "Thrissur Pooram",
    type: "Religious (Hindu)",
    month: "April/May",
    location: "Thrissur, Kerala",
    desc: "Kerala's grand temple festival famed for caparisoned elephants, percussion ensembles, and fireworks.",
    img: "https://pin.it/1PCHfCvO2",
    lat: 10.5276,
    lng: 76.2144
  },
  {
    id: 23,
    name: "Kollam Pooram",
    type: "Religious (Hindu)",
    month: "April/May",
    location: "Kollam, Kerala",
    desc: "Colorful annual temple festival with elephant processions and traditional music.",
    img: "https://pin.it/3CidcJsyb",
    lat: 8.8932,
    lng: 76.6141
  },
  {
    id: 24,
    name: "Makaravilakku",
    type: "Religious (Hindu)",
    month: "January",
    location: "Sabarimala, Kerala",
    desc: "Pilgrimage climax marked by witnessing the sacred light at Sabarimala hill shrine.",
    img: "https://pin.it/boQOIOTeE",
    lat: 9.2971,
    lng: 77.0259
  },
];

export const culturalHighlights: DiscoveryItem[] = [
  {
    name: "Classical Dance Forms (शास्त्रीय नृत्य)",
    aspect: "Performing Arts",
    description: "Includes Bharatanatyam, Kathak, Kathakali, Odissi, Manipuri, Mohiniyattam, and Kuchipudi, each telling stories through intricate mudras and expressions.",
    img: "https://www.india-a2z.com/images/dance4.jpg",
    lat: 13.0802,
    lng: 80.2838
  },
  {
    name: "Yoga and Ayurveda (योग और आयुर्वेद)",
    aspect: "Wellness & Philosophy",
    description: "Ancient Indian systems for health and well-being. Yoga focuses on physical, mental, and spiritual practices, while Ayurveda is a traditional medicine system.",
    img: "https://www.kairali.com/pic/ayurveda-teachers.jpg",
    lat: 30.3165,
    lng: 78.0322
  },
  {
    name: "Indian Cuisine (भारतीय व्यंजन)",
    aspect: "Gastronomy",
    description: "Known for its vast regional diversity—from North Indian curries and bread to South Indian idli/dosa, Bengali fish, and Goan vindaloo. Focuses on spices and balance of six tastes.",
    img: "https://www.drishtiias.com/images/blogs/1651313Blog.jpg",
    lat: 28.6139,
    lng: 77.209
  },
  {
    name: "Bollywood & Regional Cinema (सिनेमा)",
    aspect: "Mass Media & Arts",
    description: "The world's largest film industry, headquartered in Mumbai, influencing music, fashion, and social narratives globally. Includes vibrant regional cinemas like Tamil, Telugu, and Bengali.",
    img: "",
    lat: 19.076,
    lng: 72.8777
  },
  {
    name: "Traditional Textiles & Sari (वस्त्र और साड़ी)",
    aspect: "Fashion & Craft",
    description: "India's rich textile heritage features handloom fabrics like Silk (Banarasi, Kanjivaram), Cotton (Khadi), and intricate works like Pashmina shawls and bandhani dying.",
    img: "https://www.treebo.com/blog/wp-content/uploads/2023/04/header-1.jpg",
    lat: 25.3176,
    lng: 82.9739
  },
  {
    name: "Kathputli (कठपुतली) & Puppetry",
    aspect: "Folk Arts",
    description: "Traditional string puppetry, most prominent in Rajasthan, used for storytelling and conveying social messages through intricate wooden dolls.",
    img: "https://as2.ftcdn.net/v2/jpg/06/54/65/01/1000_F_654650175_uwZWhUZnsg2YRni51rcm87Wz5ZOjjw99.jpg",
    lat: 26.9124,
    lng: 75.7873
  },
  {
    name: "Hindustani & Carnatic Music (शास्त्रीय संगीत)",
    aspect: "Music",
    description: "The two main branches of Indian classical music. Hindustani (North India) focuses on improvisational Ragas, while Carnatic (South India) is based on composed Kriti songs.",
    img: "https://th-i.thgim.com/public/incoming/jmt9yr/article69154713.ece/alternates/FREE_1200/2501_28_12_2024_10_22_33_1_DSC_3265.JPEG",
    lat: 22.5726,
    lng: 88.3639
  },
  {
    name: "Kalarippayattu (कलरीपयट्टु)",
    aspect: "Martial Arts",
    description: "One of the oldest surviving martial arts in the world, originating in Kerala. Involves strikes, kicks, weapon training, and healing methods.",
    img: "https://t4.ftcdn.net/jpg/08/77/30/95/240_F_877309584_1UYj1Y27iyb7ifQx9DUaKqevjy5kFdC7.jpg",
    lat: 10.8505,
    lng: 76.2711
  },
  {
    name: "Tribal Art Forms (जनजातीय कला)",
    aspect: "Visual Arts",
    description: "Includes distinct styles like Warli painting (Maharashtra), Gond art (Madhya Pradesh), and Madhubani painting (Bihar), reflecting tribal life and myths.",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbnU6N0dJ7rg82MLgVZD5RJfBQGnrqbVxEzQ&s",
    lat: 20.9042,
    lng: 74.7749
  },
  {
    name: "Miniature Painting (लघु चित्रकला)",
    aspect: "Visual Arts",
    description: "Detailed, colorful paintings developed under Mughal, Rajput, and Pahari royal courts, depicting epics, portraits, and courtly life on small scale.",
    img: "https://t3.ftcdn.net/jpg/14/97/84/14/240_F_1497841456_hjqQRp5Nl3EWK8ZZwrWaLdnSc11wmYzv.jpg",
    lat: 26.9124,
    lng: 75.7873
  },
  {
    name: "Bharatanatyam",
    aspect: "Classical Dance",
    description: "Temple dance tradition from Tamil Nadu noted for expressive abhinaya, precise footwork, and storytelling.",
    img: "https://images.pexels.com/photos/30481580/pexels-photo-30481580.jpeg",
    lat: 13.0802,
    lng: 80.2838
  },
  {
    name: "Kathakali",
    aspect: "Classical Dance",
    description: "Kerala's dramatic dance-theatre with elaborate makeup, face masks, and vigorous mudras narrating epics.",
    img: "https://images.pexels.com/photos/8610533/pexels-photo-8610533.jpeg",
    lat: 10.8505,
    lng: 76.2711
  },
  {
    name: "Carnatic Music",
    aspect: "Classical Music",
    description: "South Indian classical tradition focused on kritis, ragam-tanam-pallavi, and rich improvisation.",
    img: "https://images.pexels.com/photos/10491556/pexels-photo-10491556.jpeg",
    lat: 12.9716,
    lng: 77.5946
  },
  {
    name: "Kuchipudi",
    aspect: "Classical Dance",
    description: "Dance-drama from Andhra Pradesh blending quick footwork, abhinaya, and character-driven storytelling.",
    img: "https://images.pexels.com/photos/18240707/pexels-photo-18240707.jpeg",
    lat: 16.5062,
    lng: 80.648
  },
  {
    name: "Mohiniyattam",
    aspect: "Classical Dance",
    description: "Graceful solo dance from Kerala emphasizing lasya (soft movements) and lyrical expression.",
    img: "https://images.pexels.com/photos/30444651/pexels-photo-30444651.jpeg",
    lat: 10.8505,
    lng: 76.2711
  },
  {
    name: "Yoga and Ayurveda",
    aspect: "Wellness",
    description: "Ancient body-mind practices and holistic medicine systems rooted in South Indian tradition and ashrams.",
    img: "https://i0.wp.com/powercutonline.com/wp-content/uploads/2025/07/Jnana-Yoga-Basics-optimized.webp?w=1280&ssl=1",
    lat: 30.3165,
    lng: 78.0322
  },
  {
    name: "Tanjore Painting",
    aspect: "Visual Art",
    description: "Gold-foil embellished devotional art from Thanjavur featuring rich colors and relief work.",
    img: "https://poompuhar.com/wp-content/uploads/2024/09/DSC05347-1.png",
    lat: 10.7905,
    lng: 79.1372
  },
  {
    name: "Mysore Painting",
    aspect: "Visual Art",
    description: "Karnataka style noted for delicate lines, muted palettes, and gesso relief halos in mythological themes.",
    img: "https://poompuhar.com/wp-content/uploads/2024/09/DSC05347-1.png",
    lat: 12.2958,
    lng: 76.6394
  },
  {
    name: "Traditional Textiles",
    aspect: "Craft",
    description: "Handloom heritage like Kanjivaram, Ilkal, and Pochampally weaving, showcasing South Indian textile mastery.",
    img: "https://images.pexels.com/photos/34996132/pexels-photo-34996132.jpeg",
    lat: 26.9124,
    lng: 75.7873
  },
];

export const historicalPlaces: DiscoveryItem[] = [
  {
    id: 1,
    name: "Group of Monuments at Hampi",
    era: "Vijayanagara Empire",
    location: "Hampi, Karnataka",
    description: "Ruins of the capital city featuring temples and stone chariots.",
    img: "https://pin.it/4RqJyIPsK",
    lat: 15.335,
    lng: 76.4629
  },
  {
    id: 2,
    name: "Meenakshi Amman Temple",
    era: "Pandyan/Nayak Dynasties",
    location: "Madurai, Tamil Nadu",
    description: "Historic temple known for its 14 gopurams covered with mythological figures.",
    img: "https://pin.it/Lb8z4LMY3",
    lat: 9.9195,
    lng: 78.1191
  },
  {
    id: 3,
    name: "Shore Temple",
    era: "Pallava Dynasty",
    location: "Mahabalipuram, Tamil Nadu",
    description: "Granite temple complex overlooking the Bay of Bengal.",
    img: "https://pin.it/7lJ5HHDmL",
    lat: 12.6176,
    lng: 80.1994
  },
  {
    id: 4,
    name: "Golconda Fort",
    era: "Kakatiya/Qutb Shahi Dynasties",
    location: "Hyderabad, Telangana",
    description: "Famous fort known for its acoustics and diamonds like Koh-i-Noor.",
    img: "https://pin.it/2B7YL2O47",
    lat: 17.3833,
    lng: 78.4011
  },
  {
    id: 5,
    name: "Charminar",
    era: "Qutb Shahi Dynasty",
    location: "Hyderabad, Telangana",
    description: "Iconic monument and mosque built in 1591, symbol of Hyderabad.",
    img: "https://pin.it/YwJhHdoTi",
    lat: 17.3616,
    lng: 78.4747
  },
  {
    id: 6,
    name: "Brihadeeswarar Temple",
    era: "Chola Empire",
    location: "Thanjavur, Tamil Nadu",
    description: "Massive temple dedicated to Lord Shiva, a UNESCO World Heritage Site.",
    img: "https://pin.it/ElBy0CN4Q",
    lat: 10.7867,
    lng: 79.1311
  },
  {
    id: 7,
    name: "Mysore Palace",
    era: "Wodeyar Dynasty",
    location: "Mysore, Karnataka",
    description: "Royal residence known for its grand durbar hall and intricate architecture.",
    img: "https://pin.it/A8uDrWmfQ",
    lat: 12.2958,
    lng: 76.6394
  },
  {
    id: 8,
    name: "Belur and Halebidu Temples",
    era: "Hoysala Empire",
    location: "Karnataka",
    description: "Famed for exquisite stone carvings and architecture.",
    img: "https://pin.it/1pi94QyU3",
    lat: 12.9735,
    lng: 75.6019
  },
  {
    id: 9,
    name: "Srirangam Temple",
    era: "Medieval Period",
    location: "Tamil Nadu",
    description: "Largest functioning Hindu temple in the world, dedicated to Lord Ranganatha.",
    img: "https://pin.it/4tKKrUSl9",
    lat: 10.8737,
    lng: 78.6937
  },
  {
    id: 10,
    name: "Sravanabelagola",
    era: "Medieval Jain",
    location: "Karnataka",
    description: "Famous for the 57 feet tall monolithic statue of Gommateshwara Bahubali.",
    img: "https://pin.it/N8c7qBFjd",
    lat: 12.8583,
    lng: 76.4723
  },
  {
    id: 11,
    name: "Lepakshi Temple",
    era: "Vijayanagara Empire",
    location: "Andhra Pradesh",
    description: "Known for its hanging pillar and exquisite murals.",
    img: "https://pin.it/7HnOMI2Vj",
    lat: 14.5087,
    lng: 77.698
  },
  {
    id: 12,
    name: "Warangal Fort",
    era: "Kakatiya Dynasty",
    location: "Telangana",
    description: "Historic fort ruins known for impressive stone gateways (Kakatiya Kala Thoranam).",
    img: "https://pin.it/7QUakYyWm",
    lat: 18.0063,
    lng: 79.5832
  },
  {
    id: 13,
    name: "Nandi Hills",
    era: "Medieval",
    location: "Karnataka",
    description: "Historic fort and hill station, popular for sunrise views and trekking.",
    img: "https://pin.it/372zCWvpl",
    lat: 13.3718,
    lng: 77.6831
  },
  {
    id: 14,
    name: "Badami Caves",
    era: "Chalukya Dynasty",
    location: "Karnataka",
    description: "Rock-cut cave temples famous for frescoes and sculptures.",
    img: "https://pin.it/3YOAVM4oo",
    lat: 15.9145,
    lng: 75.6761
  },
  {
    id: 15,
    name: "Thanjavur Maratha Palace",
    era: "Maratha Dynasty",
    location: "Thanjavur, Tamil Nadu",
    description: "Royal palace complex featuring museums and art galleries.",
    img: "https://pin.it/6H1sW8iqk",
    lat: 10.7867,
    lng: 79.1311
  },
  {
    id: 16,
    name: "Udayagiri Caves",
    era: "Pallava Dynasty",
    location: "Andhra Pradesh",
    description: "Ancient rock-cut cave temples with sculptures and inscriptions.",
    img: "https://pin.it/6RpRlx7C5",
    lat: 14.6437,
    lng: 79.5776
  },
  {
    id: 1,
    name: "Taj Mahal",
    era: "Mughal Empire",
    location: "Agra, Uttar Pradesh",
    description: "An iconic white marble mausoleum commissioned by Emperor Shah Jahan in memory of his wife Mumtaz Mahal (UNESCO World Heritage Site).",
    img: "https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg",
    lat: 27.1751,
    lng: 78.0421
  },
  {
    id: 2,
    name: "Red Fort (लाल किला)",
    era: "Mughal Empire",
    location: "Delhi",
    description: "A historic fort in Old Delhi that served as the main residence of the Mughal Emperors for nearly 200 years. The Prime Minister addresses the nation here on Independence Day (UNESCO World Heritage Site).",
    img: "https://images.pexels.com/photos/33597243/pexels-photo-33597243.jpeg",
    lat: 28.6562,
    lng: 77.241
  },
  {
    id: 3,
    name: "Qutub Minar",
    era: "Delhi Sultanate",
    location: "Delhi",
    description: "A 73-meter tall minaret and complex, the tallest brick minaret in the world, started by Qutub-ud-din Aibak (UNESCO World Heritage Site).",
    img: "https://images.pexels.com/photos/30254905/pexels-photo-30254905.jpeg",
    lat: 28.5244,
    lng: 77.1855
  },
  {
    id: 4,
    name: "Humayun's Tomb",
    era: "Mughal Empire",
    location: "Delhi",
    description: "The tomb of the Mughal Emperor Humayun, often considered the first garden-tomb on the Indian subcontinent (UNESCO World Heritage Site).",
    img: "https://images.pexels.com/photos/11750406/pexels-photo-11750406.jpeg",
    lat: 28.5933,
    lng: 77.2507
  },
  {
    id: 5,
    name: "Fatehpur Sikri",
    era: "Mughal Empire",
    location: "Near Agra, Uttar Pradesh",
    description: "A city founded by Mughal Emperor Akbar, which served as the capital from 1571 to 1585, now perfectly preserved in red sandstone (UNESCO World Heritage Site).",
    img: "https://images.pexels.com/photos/6176676/pexels-photo-6176676.jpeg",
    lat: 27.0936,
    lng: 77.6611
  },
  {
    id: 6,
    name: "Agra Fort",
    era: "Mughal Empire",
    location: "Agra, Uttar Pradesh",
    description: "The primary residence of the emperors of the Mughal Dynasty until 1638. A massive red sandstone fortress (UNESCO World Heritage Site).",
    img: "https://images.pexels.com/photos/19195952/pexels-photo-19195952.jpeg",
    lat: 27.1795,
    lng: 78.0211
  },
  {
    id: 7,
    name: "Group of Monuments at Hampi",
    era: "Vijayanagara Empire",
    location: "Hampi, Karnataka",
    description: "The ruins of the magnificent capital city of the Vijayanagara Empire, featuring stunning temples and stone chariots (UNESCO World Heritage Site).",
    img: "https://images.pexels.com/photos/30830312/pexels-photo-30830312.jpeg",
    lat: 15.335,
    lng: 76.4629
  },
  {
    id: 8,
    name: "Khajuraho Group of Monuments",
    era: "Chandela Dynasty",
    location: "Khajuraho, Madhya Pradesh",
    description: "A group of Hindu and Jain temples famous for their intricate and erotic sculptures (UNESCO World Heritage Site).",
    img: "https://images.pexels.com/photos/20545471/pexels-photo-20545471.jpeg",
    lat: 24.8318,
    lng: 79.9386
  },
  {
    id: 9,
    name: "Ajanta Caves",
    era: "Satavahana & Vakataka Dynasties",
    location: "Maharashtra",
    description: "Rock-cut Buddhist cave monuments featuring beautifully preserved paintings and sculptures depicting the Jataka tales (UNESCO World Heritage Site).",
    img: "https://images.pexels.com/photos/4882665/pexels-photo-4882665.jpeg",
    lat: 20.5534,
    lng: 75.7033
  },
  {
    id: 10,
    name: "Ellora Caves",
    era: "Rashtrakuta Dynasty",
    location: "Maharashtra",
    description: "One of the largest rock-cut monastery-temple cave complexes in the world, featuring Buddhist, Hindu, and Jain monuments (UNESCO World Heritage Site).",
    img: "https://media.gettyimages.com/id/1337887772/photo/ajanta-and-ellora.jpg?s=612x612&w=0&k=20&c=31ffxf39PZ-DZQazVGfs08PjUztJBrQa0zwsOhrnwJ8=",
    lat: 20.0268,
    lng: 75.1786
  },
  {
    id: 11,
    name: "Sanchi Stupa",
    era: "Mauryan Empire",
    location: "Sanchi, Madhya Pradesh",
    description: "The oldest stone structure in India, commissioned by Emperor Ashoka, famous for its grand stupa and ornamental gateways (UNESCO World Heritage Site).",
    img: "https://images.pexels.com/photos/33266890/pexels-photo-33266890.jpeg",
    lat: 23.4793,
    lng: 77.7391
  },
  {
    id: 12,
    name: "Konark Sun Temple",
    era: "Eastern Ganga Dynasty",
    location: "Konark, Odisha",
    description: "Dedicated to the Sun God Surya, this temple is designed as a colossal chariot with twelve pairs of intricately carved stone wheels (UNESCO World Heritage Site).",
    img: "https://images.pexels.com/photos/6040175/pexels-photo-6040175.jpeg",
    lat: 19.8876,
    lng: 86.0945
  },
  {
    id: 13,
    name: "Meenakshi Amman Temple",
    era: "Pandyan/Nayak Dynasties",
    location: "Madurai, Tamil Nadu",
    description: "A historic Hindu temple with 14 magnificent Gopurams (gate towers) covered with thousands of mythological figures.",
    img: "https://images.pexels.com/photos/23914402/pexels-photo-23914402.jpeg",
    lat: 9.9195,
    lng: 78.1191
  },
  {
    id: 14,
    name: "Victoria Memorial",
    era: "British Raj",
    location: "Kolkata, West Bengal",
    description: "A large marble building constructed between 1906 and 1921, dedicated to the memory of Queen Victoria.",
    img: "https://images.pexels.com/photos/16565204/pexels-photo-16565204.jpeg",
    lat: 22.5448,
    lng: 88.3426
  },
  {
    id: 15,
    name: "Gateway of India",
    era: "British Raj",
    location: "Mumbai, Maharashtra",
    description: "An iconic arch monument built to commemorate the landing of King-Emperor George V and Queen-Empress Mary at Apollo Bunder in 1911.",
    img: "https://images.pexels.com/photos/15528027/pexels-photo-15528027.jpeg",
    lat: 18.9217,
    lng: 72.8347
  },
  {
    id: 16,
    name: "Jallianwala Bagh",
    era: "Modern History",
    location: "Amritsar, Punjab",
    description: "A garden of national importance marking the site of the 1919 massacre by British forces.",
    img: "https://s7ap1.scene7.com/is/image/incredibleindia/jallianwala-bagh-amritsar-punjab-1-attr-hero?qlt=82&ts=1726662275638",
    lat: 31.6202,
    lng: 74.8797
  },
  {
    id: 17,
    name: "Charminar",
    era: "Qutb Shahi Dynasty",
    location: "Hyderabad, Telangana",
    description: "A monument and mosque built in 1591, known as the 'Arc de Triomphe of the East', and the city's global icon.",
    img: "https://images.pexels.com/photos/5615112/pexels-photo-5615112.jpeg",
    lat: 17.3616,
    lng: 78.4747
  },
  {
    id: 18,
    name: "Golconda Fort",
    era: "Kakatiya/Qutb Shahi Dynasties",
    location: "Hyderabad, Telangana",
    description: "A magnificent fort, originally a mud fort, famous for its acoustics and being the source of world-renowned diamonds like the Koh-i-Noor.",
    img: "https://images.pexels.com/photos/29221923/pexels-photo-29221923.jpeg",
    lat: 17.3833,
    lng: 78.4011
  },
  {
    id: 19,
    name: "Amer Fort (आमेर का किला)",
    era: "Kachhwaha Dynasty",
    location: "Jaipur, Rajasthan",
    description: "A beautiful fort built of red sandstone and marble, known for its artistic Hindu style elements (UNESCO World Heritage Site).",
    img: "https://images.pexels.com/photos/33106473/pexels-photo-33106473.jpeg",
    lat: 26.9855,
    lng: 75.8507
  },
  {
    id: 20,
    name: "Chittorgarh Fort",
    era: "Mewar Kingdom",
    location: "Chittorgarh, Rajasthan",
    description: "The largest fort in India and a UNESCO World Heritage Site, famed for its association with Rajput history, courage, and sacrifice.",
    img: "https://images.pexels.com/photos/32760057/pexels-photo-32760057.jpeg",
    lat: 24.8896,
    lng: 74.6472
  },
  {
    id: 21,
    name: "Nalanda University Ruins",
    era: "Gupta/Pala Empires",
    location: "Bihar",
    description: "The ruins of an ancient Buddhist monastic university, a major center of learning from the 5th to 13th centuries (UNESCO World Heritage Site).",
    img: "https://images.pexels.com/photos/10818318/pexels-photo-10818318.jpeg",
    lat: 25.1357,
    lng: 85.443
  },
  {
    id: 22,
    name: "Shore Temple",
    era: "Pallava Dynasty",
    location: "Mahabalipuram, Tamil Nadu",
    description: "A structural temple complex built with blocks of granite, overlooking the Bay of Bengal (UNESCO World Heritage Site).",
    img: "https://images.pexels.com/photos/32399048/pexels-photo-32399048.jpeg",
    lat: 12.6176,
    lng: 80.1994
  },
];
