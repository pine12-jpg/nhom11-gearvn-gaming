import { useEffect, useState } from "react";
import api from "../api/client";

/** US25 — Tra cứu địa chỉ và giờ mở cửa showroom gần nhất */
export default function Showrooms() {
  const [q, setQ] = useState("");
  const [list, setList] = useState([]);

  useEffect(() => {
    const t = setTimeout(() => {
      api.get("/showrooms", { params: { q } }).then(({ data }) => setList(data));
    }, 200);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className="page container">
      <h1 style={{ fontSize: 21 }}>🏬 Hệ thống showroom</h1>
      <p className="muted">Tra cứu địa chỉ và giờ mở cửa của các chi nhánh GVN Gaming gần bạn.</p>

      <div className="card mt-16">
        <input
          className="form-control"
          placeholder="Tìm theo quận/thành phố (VD: Quận 1, Hà Nội…)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="mt-16">
          {list.length === 0 && <p className="muted center">Không tìm thấy showroom phù hợp.</p>}
          {list.map((s) => (
            <div className="showroom-card" key={s.id}>
              <div className="ico">🏬</div>
              <div>
                <strong>{s.name}</strong>
                <p className="muted" style={{ margin: "4px 0" }}>{s.address}</p>
                <p className="muted" style={{ margin: 0, fontSize: 12.5 }}>🕒 {s.hours} • ☎ {s.phone}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
