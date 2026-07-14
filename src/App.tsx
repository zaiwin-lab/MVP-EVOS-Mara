import { Navigate, Route, Routes } from "react-router-dom";
import { eventConfig } from "./config/eventConfig";
import { FloatingActions } from "./components/FloatingActions";
import Landing from "./pages/Landing";
import Programme from "./pages/Programme";
import Trainers from "./pages/Trainers";
import Resources from "./pages/Resources";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Attend from "./pages/Attend";
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
    <>
    <Routes>
      {/* Public landing + event-scoped QR entry points */}
      <Route path="/" element={<Landing />} />
      <Route path={`/event/${slug}`} element={<Landing />} />
      {/* Registration QR (new + legacy check-in path both register) */}
      <Route path={`/event/${slug}/register`} element={<Register />} />
      <Route path={`/event/${slug}/check-in`} element={<Register />} />

      {/* Participant portal */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/check-in" element={<Navigate to="/register" replace />} />
      <Route path="/my" element={<Journey />} />
      <Route path="/journey" element={<Journey />} />
      <Route path="/attend/:session" element={<Attend />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/assessment" element={<Assessment />} />
      <Route path="/result" element={<Results />} />
      <Route path="/action-plan" element={<ActionPlan />} />
      <Route path="/reflection" element={<Reflection />} />

      {/* Programme information */}
      <Route path="/programme" element={<Programme />} />
      <Route path="/trainers" element={<Trainers />} />
      <Route path="/resources" element={<Resources />} />

      {/* Utilities */}
      <Route path="/qr" element={<QRPage />} />

      {/* Admin */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/participant/:id" element={<AdminParticipant />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    <FloatingActions />
    </>
  );
}
