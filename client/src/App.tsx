import React, { Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AppProviders from './components/providers/AppProviders';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import PublicHeader from './components/PublicHeader';
import PublicFooter from './components/PublicFooter';
import LoadingSpinner from './components/LoadingSpinner';
import NotFoundPage from './components/NotFoundPage';
import DemoAutoLogin from './components/DemoAutoLogin';
import { WhatsAppButton } from './components/ui/WhatsAppButton';


const LoginPage = React.lazy(() => import('./auth/login/LoginPage'));
const RegisterPage = React.lazy(() => import('./auth/register/RegisterPage'));
const ForgotPasswordPage = React.lazy(() => import('./auth/forgot-password/ForgotPasswordPage'));
const VerifyOTPPage = React.lazy(() => import('./auth/verify-otp/VerifyOTPPage'));
const BillUploadPage = React.lazy(() => import('./pages/bill-parsing/add/BillUploadPage'));
const BillTablePage = React.lazy(() => import('./pages/bill-parsing/table/BillTablePage'));
const BillViewPage = React.lazy(() => import('./pages/bill-parsing/view/BillViewPage'));
const ScenarioCreatePage = React.lazy(() => import('./pages/scenario-simulation/add/ScenarioCreatePage'));
const ScenarioTablePage = React.lazy(() => import('./pages/scenario-simulation/table/ScenarioTablePage'));
const AnalyticsDashboard = React.lazy(() => import('./pages/analytics-dashboard/view/AnalyticsDashboard'));
const UserCreatePage = React.lazy(() => import('./pages/user-management/add/UserCreatePage'));
const UserEditPage = React.lazy(() => import('./pages/user-management/edit/UserEditPage'));
const UserTablePage = React.lazy(() => import('./pages/user-management/table/UserTablePage'));

const IntegrationCreatePage = React.lazy(() => import('./pages/integration-management/add/IntegrationCreatePage'));
const IntegrationEditPage = React.lazy(() => import('./pages/integration-management/edit/IntegrationEditPage'));
const IntegrationTablePage = React.lazy(() => import('./pages/integration-management/table/IntegrationTablePage'));



const ReportTablePage = React.lazy(() => import('./pages/report-management/ReportTablePage'));
const ReportGeneratePage = React.lazy(() => import('./pages/report-management/ReportGeneratePage'));
const ContactMessagesPage = React.lazy(() => import('./pages/contact-management/ContactMessagesPage'));
const HomePage = React.lazy(() => import('./pages/public/HomePage'));
const AboutPage = React.lazy(() => import('./pages/public/AboutPage'));
const ContactPage = React.lazy(() => import('./pages/public/ContactPage'));
const ServicesPage = React.lazy(() => import('./pages/public/ServicesPage'));
const PricingPage = React.lazy(() => import('./pages/public/PricingPage'));
const GalleryPage = React.lazy(() => import('./pages/public/GalleryPage'));
const SolarCalculatorPage = React.lazy(() => import('./pages/public/SolarCalculatorPage'));
const SolarIrradianceMapPage = React.lazy(() => import('./pages/public/SolarIrradianceMapPage'));



const AppContent = () => {
  const location = useLocation();


  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="App">
      <ErrorBoundary>
        {isAdminRoute ? (
          <Layout>
            <Suspense fallback={<LoadingSpinner message="Loading page..." />}>
              <Routes>

                <Route path="/admin/dashboard" element={<AnalyticsDashboard />} />

                <Route path="/admin/bill-parsing" element={<Navigate to="/admin/bill-parsing/table" replace />} />
                <Route path="/admin/bill-parsing/add" element={<BillUploadPage />} />
                <Route path="/admin/bill-parsing/table" element={<BillTablePage />} />
                <Route path="/admin/bill-parsing/view/:id" element={<BillViewPage />} />


                <Route path="/admin/scenario-simulation" element={<Navigate to="/admin/scenario-simulation/table" replace />} />
                <Route path="/admin/scenario-simulation/add" element={<ScenarioCreatePage />} />
                <Route path="/admin/scenario-simulation/table" element={<ScenarioTablePage />} />


                <Route path="/admin/analytics-dashboard/view" element={<AnalyticsDashboard />} />


                <Route path="/admin/user-management" element={<Navigate to="/admin/user-management/table" replace />} />
                <Route path="/admin/user-management/add" element={<UserCreatePage />} />
                <Route path="/admin/user-management/edit/:id" element={<UserEditPage />} />
                <Route path="/admin/user-management/table" element={<UserTablePage />} />


                <Route path="/admin/integration-management" element={<Navigate to="/admin/integration-management/table" replace />} />
                <Route path="/admin/integration-management/add" element={<IntegrationCreatePage />} />
                <Route path="/admin/integration-management/edit/:id" element={<IntegrationEditPage />} />
                <Route path="/admin/integration-management/table" element={<IntegrationTablePage />} />


                <Route path="/admin/report-management" element={<Navigate to="/admin/report-management/table" replace />} />
                <Route path="/admin/report-management/table" element={<ReportTablePage />} />
                <Route path="/admin/report-management/generate" element={<ReportGeneratePage />} />


                <Route path="/admin/contact" element={<ContactMessagesPage />} />


                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />


                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </Layout>
        ) : (
          <>
            <PublicHeader />
            <Suspense fallback={<LoadingSpinner message="Loading page..." />}>
              <Routes>

                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/calculator" element={<SolarCalculatorPage />} />
                <Route path="/solar-map" element={<SolarIrradianceMapPage />} />


                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/verify-otp" element={<VerifyOTPPage />} />


                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
            <PublicFooter />
            <WhatsAppButton />
          </>
        )}
      </ErrorBoundary>
    </div>
  );
};

function App() {
  return (
    <AppProviders>
      <DemoAutoLogin />
      <AppContent />
    </AppProviders>
  );
}

export default App;