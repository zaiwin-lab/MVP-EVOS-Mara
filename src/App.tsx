import { Navigate, Route, Routes } from "react-router-dom";
import { eventConfig } from "./config/eventConfig";
import Landing from "./pages/Landing";
import Programme from "./pages/Programme";
import Trainers from "./pages/Trainers";
import Resources from "./pages/Resources";
import CheckIn from "./pages/CheckIn";
import Journey from "./pages/Journey";
import Profile from "./pages/Profile";
import Assessment from "./pages/Assessment";
import Results from "./pages/Results";
import ActionPlan from "./pages/ActionPlan";
import Reflection from "./pages/Reflection";
import QRPage from "./pages/QRPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminParticipant from "./pages/admin/AdminParticipant";

const slug = eventConfig.slug;

export default function App() {
  return (
    <Routes>
      {/* Public landing + event-scoped QR entry points */}
      <Route path="/" element={<Landing />} />
      <Route path={`/event/${slug}`} element={<Landing />} />
      <Route path={`/event/${slug}/check-in`} element={<CheckIn />} />

      {/* Programme information */}
      <Route path="/programme" element={<Programme />} />
      <Route path="/trainers" element={<Trainers />} />
      <Route path="/resources" element={<Resources />} />

      {/* Participant journey */}
      <Route path="/check-in" element={<CheckIn />} />
      <Route path="/journey" element={<Journey />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/assessment" element={<Assessment />} />
      <Route path="/result" element={<Results />} />
      <Route path="/action-plan" element={<ActionPlan />} />
      <Route path="/reflection" element={<Reflection />} />

      {/* Utilities */}
      <Route path="/qr" element={<QRPage />} />

      {/* Admin */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/participant/:id" element={<AdminParticipant />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
