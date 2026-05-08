import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext.jsx';
import LoadingScreen from './components/shared/LoadingScreen.jsx';

// Marketing site
import MarketingLayout from './components/marketing/MarketingLayout.jsx';
import Home from './pages/marketing/Home.jsx';
import Services from './pages/marketing/Services.jsx';
import Insight from './pages/marketing/Insight.jsx';
import About from './pages/marketing/About.jsx';
import Contact from './pages/marketing/Contact.jsx';

// Auth
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';

// Survey (no login)
import Survey from './pages/Survey.jsx';
import ThankYou from './pages/ThankYou.jsx';

// Dashboard
import DashboardLayout from './components/shared/DashboardLayout.jsx';
import DashboardOverview from './pages/dashboard/Overview.jsx';
import Batches from './pages/dashboard/Batches.jsx';
import BatchDetail from './pages/dashboard/BatchDetail.jsx';
import Credits from './pages/dashboard/Credits.jsx';
import Settings from './pages/dashboard/Settings.jsx';

// Admin
import AdminLayout from './components/shared/AdminLayout.jsx';
import AdminOverview from './pages/admin/Overview.jsx';
import AdminOrganizations from './pages/admin/Organizations.jsx';
import AdminBatches from './pages/admin/Batches.jsx';
import AdminCredits from './pages/admin/Credits.jsx';
import AdminPackages from './pages/admin/Packages.jsx';
import AdminBenchmark from './pages/admin/Benchmark.jsx';
import AdminFormulas from './pages/admin/Formulas.jsx';
import AdminPricing from './pages/admin/Pricing.jsx';
import AdminCMS from './pages/admin/CMS.jsx';

function ProtectedRoute({ children, role }) {
  const { isAuthenticated, profile, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role === 'super_admin' && profile?.role !== 'super_admin') return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Marketing site (ansaka.com) */}
      <Route element={<MarketingLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/insight" element={<Insight />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Public Survey (no login) */}
      <Route path="/survey/:token" element={<Survey />} />
      <Route path="/survey/:token/thankyou" element={<ThankYou />} />

      {/* Corporate Admin Dashboard */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardOverview />} />
        <Route path="/dashboard/batches" element={<Batches />} />
        <Route path="/dashboard/batch/:id" element={<BatchDetail />} />
        <Route path="/dashboard/credits" element={<Credits />} />
        <Route path="/dashboard/settings" element={<Settings />} />
      </Route>

      {/* Super Admin Panel */}
      <Route element={<ProtectedRoute role="super_admin"><AdminLayout /></ProtectedRoute>}>
        <Route path="/admin" element={<AdminOverview />} />
        <Route path="/admin/organizations" element={<AdminOrganizations />} />
        <Route path="/admin/batches" element={<AdminBatches />} />
        <Route path="/admin/credits" element={<AdminCredits />} />
        <Route path="/admin/packages" element={<AdminPackages />} />
        <Route path="/admin/benchmark" element={<AdminBenchmark />} />
        <Route path="/admin/formulas" element={<AdminFormulas />} />
        <Route path="/admin/pricing" element={<AdminPricing />} />
        <Route path="/admin/cms" element={<AdminCMS />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
