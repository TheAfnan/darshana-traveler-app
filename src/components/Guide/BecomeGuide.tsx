import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  DollarSign,
  FileText,
  Check,
  ArrowRight,
  Upload,
  AlertCircle,
  Briefcase,
  Globe,
  Award,
} from 'lucide-react';
import { getBackendUrl } from '../../config/api';
import type { GuideRegistration } from '../../types';

const BecomeGuide: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<Partial<GuideRegistration>>({
    specialties: [],
    languages: [],
    certifications: [],
    availability: 'available',
  });

  const specialtyOptions = [
    'Beach Tourism',
    'Mountain Trekking',
    'Cultural Tours',
    'Adventure Sports',
    'Wildlife Safari',
    'Historical Sites',
    'Food & Cuisine',
    'Photography',
    'Backpacking',
    'Family Tours',
    'Solo Travel',
    'Business Tours',
  ];

  const languageOptions = [
    'English',
    'Hindi',
    'Spanish',
    'French',
    'German',
    'Mandarin',
    'Japanese',
    'Bengali',
    'Tamil',
    'Telugu',
    'Marathi',
    'Gujarati',
  ];

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 1:
        if (!formData.fullName?.trim())
          newErrors.fullName = 'Full name is required';
        if (!formData.email?.trim() || !/\S+@\S+\.\S+/.test(formData.email))
          newErrors.email = 'Valid email is required';
        if (
          !formData.phone?.trim() ||
          !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))
        )
          newErrors.phone = 'Valid 10-digit phone number is required';
        if (!formData.location?.trim()) newErrors.location = 'Location is required';
        break;

      case 2:
        if (!formData.specialties || formData.specialties.length === 0)
          newErrors.specialties = 'Select at least one specialty';
        if (!formData.languages || formData.languages.length === 0)
          newErrors.languages = 'Select at least one language';
        if (!formData.bio?.trim() || formData.bio.length < 50)
          newErrors.bio = 'Bio must be at least 50 characters';
        break;

      case 3:
        if (!formData.pricePerDay || formData.pricePerDay <= 0)
          newErrors.pricePerDay = 'Valid daily rate is required';
        if (!formData.experience || formData.experience < 0)
          newErrors.experience = 'Years of experience is required';
        break;

      case 4:
        if (!formData.documents?.idProof)
          newErrors.idProof = 'ID proof is required';
        if (!formData.documents?.backgroundCheck)
          newErrors.backgroundCheck = 'Background check document is required';
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => (prev === 4 ? 5 : (prev + 1) as any));
    }
  };

  const handlePrevious = () => {
    setStep((prev) => (prev > 1 ? (prev - 1) as any : prev));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'number'
          ? parseFloat(value)
          : type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData((prev) => {
      const specialties = prev.specialties || [];
      return {
        ...prev,
        specialties: specialties.includes(specialty)
          ? specialties.filter((s) => s !== specialty)
          : [...specialties, specialty],
      };
    });
    if (errors.specialties) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.specialties;
        return newErrors;
      });
    }
  };

  const handleLanguageToggle = (language: string) => {
    setFormData((prev) => {
      const languages = prev.languages || [];
      return {
        ...prev,
        languages: languages.includes(language)
          ? languages.filter((l) => l !== language)
          : [...languages, language],
      };
    });
    if (errors.languages) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.languages;
        return newErrors;
      });
    }
  };

  const handleCertificationToggle = (cert: string) => {
    setFormData((prev) => {
      const certifications = prev.certifications || [];
      return {
        ...prev,
        certifications: certifications.includes(cert)
          ? certifications.filter((c) => c !== cert)
          : [...certifications, cert],
      };
    });
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'idProof' | 'backgroundCheck'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev: Partial<GuideRegistration>) => ({
        ...prev,
        documents: {
          idProof: prev.documents?.idProof || '',
          backgroundCheck: prev.documents?.backgroundCheck || '',
          [field]: file,
        },
      }));
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    try {
      const formDataObj = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === 'documents') {
          const docs = formData.documents;
          if (docs?.idProof) formDataObj.append('idProof', docs.idProof);
          if (docs?.backgroundCheck)
            formDataObj.append('backgroundCheck', docs.backgroundCheck);
        } else if (key === 'specialties' || key === 'languages' || key === 'certifications') {
          formDataObj.append(key, JSON.stringify(formData[key as keyof typeof formData]));
        } else {
          formDataObj.append(
            key,
            String(formData[key as keyof typeof formData] || '')
          );
        }
      });

      const response = await fetch(`${getBackendUrl()}/api/guides/register`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: formDataObj,
      });

      if (response.ok) {
        setSuccessMessage('Registration successful! Your profile is under review.');
        setTimeout(() => {
          navigate('/guides');
        }, 2000);
      } else {
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const error = await response.json();
            setErrors({ submit: error.message || 'Registration failed' });
          } else {
            setErrors({ submit: `Registration failed: ${response.statusText}` });
          }
        } catch (parseError) {
          setErrors({ submit: `Registration failed with status ${response.status}` });
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ submit: error instanceof Error ? error.message : 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 1: Basic Information
  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-stone-800 flex items-center gap-2">
        <FileText size={24} className="text-teal-600" />
        Basic Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName || ''}
            onChange={handleInputChange}
            placeholder="Your full name"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
              errors.fullName ? 'border-red-500' : 'border-stone-300'
            }`}
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={handleInputChange}
            placeholder="your.email@example.com"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
              errors.email ? 'border-red-500' : 'border-stone-300'
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Phone *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone || ''}
            onChange={handleInputChange}
            placeholder="+91 87918 98194"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
              errors.phone ? 'border-red-500' : 'border-stone-300'
            }`}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            <MapPin size={16} className="inline mr-2" />
            Primary Location *
          </label>
          <input
            type="text"
            name="location"
            value={formData.location || ''}
            onChange={handleInputChange}
            placeholder="e.g., Goa, Kerala, Rajasthan"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
              errors.location ? 'border-red-500' : 'border-stone-300'
            }`}
          />
          {errors.location && (
            <p className="text-red-500 text-sm mt-1">{errors.location}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Availability Status
        </label>
        <select
          name="availability"
          value={formData.availability || 'available'}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
          <option value="on_leave">On Leave</option>
        </select>
      </div>
    </div>
  );

  // Step 2: Expertise & Languages
  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-stone-800 flex items-center gap-2">
        <Briefcase size={24} className="text-teal-600" />
        Expertise & Languages
      </h3>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-3">
          Specialties (Select at least 3) *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {specialtyOptions.map((specialty) => (
            <button
              key={specialty}
              onClick={() => handleSpecialtyToggle(specialty)}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                formData.specialties?.includes(specialty)
                  ? 'border-teal-600 bg-teal-50 text-teal-700 font-medium'
                  : 'border-stone-300 bg-white text-stone-700 hover:border-teal-300'
              }`}
            >
              {specialty}
            </button>
          ))}
        </div>
        {errors.specialties && (
          <p className="text-red-500 text-sm mt-2">{errors.specialties}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-3">
          Languages You Speak (Select at least 2) *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {languageOptions.map((language) => (
            <button
              key={language}
              onClick={() => handleLanguageToggle(language)}
              className={`px-4 py-2 rounded-lg border-2 transition-all flex items-center gap-2 ${
                formData.languages?.includes(language)
                  ? 'border-teal-600 bg-teal-50 text-teal-700 font-medium'
                  : 'border-stone-300 bg-white text-stone-700 hover:border-teal-300'
              }`}
            >
              <Globe size={16} />
              {language}
            </button>
          ))}
        </div>
        {errors.languages && (
          <p className="text-red-500 text-sm mt-2">{errors.languages}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Professional Bio (minimum 50 characters) *
        </label>
        <textarea
          name="bio"
          value={formData.bio || ''}
          onChange={handleInputChange}
          placeholder="Tell travelers about your experience, background, and what makes you a great guide..."
          rows={5}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
            errors.bio ? 'border-red-500' : 'border-stone-300'
          }`}
        />
        <p className="text-stone-500 text-sm mt-1">
          {formData.bio?.length || 0} / 500 characters
        </p>
        {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-3">
          Certifications (Optional)
        </label>
        <div className="space-y-2">
          {[
            'First Aid Certified',
            'Wildlife Expert',
            'Cultural Heritage Guide',
            'Adventure Sports Certified',
            'Photography Certified',
            'Hospitality Management',
          ].map((cert) => (
            <button
              key={cert}
              onClick={() => handleCertificationToggle(cert)}
              className={`w-full text-left px-4 py-2 rounded-lg border-2 transition-all flex items-center gap-3 ${
                formData.certifications?.includes(cert)
                  ? 'border-teal-600 bg-teal-50 text-teal-700'
                  : 'border-stone-300 bg-white text-stone-700 hover:border-teal-300'
              }`}
            >
              <Award size={18} />
              {cert}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Step 3: Pricing & Experience
  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-stone-800 flex items-center gap-2">
        <DollarSign size={24} className="text-teal-600" />
        Pricing & Experience
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Daily Rate (₹) *
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-600">
              ₹
            </span>
            <input
              type="number"
              name="pricePerDay"
              value={formData.pricePerDay || ''}
              onChange={handleInputChange}
              placeholder="2000"
              min="500"
              max="50000"
              className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                errors.pricePerDay ? 'border-red-500' : 'border-stone-300'
              }`}
            />
          </div>
          {errors.pricePerDay && (
            <p className="text-red-500 text-sm mt-1">{errors.pricePerDay}</p>
          )}
          <p className="text-stone-500 text-sm mt-1">
            Recommended: ₹1,500 - ₹5,000 per day
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Years of Experience *
          </label>
          <input
            type="number"
            name="experience"
            value={formData.experience || ''}
            onChange={handleInputChange}
            placeholder="5"
            min="0"
            max="60"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
              errors.experience ? 'border-red-500' : 'border-stone-300'
            }`}
          />
          {errors.experience && (
            <p className="text-red-500 text-sm mt-1">{errors.experience}</p>
          )}
        </div>
      </div>

      <div className="bg-teal-50 border-l-4 border-teal-600 p-4 rounded">
        <h4 className="font-semibold text-teal-900 mb-2 flex items-center gap-2">
          <AlertCircle size={18} />
          Pricing Guidelines
        </h4>
        <ul className="text-sm text-teal-800 space-y-1 ml-6 list-disc">
          <li>Budget guides: ₹500 - ₹1,500/day</li>
          <li>Standard guides: ₹1,500 - ₹3,500/day</li>
          <li>Premium guides: ₹3,500 - ₹8,000/day</li>
          <li>Expert/Specialist: ₹8,000+/day</li>
        </ul>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Response Time Preference
        </label>
        <select
          name="responseTime"
          value={formData.responseTime || '1 hour'}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="15 minutes">15 minutes</option>
          <option value="30 minutes">30 minutes</option>
          <option value="1 hour">1 hour</option>
          <option value="4 hours">4 hours</option>
          <option value="24 hours">24 hours</option>
        </select>
      </div>
    </div>
  );

  // Step 4: Documents
  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-stone-800 flex items-center gap-2">
        <Upload size={24} className="text-teal-600" />
        Verification Documents
      </h3>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded mb-6">
        <h4 className="font-semibold text-blue-900 mb-2">Required Documents</h4>
        <p className="text-sm text-blue-800">
          Upload clear copies of your government-issued ID and background check
          documents. These are required for verification.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          ID Proof (Passport/Aadhar/License) *
        </label>
        <div className="border-2 border-dashed border-stone-300 rounded-lg p-6 text-center hover:border-teal-600 transition-colors cursor-pointer"
          onClick={() => document.getElementById('idProofInput')?.click()}
        >
          <Upload size={32} className="mx-auto text-stone-400 mb-2" />
          <p className="text-stone-600 font-medium">
            {formData.documents?.idProof
              ? (formData.documents.idProof as any).name ||
                'Document selected'
              : 'Click to upload or drag and drop'}
          </p>
          <p className="text-stone-500 text-sm">PNG, JPG or PDF (Max. 5MB)</p>
          <input
            id="idProofInput"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileUpload(e, 'idProof')}
            className="hidden"
          />
        </div>
        {errors.idProof && (
          <p className="text-red-500 text-sm mt-2">{errors.idProof}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Background Check Certificate *
        </label>
        <div className="border-2 border-dashed border-stone-300 rounded-lg p-6 text-center hover:border-teal-600 transition-colors cursor-pointer"
          onClick={() =>
            document.getElementById('backgroundCheckInput')?.click()
          }
        >
          <Upload size={32} className="mx-auto text-stone-400 mb-2" />
          <p className="text-stone-600 font-medium">
            {formData.documents?.backgroundCheck
              ? (formData.documents.backgroundCheck as any).name ||
                'Document selected'
              : 'Click to upload or drag and drop'}
          </p>
          <p className="text-stone-500 text-sm">PNG, JPG or PDF (Max. 5MB)</p>
          <input
            id="backgroundCheckInput"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileUpload(e, 'backgroundCheck')}
            className="hidden"
          />
        </div>
        {errors.backgroundCheck && (
          <p className="text-red-500 text-sm mt-2">{errors.backgroundCheck}</p>
        )}
      </div>
    </div>
  );

  // Step 5: Review & Submit
  const renderStep5 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-stone-800 flex items-center gap-2">
        <Check size={24} className="text-teal-600" />
        Review Your Information
      </h3>

      <div className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-stone-600 text-sm">Full Name</p>
            <p className="font-semibold text-stone-900">{formData.fullName}</p>
          </div>
          <div>
            <p className="text-stone-600 text-sm">Email</p>
            <p className="font-semibold text-stone-900">{formData.email}</p>
          </div>
          <div>
            <p className="text-stone-600 text-sm">Phone</p>
            <p className="font-semibold text-stone-900">{formData.phone}</p>
          </div>
          <div>
            <p className="text-stone-600 text-sm">Location</p>
            <p className="font-semibold text-stone-900">{formData.location}</p>
          </div>
          <div>
            <p className="text-stone-600 text-sm">Daily Rate</p>
            <p className="font-semibold text-teal-700">₹{formData.pricePerDay}</p>
          </div>
          <div>
            <p className="text-stone-600 text-sm">Experience</p>
            <p className="font-semibold text-stone-900">
              {formData.experience} years
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-teal-200">
          <p className="text-stone-600 text-sm mb-2">Specialties</p>
          <div className="flex flex-wrap gap-2">
            {formData.specialties?.map((s) => (
              <span
                key={s}
                className="bg-teal-600 text-white px-3 py-1 rounded-full text-sm"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-stone-600 text-sm mb-2">Languages</p>
          <div className="flex flex-wrap gap-2">
            {formData.languages?.map((l) => (
              <span
                key={l}
                className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm"
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
        <h4 className="font-semibold text-green-900 mb-2">What Happens Next?</h4>
        <ul className="text-sm text-green-800 space-y-2 ml-4 list-disc">
          <li>
            Your documents will be reviewed within 48 hours
          </li>
          <li>
            Once verified, your profile will be published and visible to travelers
          </li>
          <li>
            You'll receive booking requests and can accept or decline them
          </li>
          <li>
            Earnings are transferred to your account weekly
          </li>
        </ul>
      </div>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}

      {errors.submit && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {errors.submit}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-2">
            Become a Local Guide
          </h1>
          <p className="text-stone-600">
            Share your expertise and earn by guiding travelers
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`flex flex-col items-center flex-1 ${s < 5 ? 'relative' : ''}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    s < step
                      ? 'bg-green-600 text-white'
                      : s === step
                      ? 'bg-teal-600 text-white ring-4 ring-teal-200'
                      : 'bg-stone-300 text-stone-600'
                  }`}
                >
                  {s < step ? <Check size={20} /> : s}
                </div>
                <p className="text-xs text-stone-600 mt-2 text-center">
                  {['Info', 'Expertise', 'Pricing', 'Docs', 'Review'][s - 1]}
                </p>

                {s < 5 && (
                  <div
                    className={`absolute top-5 left-1/2 w-full h-1 ${
                      s < step ? 'bg-green-600' : 'bg-stone-300'
                    }`}
                    style={{ width: 'calc(100% - 20px)', marginLeft: '20px' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4">
          <button
            onClick={handlePrevious}
            disabled={step === 1}
            className="px-6 py-3 border-2 border-stone-300 text-stone-700 rounded-lg font-medium hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          {step < 5 ? (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 flex items-center gap-2 transition-colors"
            >
              Next
              <ArrowRight size={20} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
              <Check size={20} />
            </button>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-stone-50 rounded-lg p-6 border border-stone-200">
          <h3 className="font-semibold text-stone-900 mb-3">Need Help?</h3>
          <p className="text-stone-600 text-sm mb-3">
            If you have any questions about the registration process, please contact our support team.
          </p>
          <a
            href="mailto:guides@darshana.travel"
            className="text-teal-600 hover:text-teal-700 font-medium text-sm"
          >
            guides@darshana.travel
          </a>
        </div>
      </div>
    </div>
  );
};

export default BecomeGuide;
