import { useEffect, useState } from 'react';

type Tema = 'dark' | 'light';

// Única ilha React do site (client:idle). O tema inicial já foi definido pelo script anti-flash
// em <html data-theme>; aqui só lemos esse valor e alternamos.
export default function ThemeToggle() {
  const [tema, setTema] = useState<Tema>('dark');

  useEffect(() => {
    setTema(document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
  }, []);

  function alternar() {
    const proximo: Tema = tema === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', proximo);
    try {
      localStorage.setItem('theme', proximo);
    } catch {
      /* armazenamento indisponível: o tema vale só nesta visita */
    }
    setTema(proximo);
  }

  const claro = tema === 'light';
  const icone = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    focusable: false,
  };

  return (
    <button
      type="button"
      onClick={alternar}
      aria-label={claro ? 'Ativar tema escuro' : 'Ativar tema claro'}
      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-border bg-surface text-text transition-colors duration-150 hover:border-accent"
    >
      {claro ? (
        <svg {...icone}>
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      ) : (
        <svg {...icone}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2m-7.07-2.93 1.41-1.41m11.32-11.32 1.41-1.41M2 12h2m16 0h2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41" />
        </svg>
      )}
    </button>
  );
}
