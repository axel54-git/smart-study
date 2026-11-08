import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register Service Worker for PWA Installation and Offline Caching
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('New SmartStudy update available');
  },
  onOfflineReady() {
    console.log('SmartStudy ready for offline use');
  },
});

createRoot(document.getElementById('root')!).render(<App />);
