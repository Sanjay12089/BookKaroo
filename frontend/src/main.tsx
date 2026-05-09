import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GOOGLE_FONTS_URL, globalCSS, themeCSS, ThemeProvider } from './design';
import Preview from './design/screens/Preview';

// Theme CSS must be first so vars are defined before any component renders
const themeStyle = document.createElement('style');
themeStyle.textContent = themeCSS;
document.head.appendChild(themeStyle);

// Google Fonts
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = GOOGLE_FONTS_URL;
document.head.appendChild(link);

// Animation + scrollbar + transition utilities
const globalStyle = document.createElement('style');
globalStyle.textContent = globalCSS;
document.head.appendChild(globalStyle);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <Preview />
    </ThemeProvider>
  </StrictMode>,
);
