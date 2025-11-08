type Props = { total: number; showing: number; query: string };
export default function SearchSummary({ total, showing, query }: Props) {
  return (
    <div className="text-sm text-gray-600">
      Showing <b>{showing}</b> of <b>{total}</b>{query ? <> for "<b>{query}</b>"</> : ""}
    </div>
  );
}
