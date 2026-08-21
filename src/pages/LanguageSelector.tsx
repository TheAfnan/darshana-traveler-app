import { AlertCircle, Check, Globe, Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { languageApi } from '../services/api';

interface Language {
  code: string;
  name: string;
}

const LanguageSelector: React.FC = () => {
  const { isAuthenticated, user, updateUser } = useAuth();
  const { i18n } = useTranslation();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState(
    user?.preferredLanguage || localStorage.getItem('language') || 'en'
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    i18n.changeLanguage(selectedLanguage);
    localStorage.setItem('language', selectedLanguage);
  }, [selectedLanguage, i18n]);

  useEffect(() => {
    const fetchLanguages = async () => {
      setIsLoading(true);
      try {
        const response = await languageApi.getAvailableLanguages();
        if (response.success && response.data) {
          const data = response.data as any;
          setLanguages(data.languages || []);
        } else {
          setError((response as any).error || 'Failed to fetch languages');
        }

        // If authenticated, refresh the language from the backend profile
        if (isAuthenticated) {
          const langRes = await languageApi.getUserLanguage();
          if (langRes.success && langRes.data) {
            const data = langRes.data as any;
            if (data.language) {
              setSelectedLanguage(data.language);
              updateUser({ preferredLanguage: data.language });
            }
          }
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch languages');
      } finally {
        if (user?.preferredLanguage) {
          setSelectedLanguage(user.preferredLanguage);
        } else {
          const stored = localStorage.getItem('language');
          if (stored) {
            setSelectedLanguage(stored);
          }
        }
        setIsLoading(false);
      }
    };

    fetchLanguages();
  }, [user?.preferredLanguage]);

  const handleLanguageChange = async (languageCode: string) => {
    setIsSaving(true);
    setError('');

    // Change the UI language immediately
    setSelectedLanguage(languageCode);

    // Persist to backend only if the user is logged in; otherwise keep local change
    if (isAuthenticated) {
      const response = await languageApi.updateUserLanguage(languageCode);
      if (response.success) {
        updateUser({ preferredLanguage: languageCode });
      } else {
        setError((response as any).error || 'Failed to update language');
      }
    }

    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <Loader size={40} className="animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Language Preferences</h1>
          <p className="text-gray-600">Choose your preferred language for the app</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle size={24} className="text-red-600 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Language Grid */}
        <div className="bg-white rounded-xl shadow p-8">
          <div className="space-y-3">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                disabled={isSaving}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  selectedLanguage === language.code
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe size={20} className="text-green-600" />
                    <div>
                      <p className="font-semibold text-gray-900">{language.name}</p>
                      <p className="text-sm text-gray-600">{language.code.toUpperCase()}</p>
                    </div>
                  </div>
                  {selectedLanguage === language.code && (
                    <Check size={24} className="text-green-600" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-2">About Language Settings</h3>
          <ul className="text-blue-800 text-sm space-y-2">
            <li>• Your language preference is saved automatically</li>
            <li>• The app interface will update to your selected language</li>
            <li>• All notifications and emails will be sent in your preferred language</li>
            <li>• You can change this anytime from your profile settings</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
