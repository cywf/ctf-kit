import { useEffect, useState } from 'react';

const themes = [
  { id: 'night', name: 'Nightfall' },
  { id: 'dracula', name: 'Dracula' },
  { id: 'cyberpunk', name: 'Cyberpunk' },
  { id: 'dark-neon', name: 'Dark Neon' },
  { id: 'hackerman', name: 'Hackerman' },
  { id: 'gamecore', name: 'Gamecore' },
  { id: 'neon-accent', name: 'Neon Accent' },
];

const DEFAULT_THEME = import.meta.env.DEFAULT_THEME || 'night';

export default function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState<string>(DEFAULT_THEME);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && themes.some(t => t.id === savedTheme)) {
      setCurrentTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
      return;
    }

    // Check prefers-color-scheme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = prefersDark ? DEFAULT_THEME : 'night';
    setCurrentTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  const handleThemeChange = (themeId: string) => {
    setCurrentTheme(themeId);
    document.documentElement.setAttribute('data-theme', themeId);
    localStorage.setItem('theme', themeId);
  };

  if (!mounted) {
    return (
      <div className="dropdown dropdown-end">
        <button
          tabIndex={0}
          className="btn btn-ghost btn-circle"
          aria-label="Theme selector"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="w-5 h-5 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
            />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="dropdown dropdown-end">
      <button
        tabIndex={0}
        className="btn btn-ghost btn-circle"
        aria-label="Theme selector"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="w-5 h-5 stroke-current"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
      </button>
      <ul
        tabIndex={0}
        className="menu dropdown-content z-[1] p-2 shadow bg-base-200 rounded-box w-52 mt-4"
        role="menu"
      >
        {themes.map((theme) => (
          <li key={theme.id} role="none">
            <button
              onClick={() => handleThemeChange(theme.id)}
              className={`justify-between ${currentTheme === theme.id ? 'active' : ''}`}
              role="menuitem"
              aria-current={currentTheme === theme.id ? 'true' : 'false'}
            >
              <span>{theme.name}</span>
              {currentTheme === theme.id && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
