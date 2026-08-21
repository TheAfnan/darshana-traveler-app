import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, Phone, MapPin, Shield, Heart, 
  Siren, Share2, Battery, Plus, Trash2, CheckCircle2,
  Compass, Stethoscope, X, PhoneCall, Volume2
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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

interface SafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_CONTACTS: EmergencyContact[] = [
  { id: '1', name: "National Emergency", phone: "112", relation: "All Services" },
  { id: '2', name: "Police", phone: "100", relation: "Emergency" },
  { id: '3', name: "Ambulance", phone: "108", relation: "Medical" },
  { id: '4', name: "Women Helpline", phone: "1091", relation: "Support" },
  { id: '5', name: "Mom", phone: "+919876543210", relation: "Parent" },
];

const SafetyModal: React.FC<SafetyModalProps> = ({ isOpen, onClose }) => {
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
    if (!isOpen) return;

    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.error(error),
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

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
  }, [isOpen]);

  // Audio Siren Effect
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
        console.error("Siren audio error:", e);
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
          title: 'EMERGENCY SOS - DarShana Safety',
          text: `EMERGENCY ALERT: I need immediate help! My live location is: https://www.google.com/maps?q=${location.lat},${location.lng}`,
          url: `https://www.google.com/maps?q=${location.lat},${location.lng}`
        });
      } catch (err) {}
    }
    window.location.href = "tel:112";
  };

  const handleFakeCall = () => {
    setShowFakeCall(true);
    setFakeCallRinging(true);
  };

  const shareLiveLocation = async () => {
    const locString = location 
      ? `https://www.google.com/maps?q=${location.lat},${location.lng}`
      : window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Track My Live Location',
          text: 'I am sharing my live location with you for safety.',
          url: locString
        });
        showToast("Live location shared!");
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(locString);
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
    showToast("Contact added successfully!");
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
    showToast("Medical ID saved!");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md z-[100]"
          />

          {/* Toast Alert */}
          {toastMessage && (
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[120] bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-full shadow-2xl text-xs flex items-center gap-2 animate-bounce">
              <CheckCircle2 size={16} />
              {toastMessage}
            </div>
          )}

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-3 sm:p-4 pointer-events-none font-sans"
          >
            <div className="bg-slate-950 text-white w-full max-w-lg max-h-[92vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto border border-rose-500/20">
              
              {/* Header */}
              <div className="bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 p-4 flex justify-between items-center border-b border-rose-500/20">
                <h1 className="text-lg font-bold flex items-center gap-2 text-rose-500">
                  <Shield className="w-5 h-5 text-rose-500 animate-pulse" /> Emergency Safety Hub
                </h1>
                <div className="flex items-center gap-3">
                  {batteryLevel !== null && (
                    <span className={`flex items-center gap-1 text-xs font-semibold ${batteryLevel < 20 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
                      <Battery className="w-3.5 h-3.5" /> {batteryLevel}%
                    </span>
                  )}
                  <button 
                    onClick={onClose}
                    className="p-1 hover:bg-slate-800 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-slate-400 hover:text-white" />
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto p-4 space-y-5 custom-scrollbar">
                
                {/* Big SOS Button */}
                <div className="flex flex-col items-center justify-center py-2">
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={handleSOSClick}
                    className="w-36 h-36 rounded-full bg-gradient-to-br from-rose-600 via-red-600 to-rose-800 shadow-[0_0_50px_rgba(244,63,94,0.5)] flex flex-col items-center justify-center border-4 border-rose-400 animate-pulse cursor-pointer hover:brightness-110 transition-all"
                  >
                    <Siren className="w-12 h-12 text-white mb-1" />
                    <span className="text-2xl font-black text-white tracking-widest">SOS</span>
                    <span className="text-[10px] text-rose-100 font-semibold tracking-wide">TAP FOR HELP</span>
                  </motion.button>
                  <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                    <Volume2 size={12} className="text-rose-400" /> Triggers siren, calls 112 & shares location
                  </p>
                </div>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button onClick={() => window.location.href = "tel:112"} className="bg-slate-900/90 p-3 rounded-2xl flex items-center gap-3 hover:bg-slate-800 transition-all border border-slate-800/80 group text-left">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 group-hover:scale-110 transition-transform">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-slate-200">Police / SOS</div>
                      <div className="text-[10px] text-slate-400">Call 112</div>
                    </div>
                  </button>
                  <button onClick={() => window.location.href = "tel:108"} className="bg-slate-900/90 p-3 rounded-2xl flex items-center gap-3 hover:bg-slate-800 transition-all border border-slate-800/80 group text-left">
                    <div className="w-9 h-9 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 shrink-0 group-hover:scale-110 transition-transform">
                      <Heart className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-slate-200">Ambulance</div>
                      <div className="text-[10px] text-slate-400">Call 108 / 102</div>
                    </div>
                  </button>
                  <button onClick={shareLiveLocation} className="bg-slate-900/90 p-3 rounded-2xl flex items-center gap-3 hover:bg-slate-800 transition-all border border-slate-800/80 group text-left">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-110 transition-transform">
                      <Share2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-slate-200">Share Location</div>
                      <div className="text-[10px] text-slate-400">GPS Link</div>
                    </div>
                  </button>
                  <button onClick={handleFakeCall} className="bg-slate-900/90 p-3 rounded-2xl flex items-center gap-3 hover:bg-slate-800 transition-all border border-slate-800/80 group text-left">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 group-hover:scale-110 transition-transform">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-slate-200">Fake Call</div>
                      <div className="text-[10px] text-slate-400">Simulate Call</div>
                    </div>
                  </button>
                </div>

                {/* Feature Tabs */}
                <div className="flex overflow-x-auto gap-2 pb-1 no-scrollbar border-b border-slate-800/80">
                  {[
                    { id: 'emergency', label: 'Emergency Contacts' },
                    { id: 'women', label: 'Women Safety' },
                    { id: 'forest', label: 'GPS Compass' },
                    { id: 'medical', label: 'Medical ID' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-3 py-1.5 rounded-full whitespace-nowrap text-xs font-semibold transition-all ${
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
                <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800/80 min-h-[220px]">
                  {activeTab === 'emergency' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold flex items-center gap-1.5 text-amber-400 uppercase tracking-wider">
                          <AlertTriangle className="w-4 h-4 text-amber-400" /> Speed Dial Helplines
                        </h3>
                        <button
                          onClick={() => setIsAddingContact(!isAddingContact)}
                          className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-lg"
                        >
                          <Plus size={13} /> Add Contact
                        </button>
                      </div>

                      {/* Add Contact Form */}
                      {isAddingContact && (
                        <form onSubmit={handleAddContact} className="bg-slate-900 p-3 rounded-xl border border-rose-500/30 space-y-2 text-xs">
                          <p className="font-semibold text-rose-300 text-xs">Add Personal Emergency Contact</p>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="Name (e.g. Mom)"
                              value={newContactName}
                              onChange={(e) => setNewContactName(e.target.value)}
                              className="bg-slate-950 border border-slate-700 px-2.5 py-1.5 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
                              required
                            />
                            <input
                              type="tel"
                              placeholder="Phone (+91...)"
                              value={newContactPhone}
                              onChange={(e) => setNewContactPhone(e.target.value)}
                              className="bg-slate-950 border border-slate-700 px-2.5 py-1.5 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
                              required
                            />
                          </div>
                          <input
                            type="text"
                            placeholder="Relation (e.g. Parent, Friend)"
                            value={newContactRelation}
                            onChange={(e) => setNewContactRelation(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 px-2.5 py-1.5 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
                          />
                          <div className="flex justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setIsAddingContact(false)}
                              className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-3 py-1 rounded-lg bg-rose-600 text-white font-semibold"
                            >
                              Save
                            </button>
                          </div>
                        </form>
                      )}

                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {contacts.map((contact) => (
                          <div key={contact.id} className="flex items-center justify-between bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                            <div>
                              <div className="font-semibold text-xs text-slate-100">{contact.name}</div>
                              <div className="text-[10px] text-slate-400">{contact.relation} • {contact.phone}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <a href={`tel:${contact.phone}`} className="bg-emerald-600 hover:bg-emerald-500 p-2 rounded-xl text-white shadow">
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                              {contact.id.length > 5 && (
                                <button onClick={() => handleDeleteContact(contact.id)} className="text-slate-500 hover:text-rose-400 p-1">
                                  <Trash2 size={13} />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'women' && (
                    <div className="space-y-3">
                      <div className="bg-rose-500/10 border border-rose-500/30 p-3.5 rounded-xl">
                        <h3 className="text-rose-400 font-bold text-xs uppercase tracking-wider mb-1">Safe Zone Silent Alert</h3>
                        <p className="text-xs text-slate-300 mb-3">Broadcast silent SOS alert to nearby verified volunteers and safe zones.</p>
                        <button 
                          onClick={() => showToast("Silent Alert triggered! Volunteers notified.")}
                          className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 py-2 rounded-xl text-xs font-bold text-white shadow transition-all"
                        >
                          Trigger Silent Alert
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-center text-xs">
                        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                          <div className="text-xl font-bold text-emerald-400">12</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">Verified Safe Zones</div>
                        </div>
                        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                          <div className="text-xl font-bold text-rose-400">1091</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">National Women Helpline</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'forest' && (
                    <div className="space-y-3">
                      <div className="h-36 bg-slate-950 rounded-xl overflow-hidden relative border border-slate-800 shadow-inner">
                        {location ? (
                          <MapContainerComp 
                            key={`${location.lat}-${location.lng}`}
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
                          <div className="flex items-center justify-center h-full text-slate-500 text-xs">
                            Locating GPS...
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between items-center bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-xs">
                        <div className="flex items-center gap-2">
                          <Compass className="w-4 h-4 text-blue-400" />
                          <span className="text-slate-300">Compass Heading</span>
                        </div>
                        <span className="font-mono text-sm font-bold text-blue-400">{Math.round(compassHeading)}°</span>
                      </div>
                    </div>
                  )}

                  {activeTab === 'medical' && (
                    <div className="space-y-3">
                      <div className="bg-rose-500/10 border border-rose-500/30 p-3.5 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-rose-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                            <Stethoscope className="w-4 h-4" /> Emergency Medical ID
                          </h3>
                          <button 
                            onClick={() => setIsEditingMedical(!isEditingMedical)} 
                            className="text-[10px] text-rose-300 underline"
                          >
                            {isEditingMedical ? 'Cancel' : 'Edit'}
                          </button>
                        </div>

                        {isEditingMedical ? (
                          <div className="space-y-2 text-xs">
                            <div>
                              <label className="text-[10px] text-slate-400">Blood Group</label>
                              <input
                                type="text"
                                value={bloodGroup}
                                onChange={(e) => setBloodGroup(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 px-2 py-1 rounded text-white mt-0.5"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-400">Allergies</label>
                              <input
                                type="text"
                                value={allergies}
                                onChange={(e) => setAllergies(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 px-2 py-1 rounded text-white mt-0.5"
                              />
                            </div>
                            <button
                              onClick={handleSaveMedical}
                              className="w-full py-1 bg-rose-600 text-white font-bold rounded text-xs mt-1"
                            >
                              Save Medical Info
                            </button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                              <span className="text-slate-400 block text-[10px]">Blood Group</span>
                              <span className="font-bold text-white text-sm">{bloodGroup}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px]">Allergies</span>
                              <span className="font-bold text-white text-xs">{allergies}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <button 
                        onClick={handleFindHospital}
                        className="w-full bg-blue-600 hover:bg-blue-500 py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 shadow transition-all"
                      >
                        <MapPin className="w-4 h-4" /> Locate Nearest Hospitals (Maps)
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

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
        </>
      )}
    </AnimatePresence>
  );
};

export default SafetyModal;
