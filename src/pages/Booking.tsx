import { AlertCircle, Calendar, CheckCircle, CreditCard, Languages, Loader, MapPin, ShieldCheck, UserPlus, Users, Wallet } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingApi } from '../services/api';
import { createRazorpayOrder } from '../services/razorpay';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

interface BookingFormData {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  roomType: string;
  specialRequests: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

type PackageOption = {
  id: string;
  name: string;
  price: number;
  badge: string;
  description: string;
  perks: string[];
};

const Booking = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState<BookingFormData>({
    destination: searchParams.get('destination') || searchParams.get('city') || 'Lucknow',
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    guests: parseInt(searchParams.get('guests') || '1') || 1,
    roomType: 'standard',
    specialRequests: '',
    contactName: user?.name || '',
    contactEmail: user?.email || '',
    contactPhone: user?.phone || ''
  });

  // New features state
  const [addGuide, setAddGuide] = useState(false);
  const [guideDetails, setGuideDetails] = useState({
    language: 'Hindi',
    gender: 'Any',
    requirements: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [lucknowOptions, setLucknowOptions] = useState({
    arrivalMode: 'train',
    arrivalFrom: '',
    arrivalTime: '',
    pickupLocation: '',
    stayType: 'hotel',
    guideFocus: 'Heritage walk',
    foodPreferences: ['Awadhi kebabs', 'Biryani trail'],
    dietaryNotes: ''
  });

  const packages: PackageOption[] = [
    {
      id: 'hold',
      name: 'Lucknow Quick Hold',
      price: 500,
      badge: '₹500 registration',
      description: 'Lock your slot for the dates you want; adjust plan later.',
      perks: ['48h slot hold', 'Basic concierge chat', 'Reschedule once for free']
    },
    {
      id: 'guided',
      name: 'Guided Day Experience',
      price: 1200,
      badge: 'Most picked',
      description: 'Local guide + curated routes across food, heritage, and shopping.',
      perks: ['Certified local guide', '2 curated routes', 'Pickup coordination']
    },
    {
      id: 'weekend',
      name: 'Food + Heritage Weekend',
      price: 2500,
      badge: 'Premium',
      description: 'Deep-dive weekend across kebabs, Imambaras, riverfront, and bazaars.',
      perks: ['Priority slots', 'Restaurant pre-booking', 'Evening riverfront walk']
    }
  ];

  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || import.meta.env.VITE_RAZORPAY_KEY;
  const [payingPackage, setPayingPackage] = useState<string | null>(null);
  const [payError, setPayError] = useState('');
  const [paySuccess, setPaySuccess] = useState<{ packageName: string; paymentId: string } | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [bookingId, setBookingId] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guests' ? (value === '' ? 0 : parseInt(value) || 0) : value
    }));
  };

  const handleGuideChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGuideDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLucknowChange = (name: string, value: string) => {
    setLucknowOptions(prev => ({ ...prev, [name]: value }));
  };

  const toggleFoodPreference = (choice: string) => {
    setLucknowOptions(prev => {
      const exists = prev.foodPreferences.includes(choice);
      return {
        ...prev,
        foodPreferences: exists
          ? prev.foodPreferences.filter(item => item !== choice)
          : [...prev.foodPreferences, choice]
      };
    });
  };

  const loadRazorpayScript = () =>
    new Promise<boolean>((resolve, reject) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => reject(false);
      document.body.appendChild(script);
    });

  const handleRazorpayPay = async (pkg: PackageOption) => {
    setPayError('');
    setPaySuccess(null);

    if (!razorpayKey) {
      setPayError('Missing Razorpay key (set VITE_RAZORPAY_KEY_ID).');
      return;
    }

    setPayingPackage(pkg.id);

    try {
      await loadRazorpayScript();
      const order = await createRazorpayOrder(pkg.price * 100, 'INR');

      const options = {
        key: razorpayKey,
        amount: order?.amount || pkg.price * 100,
        currency: order?.currency || 'INR',
        name: 'DarShana Trips',
        description: pkg.name,
        order_id: order?.id,
        prefill: {
          name: formData.contactName || user?.name || '',
          email: formData.contactEmail || user?.email || '',
          contact: formData.contactPhone || user?.phone || ''
        },
        notes: {
          destination: formData.destination,
          packageId: pkg.id,
          source: 'lucknow-packages'
        },
        theme: { color: '#0f62fe' },
        handler: (response: any) => {
          setPayingPackage(null);
          setPaySuccess({
            packageName: pkg.name,
            paymentId: response?.razorpay_payment_id || 'Payment successful'
          });
        },
        modal: {
          ondismiss: () => setPayingPackage(null)
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setPayError(err?.message || 'Unable to start Razorpay checkout.');
      setPayingPackage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Combine guide, Lucknow specifics, and payment into special requests for backend compatibility
    let enhancedSpecialRequests = formData.specialRequests;
    const isLucknowTrip = formData.destination.toLowerCase().includes('lucknow');

    if (isLucknowTrip) {
      const foodList = lucknowOptions.foodPreferences.length
        ? lucknowOptions.foodPreferences.join(', ')
        : 'No specific food picks';
      enhancedSpecialRequests += `\n[Lucknow Plan]: arrivalMode=${lucknowOptions.arrivalMode}, from=${lucknowOptions.arrivalFrom || 'unspecified'}, arrivalTime=${lucknowOptions.arrivalTime || 'flexible'}, pickup=${lucknowOptions.pickupLocation || 'decide later'}, stayType=${lucknowOptions.stayType}, guideFocus=${lucknowOptions.guideFocus}, food=${foodList}, dietary=${lucknowOptions.dietaryNotes || 'none'}`;
    }
    if (addGuide) {
      enhancedSpecialRequests += `\n[Guide Requested]: Language: ${guideDetails.language}, Gender: ${guideDetails.gender}, Req: ${guideDetails.requirements}`;
    }
    enhancedSpecialRequests += `\n[Payment Method]: ${paymentMethod}`;

    try {
      const response = await bookingApi.create({
        ...formData,
        specialRequests: enhancedSpecialRequests,
        userId: user?.id
      });

      if (response.success && response.data) {
        setSuccess(true);
        const result = response.data as any;
        setBookingId(result.bookingId || result.bookingCode || result._id || '');
      } else {
        setError(response.error || 'Failed to create booking');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border-t-8 border-blue-600">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-4">
            Your trip with DarShana has been successfully registered.
          </p>
          <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-100">
            <p className="text-sm text-blue-600 font-medium">Booking ID</p>
            <p className="font-mono font-bold text-xl text-blue-800">{bookingId}</p>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/my-trips')}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
            >
              View My Bookings
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-white text-gray-700 border border-gray-300 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Header Banner */}
      <div className="bg-blue-700 h-64 w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/80 to-blue-800/90"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 h-full flex flex-col justify-center pb-10">
          <h1 className="text-5xl font-extrabold text-white tracking-tight mb-2 drop-shadow-md font-serif">
            DarShana
          </h1>
          <p className="text-xl text-blue-100 font-medium tracking-wide">
            Darshana: A glimpse of every corner of India
          </p>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="max-w-3xl mx-auto px-4 -mt-20 relative z-20">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl overflow-hidden border-t-8 border-blue-600">
          
          {/* Form Header */}
          <div className="p-8 border-b border-gray-100">
            <h2 className="text-3xl font-bold text-gray-800">Trip Booking Registration</h2>
            <p className="text-gray-500 mt-2">Complete your details to reserve your journey.</p>
          </div>

          {error && (
            <div className="mx-8 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle size={24} className="text-red-600 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {payError && (
            <div className="mx-8 mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-900">
              {payError}
            </div>
          )}

          {paySuccess && (
            <div className="mx-8 mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900">
              Payment received for {paySuccess.packageName}. Payment ID: {paySuccess.paymentId}
            </div>
          )}

          <div className="p-8 space-y-8">

            {/* Lucknow package quick-pay */}
            <section className="rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Lucknow packages (pay via Razorpay)</h3>
                  <p className="text-sm text-slate-600">Pick a ready option and pay securely. You can still finish the form for full booking.</p>
                </div>
                <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">Instant checkout</span>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {packages.map((pkg) => (
                  <div key={pkg.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-bold text-slate-900">{pkg.name}</h4>
                      <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2 py-1 rounded-full">{pkg.badge}</span>
                    </div>
                    <p className="text-2xl font-extrabold text-blue-700">₹{pkg.price.toLocaleString()}</p>
                    <p className="text-sm text-slate-600">{pkg.description}</p>
                    <ul className="text-sm text-slate-700 space-y-1">
                      {pkg.perks.map((perk) => (
                        <li key={perk} className="flex items-start gap-2">
                          <span className="text-blue-600">•</span>
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      onClick={() => handleRazorpayPay(pkg)}
                      disabled={payingPackage === pkg.id}
                      className="mt-auto w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {payingPackage === pkg.id ? (
                        <>
                          <Loader size={18} className="animate-spin" /> Processing...
                        </>
                      ) : (
                        'Pay with Razorpay'
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </section>
            
            {/* Section 1: Trip Details */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="text-blue-600" size={20} /> Trip Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                  <input
                    type="text"
                    name="destination"
                    required
                    value={formData.destination}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Where do you want to go?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3.5 text-gray-400" size={18} />
                    <input
                      type="date"
                      name="checkIn"
                      required
                      value={formData.checkIn}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3.5 text-gray-400" size={18} />
                    <input
                      type="date"
                      name="checkOut"
                      required
                      value={formData.checkOut}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3.5 text-gray-400" size={18} />
                    <input
                      type="number"
                      name="guests"
                      min="1"
                      required
                      value={formData.guests}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                  <select
                    name="roomType"
                    value={formData.roomType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="standard">Standard</option>
                    <option value="deluxe">Deluxe</option>
                    <option value="suite">Suite</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="bg-amber-50 border border-amber-100 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-amber-900">Lucknow-focused preferences</h3>
                  <p className="text-sm text-amber-700">How you will reach, what you want to eat, and on-ground help.</p>
                </div>
                <span className="text-xs font-semibold text-amber-700 bg-amber-200 px-3 py-1 rounded-full">Optional</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Arrival mode</label>
                  <select
                    value={lucknowOptions.arrivalMode}
                    onChange={(e) => handleLucknowChange('arrivalMode', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="flight">Flight</option>
                    <option value="train">Train</option>
                    <option value="bus">Bus</option>
                    <option value="car">Car / Self-drive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coming from</label>
                  <input
                    type="text"
                    value={lucknowOptions.arrivalFrom}
                    onChange={(e) => handleLucknowChange('arrivalFrom', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="City / station / airport"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ETA (optional)</label>
                  <input
                    type="datetime-local"
                    value={lucknowOptions.arrivalTime}
                    onChange={(e) => handleLucknowChange('arrivalTime', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pickup point</label>
                  <input
                    type="text"
                    value={lucknowOptions.pickupLocation}
                    onChange={(e) => handleLucknowChange('pickupLocation', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Airport / station / hotel"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stay type</label>
                  <select
                    value={lucknowOptions.stayType}
                    onChange={(e) => handleLucknowChange('stayType', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="hotel">Hotel</option>
                    <option value="homestay">Homestay</option>
                    <option value="hostel">Hostel</option>
                    <option value="guesthouse">Guest house</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Guide focus</label>
                  <select
                    value={lucknowOptions.guideFocus}
                    onChange={(e) => handleLucknowChange('guideFocus', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Heritage walk">Heritage walk (Imambaras, Residency)</option>
                    <option value="Food trail">Food trail (kebabs, biryani, chaat)</option>
                    <option value="Shopping lanes">Shopping lanes (Chowk, Hazratganj, Aminabad)</option>
                    <option value="Parks & riverfront">Parks & riverfront</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Food picks</label>
                <div className="flex flex-wrap gap-2">
                  {["Awadhi kebabs", "Biryani trail", "Street chaat", "Sweets & desserts", "Vegetarian only"].map((item) => {
                    const active = lucknowOptions.foodPreferences.includes(item);
                    return (
                      <button
                        type="button"
                        key={item}
                        onClick={() => toggleFoodPreference(item)}
                        className={`px-4 py-2 rounded-full border text-sm font-semibold transition ${
                          active ? 'bg-amber-600 text-white border-amber-700' : 'bg-white text-amber-800 border-amber-200 hover:border-amber-400'
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dietary notes</label>
                  <input
                    type="text"
                    value={lucknowOptions.dietaryNotes}
                    onChange={(e) => handleLucknowChange('dietaryNotes', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="E.g., Jain meals, avoid peanuts"
                  />
                </div>
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* Section 2: Guide Option */}
            <section className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                    <UserPlus size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Add a Local Guide?</h3>
                    <p className="text-sm text-gray-600">Enhance your trip with a local expert.</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={addGuide}
                    onChange={(e) => setAddGuide(e.target.checked)}
                  />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Conditional Guide Details */}
              {addGuide && (
                <div className="mt-4 pt-4 border-t border-blue-200 animate-in slide-in-from-top-2 duration-300">
                  <h4 className="text-sm font-semibold text-blue-800 mb-3 uppercase tracking-wide">Guide Preferences</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Language</label>
                      <div className="relative">
                        <Languages className="absolute left-3 top-3.5 text-gray-400" size={18} />
                        <select
                          name="language"
                          value={guideDetails.language}
                          onChange={handleGuideChange}
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Hindi">Hindi</option>
                          <option value="English">English</option>
                          <option value="Local Dialect">Local Dialect</option>
                          <option value="French">French</option>
                          <option value="Spanish">Spanish</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Guide Gender Preference</label>
                      <select
                        name="gender"
                        value={guideDetails.gender}
                        onChange={handleGuideChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Any">No Preference</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Specific Requirements</label>
                      <textarea
                        name="requirements"
                        value={guideDetails.requirements}
                        onChange={handleGuideChange}
                        rows={2}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="E.g., History expert, Food tour specialist..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              )}
            </section>

            <hr className="border-gray-100" />

            {/* Section 3: Payment Method */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Wallet className="text-blue-600" size={20} /> Payment Method
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: 'upi', label: 'UPI / GPay', icon: ShieldCheck },
                  { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
                  { id: 'hotel', label: 'Pay at Hotel', icon: MapPin },
                ].map((method) => (
                  <div 
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center justify-center gap-2 transition-all ${
                      paymentMethod === method.id 
                        ? 'border-blue-600 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 hover:border-blue-300 text-gray-600'
                    }`}
                  >
                    <method.icon size={24} />
                    <span className="font-semibold text-sm">{method.label}</span>
                    {paymentMethod === method.id && (
                      <div className="absolute top-2 right-2 text-blue-600">
                        <CheckCircle size={16} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* Section 4: Contact Info */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="contactName"
                    required
                    value={formData.contactName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="contactEmail"
                    required
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="contactPhone"
                    required
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
                  <input
                    type="text"
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Any specific needs?"
                  />
                </div>
              </div>
            </section>

          </div>

          {/* Footer Actions */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 text-center sm:text-left">
              By clicking Submit, you agree to our <a href="#" className="text-blue-600 hover:underline">Terms</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
            </p>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg font-bold text-lg shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader size={20} className="animate-spin" /> Processing...
                </>
              ) : (
                'Confirm Booking'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Booking;
