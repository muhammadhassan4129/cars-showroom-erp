import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './Context/AuthContext';
import { CircularProgress } from '@mui/material';

// Pages
import Login from './Pages/auth/Login';
import Dashboard from './Pages/Dashboard';
import Customers from './Pages/Customers';
import Vehicles from './Pages/Vehicles';
import Purchases from './Pages/Purchases';
import Sales from './Pages/Sales';
import Installments from './Pages/Installments';
import Reports from './Pages/Reports';
import Bargains from './Pages/Bargains';
import Commission from './Pages/Commission';
import Subscriptions from './Pages/Subscriptions';
import Profile from './Pages/Profile';
import Settings from './Pages/Settings';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={user ? <Navigate to="/dashboard" /> : <Login />} 
      />

      {/* Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
      <Route path="/vehicles" element={<ProtectedRoute><Vehicles /></ProtectedRoute>} />
      <Route path="/purchases" element={<ProtectedRoute><Purchases /></ProtectedRoute>} />
      <Route path="/sales" element={<ProtectedRoute><Sales /></ProtectedRoute>} />
      <Route path="/installments" element={<ProtectedRoute><Installments /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      <Route path="/bargains" element={<ProtectedRoute><Bargains /></ProtectedRoute>} />
      <Route path="/commission" element={<ProtectedRoute><Commission /></ProtectedRoute>} />
      <Route path="/subscriptions" element={<ProtectedRoute><Subscriptions /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="*" element={<div className="p-8 text-center">Page Not Found</div>} />
    </Routes>
  );
}

export default App;
