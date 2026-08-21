import React, { useState } from 'react';
import type { TransportType, TravelerDetail } from '../../types';
import { MapPin, Users, CreditCard, CheckCircle } from 'lucide-react';

const TripBooking: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedDestination, setSelectedDestination] = useState('');
  const [selectedTransport, setSelectedTransport] = useState<TransportType | ''>('');
  const [travelers, setTravelers] = useState<TravelerDetail[]>([
    {
      fullName: '',
      email: '',
      phone: '',
      age: 0,
      documentType: 'passport',
      documentNumber: '',
    },
  ]);
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    totalCost: 0,
  });

  const destinations = [
    { id: '1', name: 'Goa', country: 'India', cost: 25000 },
    { id: '2', name: 'Kerala', country: 'India', cost: 30000 },
    { id: '3', name: 'Rajasthan', country: 'India', cost: 35000 },
    { id: '4', name: 'Paris', country: 'France', cost: 80000 },
    { id: '5', name: 'Tokyo', country: 'Japan', cost: 100000 },
  ];

  const transportOptions: TransportType[] = ['Plane', 'Train', 'Bus', 'Ship', 'Bike', 'Car'];

  const handleAddTraveler = () => {
    setTravelers([
      ...travelers,
      {
        fullName: '',
        email: '',
        phone: '',
        age: 0,
        documentType: 'passport',
        documentNumber: '',
      },
    ]);
  };

  const handleRemoveTraveler = (index: number) => {
    setTravelers(travelers.filter((_, i) => i !== index));
  };

  const handleTravelerChange = (index: number, field: string, value: any) => {
    const updatedTravelers = [...travelers];
    updatedTravelers[index] = {
      ...updatedTravelers[index],
      [field]: value,
    };
    setTravelers(updatedTravelers);
  };

  const calculateTotalCost = () => {
    const destination = destinations.find((d) => d.id === selectedDestination);
    const baseCost = destination?.cost || 0;
    const transportCost = selectedTransport === 'Plane' ? 15000 : 5000;
    const totalPersons = travelers.length;
    return (baseCost + transportCost) * totalPersons;
  };

  const validateStep = (stepNum: number): boolean => {
    if (stepNum === 1) {
      return selectedDestination !== '' && selectedTransport !== '';
    } else if (stepNum === 2) {
      return (
        bookingData.startDate !== '' &&
        bookingData.endDate !== '' &&
        new Date(bookingData.endDate) > new Date(bookingData.startDate)
      );
    } else if (stepNum === 3) {
      return travelers.every(
        (t) =>
          t.fullName.trim() &&
          t.email.trim() &&
          t.phone.trim() &&
          t.age > 0 &&
          t.documentNumber.trim()
      );
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      if (step === 3) {
        setBookingData((prev) => ({
          ...prev,
          totalCost: calculateTotalCost(),
        }));
      }
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    setStep(Math.max(1, step - 1));
  };

  const handleProcessPayment = async () => {
    // Simulate payment processing
    // Payment logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <div key={s} className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    s <= step
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {s}
                </div>
                <p className="text-xs text-gray-600 mt-2 text-center">
                  {['Destination', 'Dates', 'Travelers', 'Confirm', 'Payment', 'Success'][s - 1]}
                </p>
              </div>
            ))}
          </div>
          <div className="h-1 bg-gray-300 rounded">
            <div
              className="h-1 bg-blue-600 rounded transition-all"
              style={{ width: `${(step / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Destination & Transport */}
        {step === 1 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              <MapPin className="inline mr-2" size={28} />
              Select Destination & Transport
            </h2>

            {/* Destination Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Choose Destination *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {destinations.map((dest) => (
                  <button
                    key={dest.id}
                    onClick={() => setSelectedDestination(dest.id)}
                    className={`p-4 border-2 rounded-lg transition text-left ${
                      selectedDestination === dest.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    <p className="font-semibold text-gray-800">{dest.name}</p>
                    <p className="text-sm text-gray-600">{dest.country}</p>
                    <p className="text-sm font-bold text-blue-600 mt-1">
                      ₹{dest.cost.toLocaleString()}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Transport Selection */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Choose Transport *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {transportOptions.map((transport) => (
                  <button
                    key={transport}
                    onClick={() => setSelectedTransport(transport)}
                    className={`p-4 border-2 rounded-lg transition font-medium ${
                      selectedTransport === transport
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-300 text-gray-700 hover:border-blue-400'
                    }`}
                  >
                    {transport}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleNextStep}
              disabled={!validateStep(1)}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Dates */}
        {step === 2 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              <MapPin className="inline mr-2" size={28} />
              Select Travel Dates
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={bookingData.startDate}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, startDate: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  value={bookingData.endDate}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, endDate: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handlePreviousStep}
                className="flex-1 bg-gray-400 text-white font-semibold py-3 rounded-lg hover:bg-gray-500 transition"
              >
                Back
              </button>
              <button
                onClick={handleNextStep}
                disabled={!validateStep(2)}
                className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Traveler Details */}
        {step === 3 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              <Users className="inline mr-2" size={28} />
              Traveler Details
            </h2>

            <div className="space-y-6 mb-8">
              {travelers.map((traveler, index) => (
                <div
                  key={index}
                  className="border border-gray-300 rounded-lg p-6 relative"
                >
                  {travelers.length > 1 && (
                    <button
                      onClick={() => handleRemoveTraveler(index)}
                      className="absolute top-4 right-4 text-red-600 hover:text-red-800"
                    >
                      ✕
                    </button>
                  )}
                  <h3 className="font-semibold text-gray-800 mb-4">Traveler {index + 1}</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={traveler.fullName}
                      onChange={(e) =>
                        handleTravelerChange(index, 'fullName', e.target.value)
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="email"
                      placeholder="Email *"
                      value={traveler.email}
                      onChange={(e) =>
                        handleTravelerChange(index, 'email', e.target.value)
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="tel"
                      placeholder="Phone *"
                      value={traveler.phone}
                      onChange={(e) =>
                        handleTravelerChange(index, 'phone', e.target.value)
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Age *"
                      value={traveler.age}
                      onChange={(e) =>
                        handleTravelerChange(index, 'age', parseInt(e.target.value))
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={traveler.documentType}
                      onChange={(e) =>
                        handleTravelerChange(
                          index,
                          'documentType',
                          e.target.value as any
                        )
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="passport">Passport</option>
                      <option value="aadhar">Aadhar</option>
                      <option value="license">License</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Document Number *"
                      value={traveler.documentNumber}
                      onChange={(e) =>
                        handleTravelerChange(index, 'documentNumber', e.target.value)
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleAddTraveler}
              className="w-full mb-6 border-2 border-dashed border-blue-400 text-blue-600 font-semibold py-3 rounded-lg hover:bg-blue-50 transition"
            >
              + Add Another Traveler
            </button>

            <div className="flex gap-3">
              <button
                onClick={handlePreviousStep}
                className="flex-1 bg-gray-400 text-white font-semibold py-3 rounded-lg hover:bg-gray-500 transition"
              >
                Back
              </button>
              <button
                onClick={handleNextStep}
                disabled={!validateStep(3)}
                className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Booking Confirmation */}
        {step === 4 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Booking Confirmation</h2>

            <div className="space-y-4 mb-8">
              <div className="border border-gray-300 rounded-lg p-4">
                <p className="text-sm text-gray-600">Destination</p>
                <p className="font-semibold text-lg text-gray-800">
                  {destinations.find((d) => d.id === selectedDestination)?.name}
                </p>
              </div>
              <div className="border border-gray-300 rounded-lg p-4">
                <p className="text-sm text-gray-600">Transport</p>
                <p className="font-semibold text-lg text-gray-800">{selectedTransport}</p>
              </div>
              <div className="border border-gray-300 rounded-lg p-4">
                <p className="text-sm text-gray-600">Travel Dates</p>
                <p className="font-semibold text-lg text-gray-800">
                  {bookingData.startDate} to {bookingData.endDate}
                </p>
              </div>
              <div className="border border-gray-300 rounded-lg p-4">
                <p className="text-sm text-gray-600">Number of Travelers</p>
                <p className="font-semibold text-lg text-gray-800">{travelers.length}</p>
              </div>
              <div className="border-2 border-blue-600 rounded-lg p-4 bg-blue-50">
                <p className="text-sm text-gray-600">Total Cost</p>
                <p className="font-bold text-2xl text-blue-600">
                  ₹{calculateTotalCost().toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handlePreviousStep}
                className="flex-1 bg-gray-400 text-white font-semibold py-3 rounded-lg hover:bg-gray-500 transition"
              >
                Back
              </button>
              <button
                onClick={handleNextStep}
                className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Payment */}
        {step === 5 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              <CreditCard className="inline mr-2" size={28} />
              Payment
            </h2>

            <div className="bg-blue-50 border border-blue-300 rounded-lg p-6 mb-6">
              <p className="text-sm text-gray-600">Amount to Pay</p>
              <p className="font-bold text-3xl text-blue-600 mt-2">
                ₹{calculateTotalCost().toLocaleString()}
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handlePreviousStep}
                className="flex-1 bg-gray-400 text-white font-semibold py-3 rounded-lg hover:bg-gray-500 transition"
              >
                Back
              </button>
              <button
                onClick={handleProcessPayment}
                className="flex-1 bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition"
              >
                Complete Payment
              </button>
            </div>

            <p className="text-center text-gray-500 text-sm mt-6">
              This is a demo payment. Your card information is secure.
            </p>
          </div>
        )}

        {/* Step 6: Success */}
        {step === 6 && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle size={64} className="text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Booking Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your trip has been booked successfully. A confirmation email has been sent
              to your registered email address.
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <p className="text-sm text-gray-600 mb-2">Booking Reference</p>
              <p className="font-bold text-xl text-gray-800 font-mono">
                DB-{Math.random().toString(36).substr(2, 9).toUpperCase()}
              </p>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Destination</p>
                    <p className="font-semibold text-gray-800">
                      {destinations.find((d) => d.id === selectedDestination)?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Cost</p>
                    <p className="font-bold text-blue-600">
                      ₹{calculateTotalCost().toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => window.location.href = '/dashboard'}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripBooking;
