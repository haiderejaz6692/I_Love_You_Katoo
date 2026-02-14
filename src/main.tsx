import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initCloudflareWebAnalytics } from "./lib/analytics";

initCloudflareWebAnalytics();

createRoot(document.getElementById("root")!).render(<App />);
