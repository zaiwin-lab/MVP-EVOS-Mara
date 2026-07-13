import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { I18nProvider } from "./context/I18nContext";
import { ParticipantProvider } from "./context/ParticipantContext";

// Production: the system starts clean — no seed/demo data. Participants
// are created only through live registration.

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
