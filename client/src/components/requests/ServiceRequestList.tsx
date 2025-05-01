import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useServiceRequest } from '../../contexts/ServiceRequestContext';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

interface Filters {
  status: string;
  category: string;
  priority: string;
  search: string;
}

const ITEMS_PER_PAGE = 10;

const ServiceRequestList: React.FC = () => {
  const { requests, getRequests, loading, error } = useServiceRequest();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Filters>({
    status: '',
    category: '',
    priority: '',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getRequests();
  }, [getRequests]);

  useEffect(() => {
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [filters]);

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

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredRequests = requests.filter(request => {
    const matchesStatus = !filters.status || request.status === filters.status;
    const matchesCategory = !filters.category || request.category === filters.category;
    const matchesPriority = !filters.priority || request.priority === filters.priority;
    const matchesSearch = !filters.search || 
      request.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      request.location.toLowerCase().includes(filters.search.toLowerCase()) ||
      request.contact.toLowerCase().includes(filters.search.toLowerCase());

    return matchesStatus && matchesCategory && matchesPriority && matchesSearch;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedRequests = filteredRequests.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return <ErrorMessage message={error} fullScreen onRetry={getRequests} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-12 px-2 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Zgłoszenia serwisowe</h1>
          {user?.role === 'client' && (
            <button
              onClick={() => navigate('/new-request')}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Nowe zgłoszenie
            </button>
          )}
        </div>

        <div className="bg-white shadow rounded-lg mb-6 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                Szukaj
              </label>
              <input
                type="text"
                name="search"
                id="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Szukaj w opisie, lokalizacji..."
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Wszystkie</option>
                <option value="New">Nowe</option>
                <option value="InProgress">W trakcie</option>
                <option value="Completed">Zakończone</option>
                <option value="Cancelled">Anulowane</option>
              </select>
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Kategoria
              </label>
              <select
                id="category"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Wszystkie</option>
                <option value="plumbing">Hydraulika</option>
                <option value="electrical">Elektryka</option>
                <option value="carpentry">Stolarstwo</option>
                <option value="painting">Malowanie</option>
                <option value="cleaning">Sprzątanie</option>
                <option value="other">Inne</option>
              </select>
            </div>
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                Priorytet
              </label>
              <select
                id="priority"
                name="priority"
                value={filters.priority}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Wszystkie</option>
                <option value="high">Wysoki</option>
                <option value="medium">Średni</option>
                <option value="low">Niski</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ status: '', category: '', priority: '', search: '' })}
                className="w-full px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Wyczyść filtry
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Brak zgłoszeń do wyświetlenia</p>
            </div>
          ) : (
            <>
              <ul className="divide-y divide-gray-200">
                {paginatedRequests.map((request) => (
                  <li key={request._id}>
                    <div className="px-4 py-4 hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/requests/${request._id}`)}>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                          <p className="text-sm font-medium text-indigo-600 truncate">
                            {getCategoryLabel(request.category)}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(request.priority)}`}>
                              {request.priority === 'high' ? 'Wysoki' : request.priority === 'medium' ? 'Średni' : 'Niski'} priorytet
                            </span>
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
                              {request.status === 'New' ? 'Nowe' : request.status === 'InProgress' ? 'W trakcie' : request.status === 'Completed' ? 'Zakończone' : 'Anulowane'}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(request.createdAt).toLocaleString('pl-PL')}
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {request.description}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-gray-200">
                  <div className="flex justify-between sm:hidden mb-4">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                        currentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Poprzednia
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                        currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Następna
                    </button>
                  </div>
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="mb-4 sm:mb-0">
                      <p className="text-sm text-gray-700">
                        Wyświetlanie{' '}
                        <span className="font-medium">{startIndex + 1}</span>
                        {' - '}
                        <span className="font-medium">
                          {Math.min(endIndex, filteredRequests.length)}
                        </span>
                        {' z '}
                        <span className="font-medium">{filteredRequests.length}</span>
                        {' wyników'}
                      </p>
                    </div>
                    <div className="hidden sm:flex">
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                            currentPage === 1
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-white text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          <span className="sr-only">Poprzednia</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i + 1}
                            onClick={() => handlePageChange(i + 1)}
                            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                              currentPage === i + 1
                                ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                : 'bg-white text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                            currentPage === totalPages
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-white text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          <span className="sr-only">Następna</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceRequestList; 