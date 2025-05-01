import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useServiceRequest } from '../../contexts/ServiceRequestContext';

const ServiceRequestForm: React.FC = () => {
  const [formData, setFormData] = useState({
    description: '',
    location: '',
    contact: '',
    category: 'plumbing' as const,
    priority: 'medium' as const
  });
  const [formError, setFormError] = useState('');
  const { createRequest, loading, error } = useServiceRequest();
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.description || !formData.location || !formData.contact) {
      setFormError('Wszystkie pola są wymagane');
      return false;
    }

    if (formData.description.length < 10) {
      setFormError('Opis musi mieć minimum 10 znaków');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!validateForm()) {
      return;
    }

    try {
      await createRequest(formData);
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by the context
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Nowe zgłoszenie
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="description" className="sr-only">
                Opis problemu
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Opisz swój problem"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="location" className="sr-only">
                Lokalizacja
              </label>
              <input
                id="location"
                name="location"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Adres"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="contact" className="sr-only">
                Kontakt
              </label>
              <input
                id="contact"
                name="contact"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Numer telefonu"
                value={formData.contact}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="category" className="sr-only">
                Kategoria
              </label>
              <select
                id="category"
                name="category"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="plumbing">Hydraulika</option>
                <option value="electrical">Elektryka</option>
                <option value="carpentry">Stolarstwo</option>
                <option value="painting">Malowanie</option>
                <option value="cleaning">Sprzątanie</option>
                <option value="other">Inne</option>
              </select>
            </div>
            <div>
              <label htmlFor="priority" className="sr-only">
                Priorytet
              </label>
              <select
                id="priority"
                name="priority"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Niski</option>
                <option value="medium">Średni</option>
                <option value="high">Wysoki</option>
              </select>
            </div>
          </div>

          {(formError || error) && (
            <div className="text-red-500 text-sm text-center">
              {formError || error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Wysyłanie...' : 'Wyślij zgłoszenie'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceRequestForm; 