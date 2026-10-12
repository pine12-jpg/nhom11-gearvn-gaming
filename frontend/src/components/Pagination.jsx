export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="pagination">
      <button onClick={() => onChange(page - 1)} disabled={page <= 1}>‹</button>
      {start > 1 && <button onClick={() => onChange(1)}>1</button>}
      {start > 2 && <span style={{ alignSelf: "center" }}>…</span>}
      {pages.map((p) => (
        <button key={p} className={p === page ? "active" : ""} onClick={() => onChange(p)}>
          {p}
        </button>
      ))}
      {end < totalPages - 1 && <span style={{ alignSelf: "center" }}>…</span>}
      {end < totalPages && <button onClick={() => onChange(totalPages)}>{totalPages}</button>}
      <button onClick={() => onChange(page + 1)} disabled={page >= totalPages}>›</button>
    </div>
  );
}
