import { createRoot } from "react-dom/client";

// Apply saved theme before render to prevent flash
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark');
}
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
