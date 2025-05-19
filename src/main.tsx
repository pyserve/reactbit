import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ThemeProvider } from "./contexts/theme-provider";
import { AsyncAlertContextProvider } from "./hooks/async-alert-dialog";
import "./index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <GoogleOAuthProvider clientId="292000457428-0r959um9ivqddgulv8ds9llrhp1cf259.apps.googleusercontent.com">
        {/* clientId="292000457428-0r959um9ivqddgulv8ds9llrhp1cf259.apps.googleusercontent.com" */}
        {/* dev clientId="292000457428-9rdjdrjlso61mh7a9sfe2civg6e1mrv5.apps.googleusercontent.com" */}
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AsyncAlertContextProvider>
              <App />
            </AsyncAlertContextProvider>
          </BrowserRouter>
          <Toaster />
        </QueryClientProvider>
      </GoogleOAuthProvider>
    </ThemeProvider>
  </StrictMode>
);
