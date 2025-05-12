
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// The service worker is now managed by vite-plugin-pwa
// No need for manual registration

createRoot(document.getElementById("root")!).render(<App />);
