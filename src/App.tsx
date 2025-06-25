import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { AuthContext, useAuthProvider } from './hooks/useAuth';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentRegistration from './pages/student/StudentRegistration';
import HostList from './pages/student/HostList';
import HostDashboard from './pages/host/HostDashboard';
import HostRegistration from './pages/host/HostRegistration';
import AdminDashboard from './pages/admin/AdminDashboard';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles: string[] }> = ({ 
  children, 
  allowedRoles 
}) => {
  const { user, isLoading } = useAuthProvider();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-umd-red border-t-transparent"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
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
              <Route path="/login" element={<LoginPage />} />
              <Route path="/public-hosts" element={
                <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-2 border-umd-red border-t-transparent"></div></div>}>
                  {React.createElement(React.lazy(() => import('./pages/PublicHostList')))}
                </React.Suspense>
              } />
              
              {/* Registration Routes */}
              <Route path="/register" element={<RegistrationRouter />} />
              <Route path="/register/student" element={<StudentRegistration />} />
              <Route path="/register/host" element={<HostRegistration />} />
              
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
                      <Route index element={<HostDashboard />} />
                      {/* Add more host routes here */}
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
                      {/* Add more admin routes here */}
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