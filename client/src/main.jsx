import { createRoot } from "react-dom/client";
// importing components
import App from "./App.jsx";
// importing contexts
import { ConfirmationDialogProvider } from "./contexts/ConfirmationDialog.context.jsx";
// importing styling
import "./index.css";

import { Analytics } from "@vercel/analytics/react";

createRoot(document.getElementById("root")).render(
    <>
        <ConfirmationDialogProvider>
            <App />
        </ConfirmationDialogProvider>
        <Analytics />
    </>
);