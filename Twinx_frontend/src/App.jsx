import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Documents from "./pages/Documents";
import Sharing from "./pages/Sharing";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import TwinDetails from "./pages/TwinDetails";
import SharedViewer from "./pages/SharedViewer";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('dtx_token');
  return token ? children : <Navigate to="/auth" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/documents"
        element={
          <ProtectedRoute>
            <Documents />
          </ProtectedRoute>
        }
      />

      <Route
        path="/sharing"
        element={
          <ProtectedRoute>
            <Sharing />
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics"
        element={<Analytics />}
      />

      <Route
        path="/settings"
        element={<Settings />}
      />

      <Route
        path="/twins/:twinId"
        element={<TwinDetails />}
      />

      <Route
        path="/share/:token"
        element={<SharedViewer />}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

