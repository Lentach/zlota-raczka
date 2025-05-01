import React from 'react';

interface ErrorMessageProps {
  message: string;
  fullScreen?: boolean;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, fullScreen = false, onRetry }) => {
  const content = (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Błąd</h2>
      <p className="text-gray-600 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Spróbuj ponownie
        </button>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default ErrorMessage; 