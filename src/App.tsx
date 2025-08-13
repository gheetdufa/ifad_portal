import React, { ErrorBoundary } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useSearchParams, useLocation } from 'react-router-dom';
import { AuthContext, useAuthProvider, useAuth } from './hooks/useAuth';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentRegistration from './pages/student/StudentRegistration';
import HostList from './pages/student/HostList';
import HostDashboard from './pages/host/HostDashboard';
import HostRegistration from './pages/host/HostRegistration';
import HostSemesterRegistration from './pages/host/HostSemesterRegistration';
import HostSignup from './pages/host/HostSignup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminDashboard from './pages/admin/AdminDashboard';
import HostManagement from './pages/admin/HostManagement';
import StudentApplications from './pages/admin/StudentApplications';
import MatchingSystem from './pages/admin/MatchingSystem';
import Reports from './pages/admin/Reports';
import Communication from './pages/admin/Communication';
import Settings from './pages/admin/Settings';
import TimelineManagement from './pages/admin/TimelineManagement';
import { apiService } from './services/api';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles: string[] }> = ({ 
  children, 
  allowedRoles 
}) => {
  const { user, isLoading } = useAuth();
  console.log('[route] ProtectedRoute check', { allowedRoles, hasUser: !!user, isLoading, role: user?.role });
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-umd-red border-t-transparent"></div>
      </div>
    );
  }
  
  if (!user) {
    console.warn('[route] no user; redirecting to /login');
    return <Navigate to="/login" replace />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    console.warn('[route] role not allowed; redirecting to /');
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Auth-aware Login Route - redirects if already authenticated
const AuthAwareLoginRoute: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [checking, setChecking] = React.useState(false);
  const [redirectPath, setRedirectPath] = React.useState<string | null>(null);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-umd-red border-t-transparent"></div>
      </div>
    );
  }
  
  if (user) {
    // If host, check profile completion to choose destination
    if (user.role === 'host' && !checking && redirectPath === null) {
      setChecking(true);
      (async () => {
        try {
          const resp = await apiService.getProfile();
          const profileStage = resp.success ? resp.data?.profileStage : undefined;
          const dest = profileStage === 'incomplete' ? '/host/registration' : '/host';
          setRedirectPath(dest);
        } catch {
          setRedirectPath('/host');
        } finally {
          setChecking(false);
        }
      })();
    }
    if (redirectPath) return <Navigate to={redirectPath} replace />;
    if (checking) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-umd-red border-t-transparent"></div>
        </div>
      );
    }
    const dashboardPath = user.role === 'admin' ? '/admin' : user.role === 'student' ? '/student' : '/host';
    return <Navigate to={dashboardPath} replace />;
  }
  
  return <LoginPage />;
};

// Host profile gate for guarding host routes that require a completed profile
const HostProfileGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = React.useState(true);
  const [mustComplete, setMustComplete] = React.useState(false);
  const location = useLocation();

  React.useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const resp = await apiService.getProfile();
        const stage = resp.success ? resp.data?.profileStage : undefined;
        if (isMounted) setMustComplete(stage === 'incomplete');
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-umd-red border-t-transparent"></div>
      </div>
    );
  }

  if (mustComplete && location.pathname !== '/host/registration') {
    return <Navigate to="/host/registration" replace />;
  }

  return <>{children}</>;
};

// Registration Router Component to handle query params
const RegistrationRouter: React.FC = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');
  
  if (type === 'host') {
    return <Navigate to="/register/host" replace />;
  }
  return <Navigate to="/register/student" replace />;
};

function App() {
  const auth = useAuthProvider();

  return (
    <AuthContext.Provider value={auth}>
      <Router>
        <div className="min-h-screen flex flex-col bg-white">
          <Header />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<AuthAwareLoginRoute />} />
              <Route path="/public-hosts" element={
                <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-2 border-umd-red border-t-transparent"></div></div>}>
                  {React.createElement(React.lazy(() => import('./pages/PublicHostList')))}
                </React.Suspense>
              } />
              
              {/* Registration Routes */}
              <Route path="/register" element={<RegistrationRouter />} />
              <Route path="/register/student" element={<StudentRegistration />} />
              {/* Host profile requires login now */}
               <Route 
                 path="/register/host" 
                 element={<Navigate to="/login?type=host" replace />} 
               />
              <Route path="/signup/host" element={<HostSignup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/register/host/semester" element={<HostSemesterRegistration />} />
              
              {/* Student Routes */}
              <Route 
                path="/student/*" 
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <Routes>
                      <Route index element={<StudentDashboard />} />
                      <Route path="application" element={<StudentRegistration />} />
                      <Route path="host-list" element={<HostList />} />
                    </Routes>
                  </ProtectedRoute>
                } 
              />
              
              {/* Host Routes */}
              <Route 
                path="/host/*" 
                element={
                  <ProtectedRoute allowedRoles={['host']}>
                    <Routes>
                      <Route index element={<HostProfileGate><HostDashboard /></HostProfileGate>} />
                      <Route path="registration" element={<HostRegistration />} />
                      <Route path="semester-registration" element={<HostProfileGate><HostSemesterRegistration /></HostProfileGate>} />
                    </Routes>
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin Routes */}
              <Route 
                path="/admin/*" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Routes>
                      <Route index element={<AdminDashboard />} />
                      <Route path="hosts" element={<HostManagement />} />
                      <Route path="applications" element={<StudentApplications />} />
                      <Route path="matching" element={<MatchingSystem />} />
                      <Route path="reports" element={<Reports />} />
                      <Route path="communication" element={<Communication />} />
                      <Route path="settings" element={<Settings />} />
                      <Route path="timeline" element={<TimelineManagement />} />
                    </Routes>
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;