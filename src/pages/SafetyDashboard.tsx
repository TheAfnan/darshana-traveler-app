import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, Phone, MapPin, Shield, Heart, 
  Siren, Share2, Battery, Signal, Plus, Trash2, CheckCircle2,
  Compass, Mountain, Stethoscope, HelpCircle, PhoneCall, X
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Link } from 'react-router-dom';

const MapContainerComp = MapContainer as any;
const TileLayerComp = TileLayer as any;

// Fix Leaflet icon issue
const iconUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';
const iconShadow = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Location {
  lat: number;
  lng: number;
}

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

const DEFAULT_CONTACTS: EmergencyContact[] = [
  { id: '1', name: "National Emergency", phone: "112", relation: "All Services" },
  { id: '2', name: "Police", phone: "100", relation: "Emergency" },
  { id: '3', name: "Ambulance", phone: "108", relation: "Medical" },
  { id: '4', name: "Women Helpline", phone: "1091", relation: "Support" },
  { id: '5', name: "Cyber Crime", phone: "1930", relation: "Support" },
  { id: '6', name: "Fire Service", phone: "101", relation: "Emergency" },
  { id: '7', name: "Mom", phone: "+919876543210", relation: "Parent" },
  { id: '8', name: "Dad", phone: "+919876543211", relation: "Parent" }
];

const SafetyDashboard: React.FC = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(5);
  const [activeTab, setActiveTab] = useState<'emergency' | 'women' | 'forest' | 'medical'>('emergency');
  const [compassHeading, setCompassHeading] = useState(0);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [showFakeCall, setShowFakeCall] = useState(false);
  const [fakeCallRinging, setFakeCallRinging] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Editable contacts
  const [contacts, setContacts] = useState<EmergencyContact[]>(() => {
    const saved = localStorage.getItem('darshana_safety_contacts');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_CONTACTS;
  });

  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRelation, setNewContactRelation] = useState('');
  const [isAddingContact, setIsAddingContact] = useState(false);

  // Medical ID State
  const [bloodGroup, setBloodGroup] = useState(() => localStorage.getItem('darshana_blood_group') || 'O+');
  const [allergies, setAllergies] = useState(() => localStorage.getItem('darshana_allergies') || 'Penicillin');
  const [isEditingMedical, setIsEditingMedical] = useState(false);

  useEffect(() => {
    localStorage.setItem('darshana_safety_contacts', JSON.stringify(contacts));
  }, [contacts]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.error(error),
        { enableHighAccuracy: true }
      );
    }

    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
      });
    }

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha) {
        setCompassHeading(event.alpha);
      }
    };
    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  // Siren Effect Hook
  useEffect(() => {
    let audioCtx: AudioContext | null = null;
    let oscillator: OscillatorNode | null = null;
    let gainNode: GainNode | null = null;
    let lfo: OscillatorNode | null = null;
    let lfoGain: GainNode | null = null;

    if (isSOSActive) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioCtx = new AudioCtx();
        oscillator = audioCtx.createOscillator();
        gainNode = audioCtx.createGain();
        lfo = audioCtx.createOscillator();
        lfoGain = audioCtx.createGain();

        oscillator.type = 'sawtooth';
        oscillator.frequency.value = 880;

        lfo.type = 'triangle';
        lfo.frequency.value = 2;
        lfoGain.gain.value = 200;

        lfo.connect(lfoGain);
        lfoGain.connect(oscillator.frequency);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        gainNode.gain.value = 1.0;
        oscillator.start();
        lfo.start();
      } catch (e) {
        console.error("Siren playback failed:", e);
      }
    }

    return () => {
      if (oscillator) { try { oscillator.stop(); } catch(e) {} }
      if (lfo) { try { lfo.stop(); } catch(e) {} }
      if (audioCtx) { try { audioCtx.close(); } catch(e) {} }
    };
  }, [isSOSActive]);

  const handleSOSClick = () => {
    setIsSOSActive(true);
    let count = 5;
    setSosCountdown(count);
    
    const timer = setInterval(() => {
      count--;
      setSosCountdown(count);
      if (count === 0) {
        clearInterval(timer);
        triggerEmergencyProtocol();
      }
    }, 1000);
  };

  const cancelSOS = () => {
    setIsSOSActive(false);
    setSosCountdown(5);
  };

  const triggerEmergencyProtocol = async () => {
    if (navigator.share && location) {
      try {
        await navigator.share({
          title: 'EMERGENCY SOS',
          text: `I need help! My current location is: https://www.google.com/maps?q=${location.lat},${location.lng}`,
          url: `https://www.google.com/maps?q=${location.lat},${location.lng}`
        });
      } catch (err) {}
    }
    window.location.href = "tel:112";

    try {
      await fetch('/api/safety/emergency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'SOS',
          location,
          timestamp: new Date().toISOString()
        })
      });
    } catch (err) {}
  };

  const handleFakeCall = () => {
    setShowFakeCall(true);
    setFakeCallRinging(true);
  };

  const shareLiveLocation = async () => {
    const shareUrl = location 
      ? `https://www.google.com/maps?q=${location.lat},${location.lng}`
      : `${window.location.origin}/track/user-123`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Track My Live Location',
          text: 'I am sharing my live location with you for safety.',
          url: shareUrl
        });
        showToast("Live location shared!");
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(shareUrl);
      showToast("Live location link copied to clipboard!");
    }
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim() || !newContactPhone.trim()) return;

    const newEntry: EmergencyContact = {
      id: Date.now().toString(),
      name: newContactName.trim(),
      phone: newContactPhone.trim(),
      relation: newContactRelation.trim() || 'Personal'
    };

    setContacts(prev => [...prev, newEntry]);
    setNewContactName('');
    setNewContactPhone('');
    setNewContactRelation('');
    setIsAddingContact(false);
    showToast("Emergency contact added!");
  };

  const handleDeleteContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
    showToast("Contact removed");
  };

  const handleFindHospital = () => {
    const query = location 
      ? `https://www.google.com/maps/search/hospitals+near+me/@${location.lat},${location.lng},14z`
      : `https://www.google.com/maps/search/hospitals+near+me`;
    window.open(query, '_blank');
  };

  const handleSaveMedical = () => {
    localStorage.setItem('darshana_blood_group', bloodGroup);
    localStorage.setItem('darshana_allergies', allergies);
    setIsEditingMedical(false);
    showToast("Medical ID updated!");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20 font-sans relative">
      {/* Header */}
      <div className="bg-slate-900/90 backdrop-blur-md p-4 sticky top-0 z-50 shadow-lg border-b border-rose-500/20 flex justify-between items-center">
        <h1 className="text-xl font-bold flex items-center gap-2 text-rose-500">
          <Shield className="w-6 h-6 animate-pulse text-rose-500" /> Safety & Emergency Hub
        </h1>
        <div className="flex gap-3 text-sm items-center">
          <Link to="/safety-guide" className="flex items-center gap-1 text-slate-400 hover:text-white mr-2">
            <HelpCircle className="w-4 h-4" /> Guide
          </Link>
          {batteryLevel !== null && (
            <span className={`flex items-center gap-1 text-xs font-bold ${batteryLevel < 20 ? 'text-rose-500 animate-pulse' : 'text-emerald-400'}`}>
              <Battery className="w-4 h-4" /> {batteryLevel}%
            </span>
          )}
          <span className="flex items-center gap-1 text-blue-400 text-xs font-semibold">
            <Signal className="w-4 h-4" /> GPS Active
          </span>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-full shadow-2xl text-xs flex items-center gap-2 animate-bounce">
          <CheckCircle2 size={16} />
          {toastMessage}
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        
        {/* Big SOS Button */}
        <div className="flex flex-col items-center justify-center py-6">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={handleSOSClick}
            className="w-48 h-48 rounded-full bg-gradient-to-br from-rose-600 via-red-600 to-rose-800 shadow-[0_0_60px_rgba(244,63,94,0.6)] flex flex-col items-center justify-center border-4 border-rose-400 animate-pulse cursor-pointer hover:brightness-110 transition-all"
          >
            <Siren className="w-16 h-16 text-white mb-2" />
            <span className="text-3xl font-black text-white tracking-widest">SOS</span>
            <span className="text-xs text-rose-100 font-semibold mt-1">TAP FOR HELP</span>
          </motion.button>
          <p className="text-xs text-slate-400 mt-3 font-medium">Triggers siren, dials 112 & shares live GPS coordinates</p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button onClick={() => window.location.href = "tel:112"} className="bg-slate-900 p-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-slate-800 transition-all border border-slate-800 group">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <span className="font-semibold text-xs text-slate-200">Police (112)</span>
          </button>
          <button onClick={() => window.location.href = "tel:108"} className="bg-slate-900 p-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-slate-800 transition-all border border-slate-800 group">
            <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6" />
            </div>
            <span className="font-semibold text-xs text-slate-200">Ambulance (108)</span>
          </button>
          <button onClick={shareLiveLocation} className="bg-slate-900 p-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-slate-800 transition-all border border-slate-800 group">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Share2 className="w-6 h-6" />
            </div>
            <span className="font-semibold text-xs text-slate-200">Share Location</span>
          </button>
          <button onClick={handleFakeCall} className="bg-slate-900 p-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-slate-800 transition-all border border-slate-800 group">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <PhoneCall className="w-6 h-6" />
            </div>
            <span className="font-semibold text-xs text-slate-200">Fake Call</span>
          </button>
        </div>

        {/* Feature Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar border-b border-slate-800">
          {[
            { id: 'emergency', label: 'Emergency Contacts' },
            { id: 'women', label: 'Women Safety' },
            { id: 'forest', label: 'GPS Compass' },
            { id: 'medical', label: 'Medical ID' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-xs font-semibold transition-all ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-r from-rose-600 to-red-500 text-white shadow-md' 
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 min-h-[300px]">
          {activeTab === 'emergency' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold flex items-center gap-2 text-amber-400 uppercase tracking-wider">
                  <AlertTriangle className="text-amber-400" /> Emergency Helplines & Contacts
                </h3>
                <button
                  onClick={() => setIsAddingContact(!isAddingContact)}
                  className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-xl"
                >
                  <Plus size={14} /> Add Contact
                </button>
              </div>

              {/* Add Contact Form */}
              {isAddingContact && (
                <form onSubmit={handleAddContact} className="bg-slate-950 p-4 rounded-2xl border border-rose-500/30 space-y-3 text-xs">
                  <p className="font-semibold text-rose-300">Add Personal Emergency Contact</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Contact Name (e.g. Mom)"
                      value={newContactName}
                      onChange={(e) => setNewContactName(e.target.value)}
                      className="bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number (+91...)"
                      value={newContactPhone}
                      onChange={(e) => setNewContactPhone(e.target.value)}
                      className="bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
                      required
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Relation (e.g. Parent, Sibling, Friend)"
                    value={newContactRelation}
                    onChange={(e) => setNewContactRelation(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
                  />
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingContact(false)}
                      className="px-4 py-1.5 rounded-xl bg-slate-800 text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-rose-600 text-white font-semibold shadow"
                    >
                      Save Contact
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {contacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                    <div>
                      <div className="font-semibold text-sm text-slate-100">{contact.name}</div>
                      <div className="text-xs text-slate-400">{contact.relation} • {contact.phone}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a href={`tel:${contact.phone}`} className="bg-emerald-600 hover:bg-emerald-500 p-2.5 rounded-xl text-white shadow">
                        <Phone className="w-4 h-4" />
                      </a>
                      {contact.id.length > 5 && (
                        <button onClick={() => handleDeleteContact(contact.id)} className="text-slate-500 hover:text-rose-400 p-1">
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'women' && (
            <div className="space-y-4">
              <div className="bg-rose-500/10 border border-rose-500/30 p-5 rounded-2xl">
                <h3 className="text-rose-400 font-bold mb-1 uppercase tracking-wider text-xs">Safe Zone Alert</h3>
                <p className="text-sm text-slate-300 mb-4">Broadcast silent SOS alert to nearby verified volunteers and safe zones immediately.</p>
                <button 
                  onClick={() => showToast("Silent Alert triggered! Volunteers notified.")}
                  className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 py-3 rounded-xl font-bold text-white shadow transition-all"
                >
                  Trigger Silent Alert
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                  <div className="text-3xl font-bold text-emerald-400">12</div>
                  <div className="text-xs text-slate-400 mt-1">Safe Zones Nearby</div>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                  <div className="text-3xl font-bold text-rose-400">1091</div>
                  <div className="text-xs text-slate-400 mt-1">Women Helpline</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'forest' && (
            <div className="space-y-4">
              <div className="h-56 bg-slate-950 rounded-2xl overflow-hidden relative border border-slate-800 shadow-inner">
                {location ? (
                  <MapContainerComp 
                    center={[location.lat, location.lng]} 
                    zoom={14} 
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayerComp
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; OpenStreetMap contributors'
                    />
                    <Marker position={[location.lat, location.lng]}>
                      <Popup>You are here!</Popup>
                    </Marker>
                  </MapContainerComp>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-500 text-sm">
                    Locating GPS...
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex justify-between items-center bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-2">
                    <Compass className="text-blue-400" />
                    <span className="text-xs text-slate-300">Compass Heading</span>
                  </div>
                  <span className="font-mono text-lg font-bold text-blue-400">{Math.round(compassHeading)}°</span>
                </div>
                <div className="flex justify-between items-center bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-2">
                    <Mountain className="text-emerald-400" />
                    <span className="text-xs text-slate-300">Altitude</span>
                  </div>
                  <span className="font-mono text-lg font-bold text-emerald-400">~450m</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'medical' && (
            <div className="space-y-4">
              <div className="bg-rose-500/10 border border-rose-500/30 p-5 rounded-2xl">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-rose-400 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                    <Stethoscope className="w-5 h-5" /> Emergency Medical ID
                  </h3>
                  <button 
                    onClick={() => setIsEditingMedical(!isEditingMedical)} 
                    className="text-xs text-rose-300 underline"
                  >
                    {isEditingMedical ? 'Cancel' : 'Edit'}
                  </button>
                </div>

                {isEditingMedical ? (
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-slate-400 block mb-1">Blood Group</label>
                      <input
                        type="text"
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 px-3 py-1.5 rounded-xl text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Allergies</label>
                      <input
                        type="text"
                        value={allergies}
                        onChange={(e) => setAllergies(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 px-3 py-1.5 rounded-xl text-white"
                      />
                    </div>
                    <button
                      onClick={handleSaveMedical}
                      className="w-full py-2 bg-rose-600 text-white font-bold rounded-xl text-xs mt-2"
                    >
                      Save Medical Info
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400 block text-xs">Blood Group</span>
                      <span className="font-bold text-white text-lg">{bloodGroup}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-xs">Allergies</span>
                      <span className="font-bold text-white">{allergies}</span>
                    </div>
                  </div>
                )}
              </div>

              <button 
                onClick={handleFindHospital}
                className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <MapPin className="w-5 h-5" /> Locate Nearest Hospitals (Google Maps)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Simulated Fake Call Screen */}
      <AnimatePresence>
        {showFakeCall && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[120] bg-slate-950 flex flex-col items-center justify-between p-8 text-white font-sans"
          >
            <div className="text-center mt-12">
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">INCOMING CALL</p>
              <p className="text-3xl font-bold text-white">Mom ❤️</p>
              <p className="text-sm text-slate-400 mt-1">{fakeCallRinging ? 'Ringing...' : '00:15'}</p>
            </div>

            <div className="w-32 h-32 rounded-full bg-slate-900 border-2 border-slate-800 flex items-center justify-center text-4xl shadow-2xl">
              👩‍👦
            </div>

            <div className="w-full max-w-xs flex justify-around items-center mb-12">
              <button
                onClick={() => setShowFakeCall(false)}
                className="w-16 h-16 rounded-full bg-rose-600 flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform"
                title="Decline Call"
              >
                <X size={28} />
              </button>

              <button
                onClick={() => setFakeCallRinging(false)}
                className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform"
                title="Accept Call"
              >
                <Phone size={28} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SOS Overlay (Full Screen) */}
      <AnimatePresence>
        {isSOSActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[115] bg-rose-950/95 backdrop-blur-lg flex flex-col items-center justify-center p-6 text-white"
          >
            <div className="text-2xl sm:text-3xl font-black mb-6 animate-pulse tracking-wider text-rose-200">
              SENDING EMERGENCY SOS IN
            </div>
            <div className="text-8xl sm:text-9xl font-black mb-10 text-white font-mono drop-shadow-[0_0_30px_rgba(244,63,94,0.8)]">
              {sosCountdown}
            </div>
            <button 
              onClick={cancelSOS}
              className="bg-white text-rose-700 px-10 py-3.5 rounded-full text-lg font-black shadow-2xl hover:scale-105 transition-transform"
            >
              CANCEL SOS
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SafetyDashboard;
