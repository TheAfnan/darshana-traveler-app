import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import React, { Suspense, lazy } from "react";
import { HashRouter, Route, Routes, useLocation } from "react-router-dom";

import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { EcoRewardsProvider } from "./context/EcoRewardsContext";
import EcoNotificationOverlay from "./components/EcoRewards/EcoNotificationOverlay";
import PageLoadingSkeleton from "./components/PageLoadingSkeleton";

// Auth Components
import { GuestOnly, RequireAuth } from "./components/Auth/ProtectedRoute";
import LoginOverlay from "./components/Auth/LoginOverlay";
import SafetyModal from "./components/SafetyModal";
import YatraShayak from "./components/YatraShayak";

// Lazy-loaded Pages (Code-Split for lightning fast initial load)
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const CulturalPlanner = lazy(() => import("./pages/CulturalPlanner"));
const ARGuide = lazy(() => import("./pages/ARGuide"));
const TravelHub = lazy(() => import("./pages/TravelHub"));
const AllCities = lazy(() => import("./pages/AllCities"));
const Lucknow = lazy(() => import("./pages/Lucknow"));
const Festivals = lazy(() => import("./pages/Festivals"));
const Sustainable = lazy(() => import("./pages/Sustainable"));
const GreenRoutePlanner = lazy(() => import("./pages/GreenRoutePlanner"));
const SafetyDashboard = lazy(() => import("./pages/SafetyDashboard"));
const SafetyGuide = lazy(() => import("./pages/SafetyGuide"));
const TravelEssentials = lazy(() => import("./pages/TravelEssentials"));
const Assistant = lazy(() => import("./pages/Assistant"));
const FestivalAlerts = lazy(() => import("./pages/FestivalAlerts"));
const LanguageSelector = lazy(() => import("./pages/LanguageSelector"));
const GuideListing = lazy(() => import("./pages/GuideListing"));
const UIStyleGuide = lazy(() => import("./pages/UIStyleGuide"));
const EcoRewardsDashboard = lazy(() => import("./pages/EcoRewardsDashboard"));
const NotAuthorized = lazy(() => import("./pages/NotAuthorized"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Profile = lazy(() => import("./pages/Profile"));
const MyTrips = lazy(() => import("./pages/MyTrips"));
const MyBookings = lazy(() => import("./pages/MyBookings"));
const BecomeGuide = lazy(() => import("./components/Guide/BecomeGuide"));
const LocalGuideDashboard = lazy(() => import("./pages/LocalGuideDashboard"));
const Booking = lazy(() => import("./pages/Booking"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

// Auto scroll to top when route changes
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
};

const App: React.FC = () => {
  const [isSafetyOpen, setIsSafetyOpen] = React.useState(false);

  return (
    <AuthProvider>
      <EcoRewardsProvider>
        <HashRouter>
          <ScrollToTop />

          {/* Page Wrapper */}
          <div className="min-h-screen flex flex-col bg-primary-50 text-primary-900 font-sans">

            {/* Navbar */}
            <Navbar />

            {/* Page Content with Suspense Code-Splitting */}
            <main className="flex-grow pt-20 sm:pt-24">
              <Suspense fallback={<PageLoadingSkeleton />}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<GuestOnly><><Home /><Login isModal={true} /></></GuestOnly>} />
                  <Route path="/register" element={<GuestOnly><><Home /><Login isModal={true} /></></GuestOnly>} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/planner" element={<CulturalPlanner />} />
                  <Route path="/cultural-engine" element={<CulturalPlanner />} />
                  <Route path="/ar-guide" element={<ARGuide />} />
                  <Route path="/ar" element={<ARGuide />} />
                  <Route path="/travelhub" element={<TravelHub />} />
                  <Route path="/travel-hub" element={<TravelHub />} />
                  <Route path="/cities" element={<AllCities />} />
                  <Route path="/city/lucknow" element={<Lucknow />} />
                  <Route path="/festivals" element={<Festivals />} />
                  <Route path="/sustainable" element={<Sustainable />} />
                  <Route path="/green-route-planner" element={<GreenRoutePlanner />} />
                  <Route path="/safety" element={<SafetyDashboard />} />
                  <Route path="/safety-guide" element={<SafetyGuide />} />
                  <Route path="/travel-essentials" element={<TravelEssentials />} />
                  <Route path="/assistant" element={<Assistant />} />
                  <Route path="/festival-alerts" element={<FestivalAlerts />} />
                  <Route path="/language" element={<LanguageSelector />} />
                  <Route path="/guides" element={<GuideListing />} />
                  <Route path="/style-guide" element={<UIStyleGuide />} />
                  <Route path="/rewards" element={<EcoRewardsDashboard />} />
                  <Route path="/not-authorized" element={<NotAuthorized />} />
                  
                  {/* Guest Only Routes */}
                  <Route path="/forgot-password" element={<GuestOnly><ForgotPassword /></GuestOnly>} />
                  <Route path="/reset-password/:token" element={<GuestOnly><ResetPassword /></GuestOnly>} />
                  
                  {/* Protected Routes */}
                  <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
                  <Route path="/my-trips" element={<RequireAuth><MyTrips /></RequireAuth>} />
                  <Route path="/my-bookings" element={<RequireAuth><MyBookings /></RequireAuth>} />
                  <Route path="/become-guide" element={<BecomeGuide />} />
                  <Route path="/guide-dashboard" element={<LocalGuideDashboard />} />
                  <Route path="/booking" element={<Booking />} />
                  
                  {/* Admin Dashboard */}
                  <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
              </Suspense>
            </main>
            
            {/* Footer & Global Overlays */}
            <Footer />
            <YatraShayak onSafetyClick={() => setIsSafetyOpen(true)} />
            <EcoNotificationOverlay />
            <SpeedInsights />
            <Analytics />

            <SafetyModal isOpen={isSafetyOpen} onClose={() => setIsSafetyOpen(false)} />
            <LoginOverlay />

          </div>
        </HashRouter>
      </EcoRewardsProvider>
    </AuthProvider>
  );
};

export default App;
