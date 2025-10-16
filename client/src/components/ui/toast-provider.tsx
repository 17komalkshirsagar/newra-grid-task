import React from 'react';
import { Toaster } from 'react-hot-toast';

interface ToastProviderProps {
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  duration?: number;
  successDuration?: number;
  errorDuration?: number;
}

const ToastProvider: React.FC<ToastProviderProps> = ({
  position = 'top-right',
  duration = 4000,
  successDuration = 3000,
  errorDuration = 5000,
}) => {
  return (
    <Toaster
      position={position}
      toastOptions={{
        duration: duration,
        style: {
          background: '#363636',
          color: '#fff',
        },
        success: {
          duration: successDuration,
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
        },
        error: {
          duration: errorDuration,
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
      }}
    />
  );
};

export default ToastProvider;