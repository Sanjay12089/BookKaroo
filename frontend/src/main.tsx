import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GOOGLE_FONTS_URL, globalCSS } from './design';
import Preview from './design/screens/Preview';

// Inject Google Fonts
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = GOOGLE_FONTS_URL;
document.head.appendChild(link);

// Inject global CSS (animations, scrollbar, transitions)
const style = document.createElement('style');
style.textContent = globalCSS;
document.head.appendChild(style);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Preview />
  </StrictMode>,
);
