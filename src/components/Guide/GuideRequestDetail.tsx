import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Users,
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  DollarSign,
  Clock,
  Star,
} from 'lucide-react';
import type { LocalGuide } from '../../types';

interface RequestDetailState {
  guide: LocalGuide;
  destination?: string;
}

const GuideRequestDetail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as RequestDetailState;
  const guide = state?.guide;

  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    travelers: '1',
    requestType: 'travel_queries' as const,
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!guide) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto text-red-600 mb-3" />
          <h1 className="text-2xl font-bold text-stone-900 mb-2">Guide Not Selected</h1>
          <p className="text-stone-600 mb-4">Please select a guide first</p>
          <button
            onClick={() => navigate('/guides')}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Back to Guides
          </button>
        </div>
      </div>
    );
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.destination.trim()) {
      newErrors.destination = 'Destination is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.endDate) <= new Date(formData.startDate)) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    if (!formData.travelers || parseInt(formData.travelers) < 1) {
      newErrors.travelers = 'Number of travelers must be at least 1';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    if (formData.message.trim().length < 20) {
      newErrors.message = 'Message must be at least 20 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const response = await fetch('/api/guide-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          guideId: guide.id,
          destination: formData.destination,
          startDate: new Date(formData.startDate),
          endDate: new Date(formData.endDate),
          travelers: parseInt(formData.travelers),
          requestType: formData.requestType,
          message: formData.message,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          navigate('/my-trips');
        }, 3000);
      } else {
        const error = await response.json();
        setErrors({ submit: error.message || 'Failed to submit request' });
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      setErrors({ submit: 'An error occurred. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate number of days
  const startDate = formData.startDate ? new Date(formData.startDate) : null;
  const endDate = formData.endDate ? new Date(formData.endDate) : null;
  const days =
    startDate && endDate
      ? Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        )
      : 0;
  const totalCost = days * (guide.pricePerDay || 0) * parseInt(formData.travelers);

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-stone-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 text-center">
          <div className="mb-4 flex justify-center">
            <CheckCircle size={64} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-stone-900 mb-2">Request Sent!</h1>
          <p className="text-stone-600 mb-4">
            Your request has been successfully sent to {guide.name}. They will review
            it and respond shortly.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-800">
              <strong>Expected Response:</strong> {guide.responseTime || '1 hour'}
            </p>
          </div>
          <button
            onClick={() => navigate('/my-trips')}
            className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium transition-colors"
          >
            View My Trips
          </button>
          <p className="text-stone-500 text-sm mt-4">
            Redirecting in a moment...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/guides')}
          className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium mb-6"
        >
          <ArrowLeft size={20} />
          Back to Guides
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h1 className="text-3xl font-bold text-stone-900 mb-2">
                Request {guide.name}
              </h1>
              <p className="text-stone-600 mb-6">
                Provide details about your desired trip and the guide will respond with
                availability and confirmation.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Destination */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    <MapPin size={16} className="inline mr-2" />
                    Destination *
                  </label>
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    placeholder="e.g., Goa, Kerala, Rajasthan"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                      errors.destination ? 'border-red-500' : 'border-stone-300'
                    }`}
                  />
                  {errors.destination && (
                    <p className="text-red-500 text-sm mt-1">{errors.destination}</p>
                  )}
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      <Calendar size={16} className="inline mr-2" />
                      Start Date *
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        errors.startDate ? 'border-red-500' : 'border-stone-300'
                      }`}
                    />
                    {errors.startDate && (
                      <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      <Calendar size={16} className="inline mr-2" />
                      End Date *
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      min={formData.startDate}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        errors.endDate ? 'border-red-500' : 'border-stone-300'
                      }`}
                    />
                    {errors.endDate && (
                      <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
                    )}
                  </div>
                </div>

                {/* Travelers */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    <Users size={16} className="inline mr-2" />
                    Number of Travelers *
                  </label>
                  <select
                    name="travelers"
                    value={formData.travelers}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                      errors.travelers ? 'border-red-500' : 'border-stone-300'
                    }`}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'person' : 'people'}
                      </option>
                    ))}
                  </select>
                  {errors.travelers && (
                    <p className="text-red-500 text-sm mt-1">{errors.travelers}</p>
                  )}
                </div>

                {/* Request Type */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    <MessageSquare size={16} className="inline mr-2" />
                    Request Type
                  </label>
                  <select
                    name="requestType"
                    value={formData.requestType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="travel_queries">Travel Queries</option>
                    <option value="trip_planning">Trip Planning</option>
                    <option value="recommendations">Recommendations</option>
                    <option value="emergency">Emergency Assistance</option>
                    <option value="booking_assistance">Booking Assistance</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    <MessageSquare size={16} className="inline mr-2" />
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell the guide about your interests, preferences, and any special requirements..."
                    rows={5}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none ${
                      errors.message ? 'border-red-500' : 'border-stone-300'
                    }`}
                  />
                  <div className="flex justify-between mt-2">
                    <p className="text-stone-500 text-sm">
                      {formData.message.length} / 500 characters
                    </p>
                    {errors.message && (
                      <p className="text-red-500 text-sm">{errors.message}</p>
                    )}
                  </div>
                </div>

                {/* Error Message */}
                {errors.submit && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
                    <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                    <p>{errors.submit}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? 'Sending...' : 'Send Request'}
                  <Send size={20} />
                </button>
              </form>
            </div>
          </div>

          {/* Guide Summary & Cost Calculator */}
          <div className="space-y-6">
            {/* Guide Card */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden sticky top-4">
              <div className="h-32 bg-gradient-to-r from-teal-400 to-blue-500 relative">
                <img
                  src={guide.profileImage}
                  alt={guide.name}
                  className="w-full h-full object-cover opacity-50"
                />
              </div>

              <div className="p-6">
                <h2 className="text-xl font-bold text-stone-900">{guide.name}</h2>

                <div className="flex items-center gap-2 mt-2 text-yellow-500">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < Math.floor(guide.rating)
                            ? 'fill-yellow-500'
                            : 'opacity-30'
                        }
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-stone-700">
                    {guide.rating}
                  </span>
                </div>

                <p className="text-stone-600 text-sm mt-3">{guide.bio}</p>

                <div className="mt-4 space-y-2 border-t border-stone-200 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-600">Daily Rate:</span>
                    <span className="font-semibold text-stone-900">
                      ₹{guide.pricePerDay?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-600 flex items-center gap-1">
                      <Clock size={14} />
                      Response Time:
                    </span>
                    <span className="font-semibold text-stone-900">
                      {guide.responseTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cost Calculator */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="font-bold text-stone-900 mb-4 flex items-center gap-2">
                <DollarSign size={20} className="text-teal-600" />
                Cost Estimate
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-600">Daily Rate:</span>
                  <span className="font-semibold">
                    ₹{guide.pricePerDay?.toLocaleString() || 0}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-stone-600">Number of Days:</span>
                  <span className="font-semibold">{days || 0}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-stone-600">Number of Travelers:</span>
                  <span className="font-semibold">{formData.travelers}</span>
                </div>

                <div className="border-t border-stone-200 pt-3 flex justify-between">
                  <span className="font-bold text-stone-900">Total Estimated Cost:</span>
                  <span className="font-bold text-teal-600 text-lg">
                    ₹{totalCost.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
                <p>
                  <strong>Note:</strong> This is an estimate. The final cost may vary
                  based on activities and arrangements with the guide.
                </p>
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg shadow-lg p-6 border border-teal-200">
              <h3 className="font-bold text-teal-900 mb-3">What Happens Next?</h3>
              <ol className="space-y-2 text-sm text-teal-800 list-decimal list-inside">
                <li>Your request will be reviewed</li>
                <li>Guide confirms availability</li>
                <li>Payment arrangement confirmed</li>
                <li>Trip details finalized</li>
                <li>Enjoy your guided tour!</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideRequestDetail;
