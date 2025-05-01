import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useServiceRequest } from '../../contexts/ServiceRequestContext';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const ServiceRequestDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [request, setRequest] = useState<any>(null);
  const { getRequest, loading, error, updateRequest } = useServiceRequest();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequest = async () => {
      if (id) {
        try {
          const data = await getRequest(id);
          setRequest(data);
        } catch (err) {
          // Error is handled by the context
        }
      }
    };
    fetchRequest();
  }, [id, getRequest]);

  const handleStatusUpdate = async (newStatus: 'InProgress' | 'Completed' | 'Cancelled') => {
    if (!id) return;
    try {
      await updateRequest(id, { status: newStatus });
      const updatedRequest = await getRequest(id);
      setRequest(updatedRequest);
    } catch (err) {
      // Error is handled by the context
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800';
      case 'InProgress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'plumbing':
        return 'Hydraulika';
      case 'electrical':
        return 'Elektryka';
      case 'carpentry':
        return 'Stolarstwo';
      case 'painting':
        return 'Malowanie';
      case 'cleaning':
        return 'Sprzątanie';
      case 'other':
        return 'Inne';
      default:
        return category;
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return <ErrorMessage message={error} fullScreen onRetry={() => id && getRequest(id)} />;
  }

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Nie znaleziono zgłoszenia</h1>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Wróć do listy zgłoszeń
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-12 px-2 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Szczegóły zgłoszenia
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  ID: {request._id}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(request.priority)}`}>
                  {request.priority === 'high' ? 'Wysoki' : request.priority === 'medium' ? 'Średni' : 'Niski'} priorytet
                </span>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
                  {request.status === 'New' ? 'Nowe' : request.status === 'InProgress' ? 'W trakcie' : request.status === 'Completed' ? 'Zakończone' : 'Anulowane'}
                </span>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Kategoria
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {getCategoryLabel(request.category)}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Opis
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {request.description}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Lokalizacja
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {request.location}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Kontakt
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {request.contact}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Data utworzenia
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date(request.createdAt).toLocaleString('pl-PL')}
                </dd>
              </div>
            </dl>
          </div>
          {user?.role === 'handyman' && request.status === 'New' && (
            <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => handleStatusUpdate('InProgress')}
                  className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  Rozpocznij pracę
                </button>
                <button
                  onClick={() => handleStatusUpdate('Cancelled')}
                  className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Anuluj
                </button>
              </div>
            </div>
          )}
          {user?.role === 'handyman' && request.status === 'InProgress' && (
            <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => handleStatusUpdate('Completed')}
                  className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Zakończ
                </button>
                <button
                  onClick={() => handleStatusUpdate('Cancelled')}
                  className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Anuluj
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Wróć do listy zgłoszeń
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceRequestDetails; 