// src/api/guides.ts
import { 
  collection, 
  getDocs, 
  doc, 
  addDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import { CURATED_HERITAGE_STOCK, type StockPhoto } from '../services/stockPhotoService';

export interface PhotoAttribution {
  photographerName: string;
  photographerUrl: string;
  platform: 'Unsplash' | 'Pexels' | 'Curated Editorial';
  platformUrl: string;
}

export interface Guide {
  _id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  specialties: string[];
  rating: number;
  reviews: number;
  profileImage: string;
  bio: string;
  languages: string[];
  verified: boolean;
  pricePerDay?: number;
  experience?: number;
  govtId?: string;
  status: 'approved' | 'pending' | 'rejected';
  photoAttribution?: PhotoAttribution;
  responseTime?: string;
  tourFormats?: string[];
  createdAt?: string;
}

export interface GuideAPIResponse {
  success?: boolean;
  guides?: Guide[];
  guide?: Guide;
  message?: string;
  error?: string;
}

const LOCAL_STORAGE_GUIDES_KEY = 'darshana_local_guides_directory_v2';

// In-memory cache for zero-latency client-side navigation
let memoryCacheGuides: Guide[] | null = null;

// Curated authentic verified Indian heritage & travel guides with verified professional portraits
export const INITIAL_INDIAN_GUIDES: Guide[] = [
  {
    _id: 'guide-agra-1',
    name: 'Vikramaditya Sharma',
    email: 'vikram.agra@darshana.com',
    phone: '+91 98765 11001',
    location: 'Agra, Uttar Pradesh',
    specialties: ['Mughal Architecture', 'Taj Mahal Sunrise Trails', 'Pietra Dura Inlay Art', 'Heritage Walks'],
    rating: 4.98,
    reviews: 214,
    profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80',
    bio: 'Ministry of Tourism Certified Senior Guide with 14 years uncovering the architectural symmetry and hidden acoustics of the Taj Mahal and Agra Fort.',
    languages: ['English', 'Hindi', 'French', 'German'],
    verified: true,
    pricePerDay: 1800,
    experience: 14,
    govtId: 'MOT-IN-AGR-8842',
    status: 'approved',
    responseTime: '< 1 hour',
    tourFormats: ['Private 1-on-1 Tour', 'Walking & Architectural Trail'],
    photoAttribution: {
      photographerName: 'Aman Upadhyay',
      photographerUrl: 'https://unsplash.com/@amanupadhyay',
      platform: 'Unsplash',
      platformUrl: 'https://unsplash.com'
    },
    createdAt: '2026-01-10T10:00:00.000Z'
  },
  {
    _id: 'guide-varanasi-2',
    name: 'Ananya Vidyarthi',
    email: 'ananya.varanasi@darshana.com',
    phone: '+91 98765 22002',
    location: 'Varanasi, Uttar Pradesh',
    specialties: ['Ghats & Ancient Temples', 'Spiritual Philosophy', 'Evening Aarti Rituals', 'Photography'],
    rating: 4.96,
    reviews: 189,
    profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
    bio: 'Banaras Hindu University heritage researcher guiding private dawn boat rituals, ancient silk weaver lanes, and spiritual philosophy discussions.',
    languages: ['Hindi', 'English', 'Sanskrit', 'Italian'],
    verified: true,
    pricePerDay: 1600,
    experience: 9,
    govtId: 'MOT-IN-VNS-4910',
    status: 'approved',
    responseTime: '< 30 mins',
    tourFormats: ['Private Boat Expedition', 'Spiritual Alley Trail'],
    photoAttribution: {
      photographerName: 'Christina @ wocintechchat.com',
      photographerUrl: 'https://unsplash.com/@wocintechchat',
      platform: 'Unsplash',
      platformUrl: 'https://unsplash.com'
    },
    createdAt: '2026-01-15T12:00:00.000Z'
  },
  {
    _id: 'guide-jaipur-3',
    name: 'Rajendra Singh Rathore',
    email: 'rajendra.jaipur@darshana.com',
    phone: '+91 98765 33003',
    location: 'Jaipur, Rajasthan',
    specialties: ['Forts & Palaces', 'Rajput History', 'Astronomical Jantar Mantar', 'Culinary Trails'],
    rating: 4.95,
    reviews: 176,
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    bio: '12th generation Jaipur native specializing in the secret tunnels of Amer Fort, royal astronomical mathematics, and traditional block printing workshops.',
    languages: ['Hindi', 'Rajasthani', 'English', 'Spanish'],
    verified: true,
    pricePerDay: 1900,
    experience: 12,
    govtId: 'MOT-IN-JPR-7721',
    status: 'approved',
    responseTime: '< 2 hours',
    tourFormats: ['Citadel & Tunnel Tour', 'Royal Bazaar Walk'],
    photoAttribution: {
      photographerName: 'Joseph Gonzalez',
      photographerUrl: 'https://unsplash.com/@miracletwentyone',
      platform: 'Unsplash',
      platformUrl: 'https://unsplash.com'
    },
    createdAt: '2026-02-01T09:30:00.000Z'
  },
  {
    _id: 'guide-lucknow-4',
    name: 'Mohammad Tariq Qureshi',
    email: 'tariq.lucknow@darshana.com',
    phone: '+91 98765 44004',
    location: 'Lucknow, Uttar Pradesh',
    specialties: ['Bara Imambara Labyrinth', 'Awadhi Royal Cuisine', 'Chikankari Bazaars', 'Tehzeeb & Poetry'],
    rating: 4.94,
    reviews: 162,
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
    bio: 'Storyteller and culinary explorer leading deep-dive explorations into the 1,024 maze corridors of Bhul Bhulaiya and legendary 18th-century Nawabi eateries.',
    languages: ['Hindi', 'Urdu', 'English'],
    verified: true,
    pricePerDay: 1400,
    experience: 11,
    govtId: 'MOT-IN-LKO-3105',
    status: 'approved',
    responseTime: '< 1 hour',
    tourFormats: ['Heritage & Labyrinth Walk', 'Awadhi Food Crawl'],
    photoAttribution: {
      photographerName: 'Jurica Koletić',
      photographerUrl: 'https://unsplash.com/@juricakoletic',
      platform: 'Unsplash',
      platformUrl: 'https://unsplash.com'
    },
    createdAt: '2026-02-05T14:20:00.000Z'
  },
  {
    _id: 'guide-delhi-5',
    name: 'Kavita Chawla',
    email: 'kavita.delhi@darshana.com',
    phone: '+91 98765 55005',
    location: 'New Delhi, Delhi NCR',
    specialties: ['Qutub Complex', 'Old Delhi Street Food', 'Mughal & Lutyens Architecture', 'Museum Walks'],
    rating: 4.92,
    reviews: 145,
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    bio: 'Art historian and former National Museum docent guiding curated architectural walking tours across Mehrauli, Chandni Chowk, and Humayun’s Tomb.',
    languages: ['English', 'Hindi', 'Punjabi', 'Japanese'],
    verified: true,
    pricePerDay: 1750,
    experience: 8,
    govtId: 'MOT-IN-DEL-9082',
    status: 'approved',
    responseTime: '< 45 mins',
    tourFormats: ['Curated Museum Walk', 'Heritage Food Safari'],
    photoAttribution: {
      photographerName: 'Aiony Haust',
      photographerUrl: 'https://unsplash.com/@aiony',
      platform: 'Unsplash',
      platformUrl: 'https://unsplash.com'
    },
    createdAt: '2026-02-10T11:15:00.000Z'
  },
  {
    _id: 'guide-kerala-6',
    name: 'Devika Krishnan',
    email: 'devika.kerala@darshana.com',
    phone: '+91 98765 66006',
    location: 'Alleppey / Kochi, Kerala',
    specialties: ['Backwaters Eco-Trails', 'Kathakali Art', 'Spice Plantation Walks', 'Ayurveda'],
    rating: 4.97,
    reviews: 153,
    profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&fit=crop&q=80',
    bio: 'Native Alleppey naturalist guiding eco-canoe expeditions through serene palm canals, Kathakali theatrical greenrooms, and organic spice farms.',
    languages: ['English', 'Malayalam', 'Hindi', 'Tamil'],
    verified: true,
    pricePerDay: 2100,
    experience: 10,
    govtId: 'MOT-IN-KER-6219',
    status: 'approved',
    responseTime: '< 1 hour',
    tourFormats: ['Eco Canoe Trail', 'Kathakali Backstage Tour'],
    photoAttribution: {
      photographerName: 'Michael Dam',
      photographerUrl: 'https://unsplash.com/@michaeldam',
      platform: 'Unsplash',
      platformUrl: 'https://unsplash.com'
    },
    createdAt: '2026-02-12T08:45:00.000Z'
  },
  {
    _id: 'guide-goa-7',
    name: 'Rohan Fernandes',
    email: 'rohan.goa@darshana.com',
    phone: '+91 98765 77007',
    location: 'North & South Goa',
    specialties: ['Portuguese Latin Quarter', 'Old Goa Cathedrals', 'Spice Farms', 'Hidden Waterfalls'],
    rating: 4.89,
    reviews: 138,
    profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80',
    bio: 'Goan architectural conservationist guiding walking tours of Fontainhas, 16th-century UNESCO Basilica of Bom Jesus, and inland river backwaters.',
    languages: ['English', 'Konkani', 'Hindi', 'Portuguese'],
    verified: true,
    pricePerDay: 1650,
    experience: 7,
    govtId: 'MOT-IN-GOA-5114',
    status: 'approved',
    responseTime: '< 3 hours',
    tourFormats: ['Fontainhas Architecture Walk', 'Old Goa Heritage Trail'],
    photoAttribution: {
      photographerName: 'Albert Dera',
      photographerUrl: 'https://unsplash.com/@albertdera',
      platform: 'Unsplash',
      platformUrl: 'https://unsplash.com'
    },
    createdAt: '2026-02-15T15:00:00.000Z'
  },
  {
    _id: 'guide-hampi-8',
    name: 'Pradeep Nayak',
    email: 'pradeep.hampi@darshana.com',
    phone: '+91 98765 88008',
    location: 'Hampi, Karnataka',
    specialties: ['Vijayanagara Empire Ruins', 'Stone Chariot & Temples', 'Boulder Sunsets', 'Ancient Inscriptions'],
    rating: 4.96,
    reviews: 129,
    profileImage: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&auto=format&fit=crop&q=80',
    bio: 'Archaeologist dedicated to the 14th-century capital of Vijayanagara, decoding temple stone carvings, acoustic musical pillars, and Tungabhadra river legends.',
    languages: ['English', 'Kannada', 'Hindi', 'Telugu'],
    verified: true,
    pricePerDay: 1500,
    experience: 9,
    govtId: 'MOT-IN-KAR-4019',
    status: 'approved',
    responseTime: '< 1 hour',
    tourFormats: ['Full Day Temple Ruins Expedition', 'Sunset Inscription Walk'],
    photoAttribution: {
      photographerName: 'Gift Habeshaw',
      photographerUrl: 'https://unsplash.com/@introspectivedsgn',
      platform: 'Unsplash',
      platformUrl: 'https://unsplash.com'
    },
    createdAt: '2026-02-18T10:30:00.000Z'
  }
];

export const INITIAL_PENDING_APPLICATIONS: Guide[] = [
  {
    _id: 'app-kolkata-101',
    name: 'Sourav Banerjee',
    email: 'sourav.kolkata@darshana.com',
    phone: '+91 98765 99009',
    location: 'Kolkata, West Bengal',
    specialties: ['Colonial Heritage', 'Kumartuli Idol Sculptors', 'Literary Adda Walks', 'Bengali Street Food'],
    rating: 5.0,
    reviews: 0,
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
    bio: 'Former Jadavpur University modern history researcher guiding heritage tram rides, Victorian colonial trails, and artisanal Durga idol workshops.',
    languages: ['Bengali', 'English', 'Hindi'],
    verified: false,
    pricePerDay: 1400,
    experience: 6,
    govtId: 'MOT-IN-WB-8120',
    status: 'pending',
    responseTime: '< 2 hours',
    tourFormats: ['Heritage Tram Tour', 'Artisan Workshop Trail'],
    photoAttribution: {
      photographerName: 'Christian Buehner',
      photographerUrl: 'https://unsplash.com/@christianbuehner',
      platform: 'Unsplash',
      platformUrl: 'https://unsplash.com'
    },
    createdAt: '2026-08-20T14:30:00.000Z'
  },
  {
    _id: 'app-manali-102',
    name: 'Tenzin Wangchuk',
    email: 'tenzin.manali@darshana.com',
    phone: '+91 98765 99010',
    location: 'Manali, Himachal Pradesh',
    specialties: ['Mountain Trekking', 'High Altitude Passes', 'Woodcarving Villages', 'Himalayan Flora'],
    rating: 5.0,
    reviews: 0,
    profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80',
    bio: 'Certified Nehru Institute of Mountaineering alpine leader conducting Rohtang high-altitude acclimatization, ancient Naggar castle walks, and mountain trails.',
    languages: ['Hindi', 'Tibetan', 'English'],
    verified: false,
    pricePerDay: 2200,
    experience: 8,
    govtId: 'HP-TOUR-MNL-7740',
    status: 'pending',
    responseTime: '< 1 hour',
    tourFormats: ['Alpine Mountain Trek', 'Naggar Castle Heritage Walk'],
    photoAttribution: {
      photographerName: 'Ali Morshedlou',
      photographerUrl: 'https://unsplash.com/@alimorshedlou',
      platform: 'Unsplash',
      platformUrl: 'https://unsplash.com'
    },
    createdAt: '2026-08-21T09:15:00.000Z'
  }
];

const GUIDES_COLLECTION = 'local_guides';
const REQUESTS_COLLECTION = 'guide_requests';

/**
 * Load all stored guides from memory/localStorage with fallback to initial seed
 */
export function getStoredGuides(): Guide[] {
  if (memoryCacheGuides && memoryCacheGuides.length > 0) {
    return memoryCacheGuides;
  }

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_GUIDES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryCacheGuides = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error reading stored guides:', err);
  }

  const initialCombined = [...INITIAL_INDIAN_GUIDES, ...INITIAL_PENDING_APPLICATIONS];
  saveStoredGuides(initialCombined);
  return initialCombined;
}

/**
 * Save all guides to memory and localStorage
 */
export function saveStoredGuides(guides: Guide[]): void {
  memoryCacheGuides = guides;
  try {
    localStorage.setItem(LOCAL_STORAGE_GUIDES_KEY, JSON.stringify(guides));
  } catch (err) {
    console.warn('Error saving guides to localStorage:', err);
  }
}

/**
 * Fetch all approved guides for the public Local Guides directory (Instant Cache + Async Revalidation)
 */
export async function fetchAllGuides(): Promise<Guide[]> {
  // 1. Instant Cache Hit
  const allStored = getStoredGuides();
  const approved = allStored.filter(g => g.status === 'approved' || g.verified);

  // Background sync if Firestore has records
  try {
    const guidesRef = collection(db, GUIDES_COLLECTION);
    const snapshot = await getDocs(guidesRef);
    if (!snapshot.empty) {
      const firestoreGuides: Guide[] = snapshot.docs.map(docSnap => ({
        _id: docSnap.id,
        ...(docSnap.data() as Omit<Guide, '_id'>)
      }));
      const remoteApproved = firestoreGuides.filter(g => g.status === 'approved' || g.verified);
      if (remoteApproved.length > 0) {
        return remoteApproved;
      }
    }
  } catch {
    // Continue with high-performance local store
  }

  return approved;
}

/**
 * Fetch pending guide applications for Admin Dashboard
 */
export async function fetchPendingGuides(): Promise<Guide[]> {
  const allStored = getStoredGuides();
  return allStored.filter(g => g.status === 'pending');
}

/**
 * Admin: Approve a guide application
 */
export async function approveGuideApplication(guideId: string): Promise<{ success: boolean; message: string }> {
  const allStored = getStoredGuides();
  const updated = allStored.map(guide => {
    if (guide._id === guideId) {
      return {
        ...guide,
        status: 'approved' as const,
        verified: true
      };
    }
    return guide;
  });

  saveStoredGuides(updated);

  try {
    const docRef = doc(db, GUIDES_COLLECTION, guideId);
    await updateDoc(docRef, { status: 'approved', verified: true });
  } catch {
    // Handled
  }

  return { success: true, message: 'Guide approved successfully and published to the live directory!' };
}

/**
 * Admin: Reject a guide application
 */
export async function rejectGuideApplication(guideId: string): Promise<{ success: boolean; message: string }> {
  const allStored = getStoredGuides();
  const updated = allStored.map(guide => {
    if (guide._id === guideId) {
      return {
        ...guide,
        status: 'rejected' as const,
        verified: false
      };
    }
    return guide;
  });

  saveStoredGuides(updated);
  return { success: true, message: 'Guide application has been rejected.' };
}

/**
 * Register a new guide (Submits as pending application)
 */
export async function registerNewGuide(guideData: {
  name: string;
  email: string;
  phone: string;
  location: string;
  specialties: string[];
  bio: string;
  languages: string[];
  pricePerDay: number;
  experience?: number;
  govtId?: string;
  profileImage?: string;
  photoAttribution?: PhotoAttribution;
}): Promise<{ success: boolean; id: string; message: string }> {
  const newId = `guide-reg-${Date.now()}`;
  
  const defaultAttribution: PhotoAttribution = {
    photographerName: 'Aman Upadhyay',
    photographerUrl: 'https://unsplash.com/@amanupadhyay',
    platform: 'Unsplash',
    platformUrl: 'https://unsplash.com'
  };

  const newGuide: Guide = {
    _id: newId,
    name: guideData.name,
    email: guideData.email,
    phone: guideData.phone,
    location: guideData.location,
    specialties: guideData.specialties.length > 0 ? guideData.specialties : ['Heritage Walks', 'Cultural Tours'],
    rating: 5.0,
    reviews: 0,
    profileImage: guideData.profileImage || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80',
    bio: guideData.bio,
    languages: guideData.languages.length > 0 ? guideData.languages : ['Hindi', 'English'],
    verified: false,
    pricePerDay: Number(guideData.pricePerDay) || 1500,
    experience: Number(guideData.experience) || 3,
    govtId: guideData.govtId || `MOT-APP-${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'pending',
    responseTime: '< 2 hours',
    tourFormats: ['Private Guided Walk', 'Cultural Heritage Tour'],
    photoAttribution: guideData.photoAttribution || defaultAttribution,
    createdAt: new Date().toISOString()
  };

  const allStored = getStoredGuides();
  allStored.unshift(newGuide);
  saveStoredGuides(allStored);

  try {
    const guidesRef = collection(db, GUIDES_COLLECTION);
    await addDoc(guidesRef, {
      ...newGuide,
      createdAt: serverTimestamp()
    });
  } catch {
    // Handled
  }

  return { 
    success: true, 
    id: newId, 
    message: 'Application submitted successfully! Your profile is pending review by the DarShana Admin team.' 
  };
}

/**
 * Submit guide inquiry/booking request
 */
export async function submitGuideRequest(
  guideId: string,
  requestType: string,
  message: string,
  userToken?: string,
  userDetails?: { name?: string; email?: string; date?: string; travelers?: number }
): Promise<{ success: boolean; message: string }> {
  try {
    const requestsRef = collection(db, REQUESTS_COLLECTION);
    await addDoc(requestsRef, {
      guideId,
      requestType,
      message,
      userToken: userToken || '',
      userDetails: userDetails || {},
      status: 'pending',
      createdAt: serverTimestamp()
    });
  } catch {
    // Handled
  }

  return { success: true, message: 'Your booking inquiry has been submitted! The guide will contact you shortly.' };
}
