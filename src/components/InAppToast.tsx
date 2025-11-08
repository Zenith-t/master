import { useEffect, useState } from 'react';

type Notice = { title: string; body: string; url: string };

export default function InAppToast() {
  const [queue, setQueue] = useState<Notice[]>([]);

  useEffect(() => {
    const onNew = (e: Event) => setQueue((q) => [...q, (e as CustomEvent).detail as Notice]);
    window.addEventListener('app:new-listing', onNew as EventListener);
    return () => window.removeEventListener('app:new-listing', onNew as EventListener);
  }, []);

  if (queue.length === 0) return null;
  const current = queue[0];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999]">
      <div className="max-w-md rounded-xl border bg-white shadow-lg p-4">
        <div className="font-semibold">{current.title}</div>
        <div className="text-sm text-gray-600 mt-1">{current.body}</div>
        <div className="mt-3 flex gap-2">
          <a href={current.url} className="inline-flex items-center rounded-md bg-blue-600 text-white px-3 py-1.5 text-sm">View</a>
          <button className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm" onClick={() => setQueue((q) => q.slice(1))}>
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
