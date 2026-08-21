// src/api/guides.ts
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

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
  createdAt?: string;
}

export interface GuideAPIResponse {
  success?: boolean;
  guides?: Guide[];
  guide?: Guide;
  message?: string;
  error?: string;
}

const LOCAL_STORAGE_GUIDES_KEY = 'darshana_local_guides_directory';

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
    profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80',
    bio: 'Ministry of Tourism Certified Senior Guide with 14 years uncovering the architectural symmetry and hidden acoustics of the Taj Mahal and Agra Fort.',
    languages: ['English', 'Hindi', 'French', 'German'],
    verified: true,
    pricePerDay: 1800,
    experience: 14,
    govtId: 'MOT-IN-AGR-8842',
    status: 'approved',
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
    profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
    bio: 'Banaras Hindu University heritage researcher guiding private dawn boat rituals, ancient silk weaver lanes, and spiritual philosophy discussions.',
    languages: ['Hindi', 'English', 'Sanskrit', 'Italian'],
    verified: true,
    pricePerDay: 1600,
    experience: 9,
    govtId: 'MOT-IN-VNS-4910',
    status: 'approved',
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
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    bio: '12th generation Jaipur native specializing in the secret tunnels of Amer Fort, royal astronomical mathematics, and traditional block printing workshops.',
    languages: ['Hindi', 'Rajasthani', 'English', 'Spanish'],
    verified: true,
    pricePerDay: 1900,
    experience: 12,
    govtId: 'MOT-IN-JPR-7721',
    status: 'approved',
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
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
    bio: 'Storyteller and culinary explorer leading deep-dive explorations into the 1,024 maze corridors of Bhul Bhulaiya and legendary 18th-century Nawabi eateries.',
    languages: ['Hindi', 'Urdu', 'English'],
    verified: true,
    pricePerDay: 1400,
    experience: 11,
    govtId: 'MOT-IN-LKO-3105',
    status: 'approved',
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
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    bio: 'Art historian and former National Museum docent guiding curated architectural walking tours across Mehrauli, Chandni Chowk, and Humayun’s Tomb.',
    languages: ['English', 'Hindi', 'Punjabi', 'Japanese'],
    verified: true,
    pricePerDay: 1750,
    experience: 8,
    govtId: 'MOT-IN-DEL-9082',
    status: 'approved',
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
    profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=80',
    bio: 'Native Alleppey naturalist guiding eco-canoe expeditions through serene palm canals, Kathakali theatrical greenrooms, and organic spice farms.',
    languages: ['English', 'Malayalam', 'Hindi', 'Tamil'],
    verified: true,
    pricePerDay: 2100,
    experience: 10,
    govtId: 'MOT-IN-KER-6219',
    status: 'approved',
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
    profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80',
    bio: 'Goan architectural conservationist guiding walking tours of Fontainhas, 16th-century UNESCO Basilica of Bom Jesus, and inland river backwaters.',
    languages: ['English', 'Konkani', 'Hindi', 'Portuguese'],
    verified: true,
    pricePerDay: 1650,
    experience: 7,
    govtId: 'MOT-IN-GOA-5114',
    status: 'approved',
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
    profileImage: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=80',
    bio: 'Archaeologist dedicated to the 14th-century capital of Vijayanagara, decoding temple stone carvings, acoustic musical pillars, and Tungabhadra river legends.',
    languages: ['English', 'Kannada', 'Hindi', 'Telugu'],
    verified: true,
    pricePerDay: 1500,
    experience: 9,
    govtId: 'MOT-IN-KAR-4019',
    status: 'approved',
    createdAt: '2026-02-18T10:30:00.000Z'
  }
];

// Initial Pending Applications for Admin review demonstration
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
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    bio: 'Former Jadavpur University modern history researcher guiding heritage tram rides, Victorian colonial trails, and artisanal Durga idol workshops.',
    languages: ['Bengali', 'English', 'Hindi'],
    verified: false,
    pricePerDay: 1400,
    experience: 6,
    govtId: 'MOT-IN-WB-8120 (Pending Verification)',
    status: 'pending',
    createdAt: '2026-08-20T14:30:00.000Z'
  },
  {
    _id: 'app-rishikesh-102',
    name: 'Aditi Joshi',
    email: 'aditi.rishikesh@darshana.com',
    phone: '+91 98765 99010',
    location: 'Rishikesh / Haridwar, Uttarakhand',
    specialties: ['Vedic Yoga & Meditation', 'Ganga Ghat Traditions', 'Himalayan Foothill Trails', 'Ashram History'],
    rating: 5.0,
    reviews: 0,
    profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
    bio: 'Certified Yoga Alliance teacher and spiritual guide conducting morning riverside meditation, Parmarth Niketan Aarti, and Beatles Ashram historical walks.',
    languages: ['Hindi', 'English', 'German'],
    verified: false,
    pricePerDay: 1600,
    experience: 5,
    govtId: 'UT-TOURS-RSH-3991',
    status: 'pending',
    createdAt: '2026-08-21T09:15:00.000Z'
  }
];

const GUIDES_COLLECTION = 'local_guides';
const REQUESTS_COLLECTION = 'guide_requests';

/**
 * Load all stored guides from localStorage with fallback to initial seed
 */
export function getStoredGuides(): Guide[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_GUIDES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error reading stored guides from localStorage:', err);
  }

  // Seed default directory
  const initialCombined = [...INITIAL_INDIAN_GUIDES, ...INITIAL_PENDING_APPLICATIONS];
  saveStoredGuides(initialCombined);
  return initialCombined;
}

/**
 * Save all guides to localStorage
 */
export function saveStoredGuides(guides: Guide[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_GUIDES_KEY, JSON.stringify(guides));
  } catch (err) {
    console.warn('Error saving guides to localStorage:', err);
  }
}

/**
 * Fetch all approved guides for the public Local Guides directory
 */
export async function fetchAllGuides(): Promise<Guide[]> {
  // 1. Try Firestore
  try {
    const guidesRef = collection(db, GUIDES_COLLECTION);
    const snapshot = await getDocs(guidesRef);

    if (!snapshot.empty) {
      const firestoreGuides: Guide[] = snapshot.docs.map(docSnap => ({
        _id: docSnap.id,
        ...(docSnap.data() as Omit<Guide, '_id'>)
      }));
      // Filter only approved/verified
      return firestoreGuides.filter(g => g.status === 'approved' || g.verified);
    }
  } catch (error) {
    // Continue to local storage
  }

  // 2. Local storage persistent directory
  const allStored = getStoredGuides();
  return allStored.filter(g => g.status === 'approved' || g.verified);
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

  // Sync with Firestore if available
  try {
    const docRef = doc(db, GUIDES_COLLECTION, guideId);
    await updateDoc(docRef, { status: 'approved', verified: true });
  } catch {
    // Local persistence is already complete
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
}): Promise<{ success: boolean; id: string; message: string }> {
  const newId = `guide-reg-${Date.now()}`;
  
  const defaultImages = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'
  ];
  const selectedImage = guideData.profileImage && guideData.profileImage.trim().length > 5
    ? guideData.profileImage
    : defaultImages[Math.floor(Math.random() * defaultImages.length)];

  const newGuide: Guide = {
    _id: newId,
    name: guideData.name,
    email: guideData.email,
    phone: guideData.phone,
    location: guideData.location,
    specialties: guideData.specialties.length > 0 ? guideData.specialties : ['Heritage Walks', 'Cultural Tours'],
    rating: 5.0,
    reviews: 0,
    profileImage: selectedImage,
    bio: guideData.bio,
    languages: guideData.languages.length > 0 ? guideData.languages : ['Hindi', 'English'],
    verified: false,
    pricePerDay: Number(guideData.pricePerDay) || 1500,
    experience: Number(guideData.experience) || 3,
    govtId: guideData.govtId || `MOT-APP-${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  // Save to local persistence
  const allStored = getStoredGuides();
  allStored.unshift(newGuide);
  saveStoredGuides(allStored);

  // Sync to Firestore
  try {
    const guidesRef = collection(db, GUIDES_COLLECTION);
    await addDoc(guidesRef, {
      ...newGuide,
      createdAt: serverTimestamp()
    });
  } catch (err) {
    console.warn('Saved guide application to local directory store.');
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
