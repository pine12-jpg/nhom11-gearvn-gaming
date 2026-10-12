export default function StarRating({ value = 0, count, size = 13 }) {
  const full = Math.round(value);
  return (
    <span className="product-rating" style={{ fontSize: size }}>
      <span className="stars">
        {"★".repeat(full)}
        {"☆".repeat(5 - full)}
      </span>
      {typeof count === "number" && <span className="count">({count})</span>}
    </span>
  );
}
