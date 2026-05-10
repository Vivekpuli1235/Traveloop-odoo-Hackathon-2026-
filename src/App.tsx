import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import CreateTrip from "./pages/CreateTrip";
import TripDetails from "./pages/TripDetails";
import PublicTrip from "./pages/PublicTrip";
import Profile from "./pages/Profile";
import Activities from "./pages/Activities";
import Community from "./pages/Community";
import Expenses from "./pages/Expenses";
import Explore from "./pages/Explore";
import ItineraryBuilder from "./pages/ItineraryBuilder";
import Notes from "./pages/Notes";
import PackingChecklist from "./pages/PackingChecklist";
import Trips from "./pages/Trips";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? <>{children}</> : <Navigate to="/auth" />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans flex flex-col">
          <Navbar />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/trips/new" element={<PrivateRoute><CreateTrip /></PrivateRoute>} />
              <Route path="/trips/:id" element={<PrivateRoute><TripDetails /></PrivateRoute>} />
              <Route path="/trips" element={<PrivateRoute><Trips /></PrivateRoute>} />
              <Route path="/shared/:id" element={<PublicTrip />} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/activities" element={<PrivateRoute><Activities /></PrivateRoute>} />
              <Route path="/community" element={<PrivateRoute><Community /></PrivateRoute>} />
              <Route path="/expenses" element={<PrivateRoute><Expenses /></PrivateRoute>} />
              <Route path="/explore" element={<PrivateRoute><Explore /></PrivateRoute>} />
              <Route path="/itinerary-builder" element={<PrivateRoute><ItineraryBuilder /></PrivateRoute>} />
              <Route path="/notes" element={<PrivateRoute><Notes /></PrivateRoute>} />
              <Route path="/packing-checklist" element={<PrivateRoute><PackingChecklist /></PrivateRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}
