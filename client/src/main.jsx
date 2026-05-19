import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./components/error-fallback.jsx";

import "./index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <App />
            </ErrorBoundary>
            <ReactQueryDevtools initialIsOpen={true} />
        </QueryClientProvider>
    </StrictMode>,
);
