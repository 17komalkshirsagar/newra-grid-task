import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { ThemeProvider } from '@/context/ThemeContext';
import ToastProvider from '@/components/ui/toast-provider';

interface AppProvidersProps {
  children: React.ReactNode;
}

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router>
          {children}
          <ToastProvider />
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default AppProviders;