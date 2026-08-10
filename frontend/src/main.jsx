import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "#1a1b1f",
              border: "1px solid #3d484f",
              color: "#e3e2e7",
              fontSize: "13px",
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);