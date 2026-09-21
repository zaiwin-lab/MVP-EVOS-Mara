import { Navigate, Route, Routes } from "react-router-dom";
import { eventConfig } from "./config/eventConfig";
import Landing from "./pages/Landing";
import Programme from "./pages/Programme";
import PromptHub from "./pages/PromptHub";
import WorkArea from "./pages/WorkArea";
import PromptBuilder from "./pages/PromptBuilder";
import Readiness from "./pages/Readiness";
import Journey90 from "./pages/Journey90";
import Sumber from "./pages/Sumber";
import Gallery from "./pages/Gallery";
import Faq from "./pages/Faq";
import CheckIn from "./pages/CheckIn";
import MySpace from "./pages/MySpace";
import Certificate from "./pages/Certificate";
import Attend from "./pages/Attend";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminParticipant from "./pages/admin/AdminParticipant";

const slug = eventConfig.slug;

export default function App() {
  return (
    <Routes>
      {/* Public — home + programme */}
      <Route path="/" element={<Landing />} />
      <Route path={`/event/${slug}`} element={<Landing />} />
      <Route path="/program" element={<Programme />} />
      <Route path="/faq" element={<Faq />} />

      {/* Prompt Hub — 6 work areas → 10 missions → builder */}
      <Route path="/prompt-hub" element={<PromptHub />} />
      <Route path="/prompt-hub/:areaId" element={<WorkArea />} />
      <Route path="/prompt-hub/:areaId/:missionId" element={<PromptBuilder />} />

      {/* Readiness + journey */}
      <Route path="/readiness" element={<Readiness />} />
      <Route path="/journey" element={<Journey90 />} />

      {/* Resources + gallery */}
      <Route path="/sumber" element={<Sumber />} />
      <Route path="/galeri" element={<Gallery />} />

      {/* On-site check-in (QR target — marks attendance) */}
      <Route path="/check-in" element={<CheckIn mode="checkin" />} />
      <Route path={`/event/${slug}/check-in`} element={<CheckIn mode="checkin" />} />

      {/* Public promo registration (sign-up, no attendance mark) */}
      <Route path="/register" element={<CheckIn mode="register" />} />
      <Route path="/daftar" element={<CheckIn mode="register" />} />
      <Route path={`/event/${slug}/register`} element={<CheckIn mode="register" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/my" element={<MySpace />} />
      <Route path="/hadir" element={<Attend />} />
      <Route path="/attend" element={<Attend />} />
      <Route path={`/event/${slug}/hadir`} element={<Attend />} />
      <Route path="/sijil" element={<Certificate />} />
      <Route path="/certificate" element={<Certificate />} />

      {/* Admin */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/participant/:id" element={<AdminParticipant />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
