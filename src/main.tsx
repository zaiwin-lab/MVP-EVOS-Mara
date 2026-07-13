import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { I18nProvider } from "./context/I18nContext";
import { ParticipantProvider } from "./context/ParticipantContext";
import { store } from "./data/store";
import { seedRecords } from "./data/seed";

// On a fresh local device, load demo participants so the admin
// dashboard is never empty during a demonstration. No-op once real
// data exists, and never runs against a shared Supabase backend.
void store.seedIfEmpty(seedRecords());

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <I18nProvider>
        <ParticipantProvider>
          <App />
        </ParticipantProvider>
      </I18nProvider>
    </BrowserRouter>
  </React.StrictMode>
);
