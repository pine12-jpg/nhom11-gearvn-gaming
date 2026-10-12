import { useNavigate } from "react-router-dom";
import { useCompare } from "../context/CompareContext";

export default function CompareBar() {
  const { ids, toggle, clear, canCompare } = useCompare();
  const navigate = useNavigate();
  if (ids.length === 0) return null;

  return (
    <div className="compare-bar">
      <div className="container">
        <strong>So sánh ({ids.length}/3):</strong>
        {ids.map((id) => (
          <span key={id} className="compare-chip">
            SP #{id}
            <button onClick={() => toggle(id)}>✕</button>
          </span>
        ))}
        <button className="btn btn-primary btn-sm" disabled={!canCompare} onClick={() => navigate(`/so-sanh?ids=${ids.join(",")}`)}>
          Xem so sánh
        </button>
        <button className="btn btn-ghost btn-sm" onClick={clear} style={{ color: "#fff", borderColor: "#444" }}>
          Xóa hết
        </button>
      </div>
    </div>
  );
}
