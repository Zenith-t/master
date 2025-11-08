import { useEffect, useRef, useState } from 'react';

type Props = {
  value?: string;
  onChange: (q: string) => void;
  placeholder?: string;
  className?: string;
  delay?: number;
};

export default function SearchBar({ value = '', onChange, placeholder = 'Search...', className = '', delay = 300 }: Props) {
  const [inner, setInner] = useState(value);
  const t = useRef<number | null>(null);

  useEffect(() => { setInner(value); }, [value]);

  useEffect(() => {
    if (t.current) window.clearTimeout(t.current);
    t.current = window.setTimeout(() => onChange(inner.trimStart()), delay);
    return () => { if (t.current) window.clearTimeout(t.current); };
  }, [inner, delay]);

  return (
    <div className={`flex items-center gap-2 rounded-xl border px-3 py-2 shadow-sm bg-white ${className}`}>
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
      </svg>
      <input
        value={inner}
        onChange={(e) => setInner(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent outline-none"
        aria-label="Search"
      />
      {inner && (
        <button onClick={() => setInner('')} aria-label="Clear search" className="rounded-md px-2 py-1 text-xs hover:bg-gray-100">
          Clear
        </button>
      )}
    </div>
  );
}
