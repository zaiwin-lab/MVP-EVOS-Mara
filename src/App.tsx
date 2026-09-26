import { Navigate, Route, Routes } from "react-router-dom";
import { eventConfig } from "./config/eventConfig";
import Landing from "./pages/Landing";
import Programme from "./pages/Programme";
import Trainers from "./pages/Trainers";
import Maklumat from "./pages/Maklumat";
import PromptHub from "./pages/PromptHub";
import WorkArea from "./pages/WorkArea";
import PromptBuilder from "./pages/PromptBuilder";
import Readiness from "./pages/Readiness";
import Sumber from "./pages/Sumber";
import Gallery from "./pages/Gallery";
import CheckIn from "./pages/CheckIn";
import Certificate from "./pages/Certificate";
import Attend from "./pages/Attend";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminParticipant from "./pages/admin/AdminParticipant";

const slug = eventConfig.slug;

/**
 * Routes for a one-day programme.
 *
 * Check in, see what is happening today, use a prompt, take the modules home.
 * Everything else was a page that existed because the system could have one.
 *
 * The retired routes still resolve rather than 404: the QR codes, the slides
 * and the WhatsApp messages that carry them are already printed and sent, and
 * a dead link on the programme morning is not recoverable.
 */
export default function App() {
  return (
    <Routes>
      {/* Home — hero, today's programme, the six work areas, modules, FAQ */}
      <Route path="/" element={<Landing />} />
      <Route path={`/event/${slug}`} element={<Landing />} />

      {/* The day, and who delivers it */}
      <Route path="/program" element={<Programme />} />
      <Route path="/trainers" element={<Trainers />} />
      <Route path="/maklumat" element={<Maklumat />} />

      {/* Prompt Hub — 6 work areas → 10 prompts → builder */}
      <Route path="/prompt-hub" element={<PromptHub />} />
      <Route path="/prompt-hub/:areaId" element={<WorkArea />} />
      <Route path="/prompt-hub/:areaId/:missionId" element={<PromptBuilder />} />

      {/* Five questions, ending in one suggested work area */}
      <Route path="/readiness" element={<Readiness />} />

      {/* Modules and photographs */}
      <Route path="/sumber" element={<Sumber />} />
      <Route path="/galeri" element={<Gallery />} />

      {/* Registration. None of these mark attendance — that only ever happens
          by scanning the QR on the programme day (/hadir). */}
      <Route path="/check-in" element={<CheckIn />} />
      <Route path={`/event/${slug}/check-in`} element={<CheckIn />} />
      <Route path="/register" element={<CheckIn />} />
      <Route path="/daftar" element={<CheckIn />} />
      <Route path={`/event/${slug}/register`} element={<CheckIn />} />

      {/* Attendance and the e-certificate it unlocks */}
      <Route path="/hadir" element={<Attend />} />
      <Route path="/attend" element={<Attend />} />
      <Route path={`/event/${slug}/hadir`} element={<Attend />} />
      <Route path="/sijil" element={<Certificate />} />
      <Route path="/certificate" element={<Certificate />} />

      {/* Retired pages. The FAQ is on the home page; the 90-day pacing moved
          to the foot of each work area; the personal dashboard and the
          separate sign-in page are gone. */}
      <Route path="/faq" element={<Navigate to="/#faq" replace />} />
      <Route path="/journey" element={<Navigate to="/prompt-hub" replace />} />
      <Route path="/my" element={<Navigate to="/prompt-hub" replace />} />
      <Route path="/login" element={<Navigate to="/check-in" replace />} />

      {/* Admin */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/participant/:id" element={<AdminParticipant />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
