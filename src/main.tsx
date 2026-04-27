import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

const basename = import.meta.env.BASE_URL;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
      <Toaster 
        position="bottom-right"
        theme="light"
        richColors
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1C1A17',
            color: '#F5F0E8',
            border: '1px solid #C8A97E',
            fontFamily: 'var(--font-body)',
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>,
);
