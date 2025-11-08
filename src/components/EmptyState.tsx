type Props = { title?: string; subtitle?: string };
export default function EmptyState({ title = "No results", subtitle = "Try a different search." }: Props) {
  return (
    <div className="rounded-2xl border p-8 text-center text-sm text-gray-600">
      <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-gray-100 grid place-items-center">🔎</div>
      <div className="font-semibold">{title}</div>
      <div className="mt-1 text-gray-500">{subtitle}</div>
    </div>
  );
}
