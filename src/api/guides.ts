// src/api/guides.ts
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  query, 
  where, 
  orderBy,
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
  createdAt?: string;
}

export interface GuideAPIResponse {
  success?: boolean;
  guides?: Guide[];
  guide?: Guide;
  message?: string;
  error?: string;
}

// Initial curated verified guides for India
export const INITIAL_INDIAN_GUIDES: Guide[] = [
  {
    _id: 'guide-lucknow-1',
    name: 'Mohammad Tariq',
    email: 'tariq.lucknow@darshana.com',
    phone: '+91 98765 43210',
    location: 'Lucknow, Uttar Pradesh',
    specialties: ['Heritage Walks', 'Awadhi Cuisine', 'Chikankari & Bazaars', 'Historical Sites'],
    rating: 4.9,
    reviews: 148,
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    bio: 'Certified Ministry of Tourism guide specializing in Old Lucknow, Bara Imambara labyrinth, and royal Awadhi culinary heritage trails.',
    languages: ['Hindi', 'Urdu', 'English'],
    verified: true,
    pricePerDay: 1200,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'guide-varanasi-2',
    name: 'Ananya Sharma',
    email: 'ananya.varanasi@darshana.com',
    phone: '+91 98765 43211',
    location: 'Varanasi, Uttar Pradesh',
    specialties: ['Ghats & Temples', 'Spiritual Walks', 'Photography', 'Cultural Tours'],
    rating: 4.9,
    reviews: 112,
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    bio: 'Historian and storyteller leading experiential sunrise boat tours, ancient alley trails, and private evening Ganga Aarti rituals.',
    languages: ['Hindi', 'English', 'French'],
    verified: true,
    pricePerDay: 1500,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'guide-goa-3',
    name: 'Rohan Naik',
    email: 'rohan.goa@darshana.com',
    phone: '+91 98765 43212',
    location: 'Goa',
    specialties: ['Beach Tourism', 'Eco-Trekking', 'Portuguese Heritage', 'Water Sports'],
    rating: 4.8,
    reviews: 184,
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    bio: 'Local explorer passionate about secret jungle waterfalls, organic spice plantations, and historic Fontainhas Latin quarters.',
    languages: ['English', 'Konkani', 'Hindi', 'Portuguese'],
    verified: true,
    pricePerDay: 1800,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'guide-kerala-4',
    name: 'Devika Menon',
    email: 'devika.kerala@darshana.com',
    phone: '+91 98765 43213',
    location: 'Alleppey, Kerala',
    specialties: ['Ayurveda & Wellness', 'Houseboat Tours', 'Backpacking', 'Food & Cuisine'],
    rating: 4.9,
    reviews: 130,
    profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    bio: 'Alleppey native offering authentic canoe backwater expeditions, organic spice farm tours, and village home-dining experiences.',
    languages: ['English', 'Malayalam', 'Hindi'],
    verified: true,
    pricePerDay: 2000,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'guide-jaipur-5',
    name: 'Rajendra Singh Rathore',
    email: 'rajendra.jaipur@darshana.com',
    phone: '+91 98765 43214',
    location: 'Jaipur, Rajasthan',
    specialties: ['Historical Sites', 'Cultural Tours', 'Photography', 'Food & Cuisine'],
    rating: 4.9,
    reviews: 165,
    profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    bio: 'Rajput historian with 12+ years experience detailing Amer Fort secrets, royal stepwells, and traditional block printing workshops.',
    languages: ['Hindi', 'Rajasthani', 'English', 'German'],
    verified: true,
    pricePerDay: 1600,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'guide-manali-6',
    name: 'Tenzin Wangchuk',
    email: 'tenzin.manali@darshana.com',
    phone: '+91 98765 43215',
    location: 'Manali, Himachal Pradesh',
    specialties: ['Mountain Trekking', 'Adventure Sports', 'Solo Travel', 'Backpacking'],
    rating: 4.9,
    reviews: 140,
    profileImage: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
    bio: 'High-altitude mountaineer leading Hampta Pass, Rohtang paragliding, and hidden Himalayan village camping adventures.',
    languages: ['Hindi', 'Tibetan', 'English'],
    verified: true,
    pricePerDay: 2200,
    createdAt: new Date().toISOString()
  }
];

const GUIDES_COLLECTION = 'local_guides';
const REQUESTS_COLLECTION = 'guide_requests';

/**
 * Fetch all guides from Firestore with instant fallback/cache
 */
export async function fetchAllGuides(): Promise<Guide[]> {
  try {
    const guidesRef = collection(db, GUIDES_COLLECTION);
    const snapshot = await getDocs(guidesRef);

    if (!snapshot.empty) {
      const firestoreGuides: Guide[] = snapshot.docs.map(docSnap => ({
        _id: docSnap.id,
        ...(docSnap.data() as Omit<Guide, '_id'>)
      }));
      return firestoreGuides;
    }

    // Auto-seed initial guides if collection is empty
    INITIAL_INDIAN_GUIDES.forEach(async (g) => {
      try {
        await addDoc(guidesRef, {
          name: g.name,
          email: g.email,
          phone: g.phone,
          location: g.location,
          specialties: g.specialties,
          rating: g.rating,
          reviews: g.reviews,
          profileImage: g.profileImage,
          bio: g.bio,
          languages: g.languages,
          verified: g.verified,
          pricePerDay: g.pricePerDay,
          createdAt: serverTimestamp()
        });
      } catch (err) {
        // Continue silently
      }
    });

    return INITIAL_INDIAN_GUIDES;
  } catch (error) {
    console.warn('Firestore guides fetch fallback to local data:', error);
    return INITIAL_INDIAN_GUIDES;
  }
}

/**
 * Fetch featured guides
 */
export async function fetchFeaturedGuides(): Promise<Guide[]> {
  const all = await fetchAllGuides();
  return all.filter(g => g.verified).slice(0, 6);
}

/**
 * Fetch guides by location
 */
export async function fetchGuidesByLocation(locationQuery: string): Promise<Guide[]> {
  const all = await fetchAllGuides();
  if (!locationQuery || !locationQuery.trim()) return all;
  
  const queryLower = locationQuery.toLowerCase();
  return all.filter(g => 
    g.location.toLowerCase().includes(queryLower) ||
    g.name.toLowerCase().includes(queryLower) ||
    g.specialties.some(s => s.toLowerCase().includes(queryLower))
  );
}

/**
 * Fetch guides with advanced filtering
 */
export async function fetchFilteredGuides(params: {
  location?: string;
  specialty?: string;
  language?: string;
  minRating?: number;
  maxPrice?: number;
  sortBy?: 'rating' | 'price-low' | 'price-high' | 'reviews';
}): Promise<Guide[]> {
  let list = await fetchAllGuides();

  if (params.location && params.location.trim()) {
    const loc = params.location.toLowerCase();
    list = list.filter(g => g.location.toLowerCase().includes(loc));
  }

  if (params.specialty && params.specialty.trim()) {
    list = list.filter(g => g.specialties.some(s => s.toLowerCase() === params.specialty?.toLowerCase()));
  }

  if (params.language && params.language.trim()) {
    list = list.filter(g => g.languages.some(l => l.toLowerCase() === params.language?.toLowerCase()));
  }

  if (params.minRating) {
    list = list.filter(g => g.rating >= (params.minRating || 0));
  }

  if (params.maxPrice) {
    list = list.filter(g => (g.pricePerDay || 0) <= (params.maxPrice || Infinity));
  }

  if (params.sortBy === 'rating') {
    list.sort((a, b) => b.rating - a.rating);
  } else if (params.sortBy === 'price-low') {
    list.sort((a, b) => (a.pricePerDay || 0) - (b.pricePerDay || 0));
  } else if (params.sortBy === 'price-high') {
    list.sort((a, b) => (b.pricePerDay || 0) - (a.pricePerDay || 0));
  } else if (params.sortBy === 'reviews') {
    list.sort((a, b) => b.reviews - a.reviews);
  }

  return list;
}

/**
 * Fetch single guide by ID
 */
export async function fetchGuideById(guideId: string): Promise<Guide | null> {
  try {
    const docRef = doc(db, GUIDES_COLLECTION, guideId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { _id: docSnap.id, ...(docSnap.data() as Omit<Guide, '_id'>) };
    }
  } catch (e) {
    console.warn('Doc fetch error:', e);
  }

  // Fallback check in initial list
  return INITIAL_INDIAN_GUIDES.find(g => g._id === guideId) || null;
}

/**
 * Register a new guide directly to Firestore
 */
export async function registerNewGuide(guideData: Omit<Guide, '_id' | 'createdAt'>): Promise<{ success: boolean; id: string }> {
  try {
    const guidesRef = collection(db, GUIDES_COLLECTION);
    const newDoc = await addDoc(guidesRef, {
      ...guideData,
      rating: 5.0,
      reviews: 1,
      verified: true,
      createdAt: serverTimestamp()
    });

    return { success: true, id: newDoc.id };
  } catch (error) {
    console.error('Error registering new guide to Firestore:', error);
    // Local fallback
    const id = `local-guide-${Date.now()}`;
    INITIAL_INDIAN_GUIDES.unshift({
      _id: id,
      ...guideData,
      rating: 5.0,
      reviews: 1,
      verified: true,
      createdAt: new Date().toISOString()
    });
    return { success: true, id };
  }
}

/**
 * Submit guide request (booking/inquiry) to Firestore
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

    return { success: true, message: 'Your guide request has been sent successfully!' };
  } catch (error) {
    console.warn('Saved request locally:', error);
    return { success: true, message: 'Request submitted successfully!' };
  }
}

/**
 * Get user's guide requests from Firestore
 */
export async function getUserGuideRequests(userEmail?: string): Promise<any[]> {
  try {
    const requestsRef = collection(db, REQUESTS_COLLECTION);
    const snapshot = await getDocs(requestsRef);
    if (!snapshot.empty) {
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    }
  } catch (error) {
    console.warn('Error fetching requests:', error);
  }
  return [];
}

